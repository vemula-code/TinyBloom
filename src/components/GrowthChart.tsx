import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChartType, Gender, GrowthEntry, MetricUnit, WHOPercentileRow } from '../types/growth';
import { getWHOTable, kgToLbsOz, cmToInches, calculatePercentile, calculateAge } from '../data/whoGrowthStandards';
import { X, Edit2 } from 'lucide-react';

interface GrowthChartProps {
  entries: GrowthEntry[];
  chartType: ChartType;
  onChangeChartType?: (type: ChartType) => void;
  showMetricSwitcher?: boolean;
  gender: Gender;
  unit: MetricUnit;
  babyName: string;
  babyAgeMonths?: number;
  babyBirthDate?: string;
  timelineRange?: 'auto' | 6 | 12 | 18 | 24;
  onOpenAddModal?: () => void;
  onOpenSettings?: () => void;
  onEditEntry?: (entry: GrowthEntry) => void;
}

// Monotone Cubic Hermite Spline (Fritsch-Carlson) for smooth WHO percentile curves without ripples or overshoot
function getMonotoneSplinePath(points: { x: number; y: number }[]): string {
  const n = points.length;
  if (n === 0) return '';
  if (n === 1) return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  if (n === 2) {
    return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} L ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}`;
  }

  const dx: number[] = [];
  const dy: number[] = [];
  const slopes: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const deltaX = points[i + 1].x - points[i].x || 1;
    const deltaY = points[i + 1].y - points[i].y;
    dx.push(deltaX);
    dy.push(deltaY);
    slopes.push(deltaY / deltaX);
  }

  const tangents: number[] = [slopes[0]];
  for (let i = 1; i < n - 1; i++) {
    const m0 = slopes[i - 1];
    const m1 = slopes[i];
    if (m0 * m1 <= 0) {
      tangents.push(0);
    } else {
      const common = dx[i - 1] + dx[i];
      tangents.push((3 * common) / ((common + dx[i]) / m0 + (common + dx[i - 1]) / m1));
    }
  }
  tangents.push(slopes[n - 2]);

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    const cp1x = points[i].x + h;
    const cp1y = points[i].y + tangents[i] * h;
    const cp2x = points[i + 1].x - h;
    const cp2y = points[i + 1].y - tangents[i + 1] * h;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${points[i + 1].x.toFixed(1)} ${points[i + 1].y.toFixed(1)}`;
  }
  return d;
}

// Crisp straight segments for measured child points (zero overshoot between close dates)
function getLinearPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  return points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
}

// Format detailed age string e.g. "6m 2w 2d" matching clean medical style
function formatDetailedAge(birthDateStr?: string, entryDateStr?: string, fallbackMonths?: number): string {
  if (!birthDateStr || !entryDateStr) {
    const mo = Math.floor(fallbackMonths || 0);
    return `${mo}m`;
  }
  const birth = new Date(birthDateStr).getTime();
  const entry = new Date(entryDateStr).getTime();
  if (isNaN(birth) || isNaN(entry) || entry < birth) {
    const mo = Math.floor(fallbackMonths || 0);
    return `${mo}m`;
  }
  const totalDays = Math.floor((entry - birth) / 86400000);
  const months = Math.floor(totalDays / 30.4375);
  const remainingDays = Math.max(0, Math.floor(totalDays - months * 30.4375));
  const weeks = Math.floor(remainingDays / 7);
  const days = remainingDays % 7;

  if (months === 0 && weeks === 0) {
    return `${days}d`;
  }
  if (months === 0) {
    return `${weeks}w ${days}d`;
  }
  if (weeks === 0 && days === 0) {
    return `${months}m`;
  }
  if (weeks === 0) {
    return `${months}m ${days}d`;
  }
  return `${months}m ${weeks}w ${days}d`;
}

// Format friendly date e.g. "Oct 14, 2026"
function formatCardDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (y && m && d) {
      return new Date(y, m - 1, d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
  entries,
  chartType,
  onChangeChartType,
  showMetricSwitcher = true,
  gender,
  unit,
  babyName,
  babyAgeMonths,
  babyBirthDate,
  timelineRange = 'auto',
  onOpenSettings,
  onEditEntry,
}) => {
  // Measure container width so SVG coordinate space matches 1:1 CSS pixels (zero letterboxing/empty space)
  const chartBoxRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Math.min(760, Math.max(320, window.innerWidth - 40));
    }
    return 380;
  });

  useEffect(() => {
    const el = chartBoxRef.current;
    if (!el) return;
    const updateWidth = () => {
      const w = el.clientWidth;
      if (w > 100) {
        setContainerWidth(Math.round(w));
      }
    };
    updateWidth();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver((entriesList) => {
        for (const item of entriesList) {
          if (item.contentRect.width > 100) {
            setContainerWidth(Math.round(item.contentRect.width));
          }
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, []);

  // Timeline range: Default to 9–10 months for babies under 10m (matching the reference),
  // up to 18m or 24m for older toddlers
  const rangeMonths = useMemo<number>(() => {
    if (timelineRange && timelineRange !== 'auto') {
      return timelineRange;
    }
    const validEntryAges = entries
      .map((e) => e.ageMonths)
      .filter((a) => typeof a === 'number' && !isNaN(a) && a > 0);
    const maxEntryAge = validEntryAges.length > 0 ? Math.max(...validEntryAges) : 0;
    const effectiveAge = Math.max(babyAgeMonths || 0, maxEntryAge);

    if (effectiveAge <= 2) return 6;
    if (effectiveAge <= 8) return 9;
    if (effectiveAge <= 11) return 12;
    if (effectiveAge <= 17) return 18;
    return 24;
  }, [timelineRange, babyAgeMonths, entries]);

  const rawTable = useMemo(() => getWHOTable(chartType, gender), [chartType, gender]);

  // Filter table by selected max age (including month 0 up to rangeMonths)
  const filteredTable = useMemo(() => {
    return rawTable.filter((row) => row.month <= rangeMonths);
  }, [rawTable, rangeMonths]);

  // 1:1 CSS pixel SVG dimensions tailored to viewport: tall & readable on mobile, spacious on desktop
  const isCompact = containerWidth < 520;
  const svgWidth = containerWidth;
  const svgHeight = isCompact
    ? Math.max(430, Math.min(520, Math.round(svgWidth * 1.25)))
    : Math.max(460, Math.min(540, Math.round(svgWidth * 0.72)));

  const padding = isCompact
    ? { top: 14, right: 38, bottom: 30, left: 46 }
    : { top: 16, right: 46, bottom: 34, left: 52 };
  const plotWidth = Math.max(180, svgWidth - padding.left - padding.right);
  const plotHeight = Math.max(260, svgHeight - padding.top - padding.bottom);

  // Convert raw value according to metric/imperial unit
  const convertValue = (valInMetric: number): number => {
    if (chartType === 'weight') {
      return unit === 'imperial' ? valInMetric * 2.20462 : valInMetric;
    }
    return unit === 'imperial' ? valInMetric / 2.54 : valInMetric;
  };

  const unitLabel = useMemo(() => {
    if (chartType === 'weight') return unit === 'imperial' ? 'lb' : 'kg';
    return unit === 'imperial' ? 'in' : 'cm';
  }, [chartType, unit]);

  // Determine Y-axis min and max tightly matching reference style (no wasted top/bottom gap)
  const { minY, maxY, yTicks } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    filteredTable.forEach((row) => {
      const spreadUpper = row.p97 - row.p50;
      const spreadLower = row.p50 - row.p3;
      const val98 = row.p50 + spreadUpper * 1.10;
      const val2 = row.p50 - spreadLower * 1.10;
      min = Math.min(min, convertValue(val2));
      max = Math.max(max, convertValue(val98));
    });

    entries.forEach((entry) => {
      let val: number | undefined;
      if (chartType === 'weight') val = entry.weightKg;
      else if (chartType === 'height') val = entry.heightCm;
      else if (chartType === 'head') val = entry.headCircumferenceCm;

      if (val !== undefined && val > 0 && entry.ageMonths <= rangeMonths) {
        const converted = convertValue(val);
        min = Math.min(min, converted);
        max = Math.max(max, converted);
      }
    });

    // Step size based on metric/imperial and measurement type
    let step = 2;
    if (chartType === 'weight') {
      step = unit === 'imperial' ? 2 : 1;
    } else if (chartType === 'height') {
      step = unit === 'imperial' ? 2 : 5;
    } else {
      step = unit === 'imperial' ? 1 : 2;
    }

    // Tight integer bounds: utilize the full vertical space without empty top gap
    let roundedMin = Math.max(0, Math.floor(min / step) * step);
    if (min - roundedMin < 0.1 * step && roundedMin > 0) {
      roundedMin = Math.max(0, roundedMin - step);
    }

    let roundedMax = Math.ceil(max / step) * step;
    if (roundedMax - max < 0.1 * step) {
      roundedMax += step;
    }

    const ticks: number[] = [];
    for (let v = roundedMin; v <= roundedMax; v += step) {
      ticks.push(v);
    }

    return { minY: roundedMin, maxY: roundedMax, yTicks: ticks };
  }, [filteredTable, entries, chartType, unit, rangeMonths]);

  // Coordinate mappers
  const getX = (month: number) => padding.left + (month / (rangeMonths || 1)) * plotWidth;
  const getY = (val: number) => padding.top + plotHeight - ((val - minY) / (maxY - minY || 1)) * plotHeight;

  // 9 smooth golden WHO curves with proportional, well-spaced gaps at both Month 0 and Month 9+
  const percentileCurves = useMemo(() => {
    const defs = [
      { key: 'p98', label: '98%', factor: 1.10, isUpper: true, isMedian: false },
      { key: 'p95', label: '95%', factor: 0.88, isUpper: true, isMedian: false },
      { key: 'p90', label: '90%', factor: 0.68, isUpper: true, isMedian: false },
      { key: 'p75', label: '75%', factor: 0.40, isUpper: true, isMedian: false },
      { key: 'p50', label: '50%', factor: 0.00, isUpper: false, isMedian: true },
      { key: 'p25', label: '25%', factor: 0.40, isUpper: false, isMedian: false },
      { key: 'p10', label: '10%', factor: 0.68, isUpper: false, isMedian: false },
      { key: 'p5', label: '5%', factor: 0.88, isUpper: false, isMedian: false },
      { key: 'p2', label: '2%', factor: 1.10, isUpper: false, isMedian: false },
    ];

    return defs.map((def) => {
      const points = filteredTable.map((r) => {
        let rawVal = r.p50;
        if (def.isMedian) {
          rawVal = r.p50;
        } else if (def.isUpper) {
          const spreadUpper = r.p97 - r.p50;
          rawVal = r.p50 + spreadUpper * def.factor;
        } else {
          const spreadLower = r.p50 - r.p3;
          rawVal = r.p50 - spreadLower * def.factor;
        }

        return {
          x: getX(r.month),
          y: getY(convertValue(rawVal)),
        };
      });

      const lastPt = points[points.length - 1];

      return {
        key: def.key,
        label: def.label,
        isMedian: def.isMedian,
        path: getMonotoneSplinePath(points),
        labelX: svgWidth - padding.right + 6,
        labelY: lastPt ? lastPt.y + 4 : 0,
      };
    });
  }, [filteredTable, minY, maxY, unit, rangeMonths, svgWidth, svgHeight]);

  // Baby's plotted points
  const babyPoints = useMemo(() => {
    const pts: {
      entry: GrowthEntry;
      x: number;
      y: number;
      rawVal: number;
      convVal: number;
      valStr: string;
      percentile: number;
      percentileStr: string;
      ageStr: string;
    }[] = [];

    // Sort entries chronologically
    const sortedEntries = entries.slice().sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
        return timeA - timeB;
      }
      return (a.ageMonths || 0) - (b.ageMonths || 0);
    });

    const earliestDate = sortedEntries[0]?.date;

    sortedEntries.forEach((entry, idx) => {
      let val: number | undefined;
      if (chartType === 'weight') val = entry.weightKg;
      else if (chartType === 'height') val = entry.heightCm;
      else if (chartType === 'head') val = entry.headCircumferenceCm;

      if (val !== undefined && val > 0) {
        let plotAge = typeof entry.ageMonths === 'number' && !isNaN(entry.ageMonths) ? entry.ageMonths : 0;

        if (plotAge <= 0 && entry.date) {
          if (babyBirthDate && entry.date > babyBirthDate) {
            plotAge = calculateAge(babyBirthDate, entry.date).exactMonths;
          } else if (earliestDate && entry.date > earliestDate) {
            plotAge = calculateAge(earliestDate, entry.date).exactMonths;
          }
        }

        // Prevent stacking dots on Y-axis for subsequent entries
        if (plotAge <= 0 && idx > 0) {
          const prevPt = pts[pts.length - 1];
          if (prevPt) {
            plotAge = prevPt.entry.ageMonths + 2;
          } else {
            plotAge = idx * 2;
          }
        }

        if (plotAge <= rangeMonths) {
          const convVal = convertValue(val);
          const percentileInfo = calculatePercentile(chartType, val, plotAge, gender);

          let valStr = '';
          if (chartType === 'weight') {
            if (unit === 'imperial') {
              const { displayStr } = kgToLbsOz(val);
              valStr = `Weight ${displayStr}`;
            } else {
              valStr = `Weight ${val.toFixed(2)} kg`;
            }
          } else if (chartType === 'height') {
            if (unit === 'imperial') {
              valStr = `Height ${cmToInches(val).toFixed(1)} in`;
            } else {
              valStr = `Height ${val.toFixed(1)} cm`;
            }
          } else {
            if (unit === 'imperial') {
              valStr = `Head Size ${cmToInches(val).toFixed(1)} in`;
            } else {
              valStr = `Head Size ${val.toFixed(1)} cm`;
            }
          }

          pts.push({
            entry: { ...entry, ageMonths: plotAge },
            x: getX(plotAge),
            y: getY(convVal),
            rawVal: val,
            convVal,
            valStr,
            percentile: percentileInfo.percentile,
            percentileStr: `${gender === 'boy' ? 'Boys' : 'Girls'} Percentile ${percentileInfo.percentile}%`,
            ageStr: `Age ${formatDetailedAge(babyBirthDate, entry.date, plotAge)}`,
          });
        }
      }
    });

    return pts;
  }, [entries, chartType, rangeMonths, unit, minY, maxY, babyBirthDate, gender, svgWidth, svgHeight]);

  // Crisp segment path for baby's measurements
  const babyLinePath = useMemo(() => {
    return getLinearPath(babyPoints.map((p) => ({ x: p.x, y: p.y })));
  }, [babyPoints]);

  // Selected point: hidden by default until user clicks a specific dot
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedPointId(null);
  }, [chartType]);

  const activePoint = useMemo(() => {
    if (!selectedPointId || babyPoints.length === 0) return null;
    return babyPoints.find((p) => p.entry.id === selectedPointId) || null;
  }, [babyPoints, selectedPointId]);

  // X-axis month ticks: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ...
  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = rangeMonths <= 12 ? 1 : 2;
    for (let m = 0; m <= rangeMonths; m += step) {
      ticks.push(m);
    }
    return ticks;
  }, [rangeMonths]);

  return (
    <div className="bg-[var(--color-card)] rounded-3xl border border-[var(--color-card-border)] shadow-xs px-2 pt-2.5 pb-3 sm:p-5 transition-all text-[var(--color-text-main)] w-full max-w-full overflow-hidden">
      
      {/* 1. Optional Segmented Header Controls (hidden on Home tab when summary cards above already switch) */}
      {showMetricSwitcher && (
        <div className="w-full max-w-sm mx-auto mb-1.5 sm:mb-2.5">
          <div className="bg-[var(--color-surface)] p-1 rounded-2xl flex items-center justify-between shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setSelectedPointId(null);
                onChangeChartType?.('weight');
              }}
              className={`flex-1 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                chartType === 'weight'
                  ? 'bg-[var(--color-card)] text-[var(--color-text-main)] shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              Weight
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPointId(null);
                onChangeChartType?.('height');
              }}
              className={`flex-1 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                chartType === 'height'
                  ? 'bg-[var(--color-card)] text-[var(--color-text-main)] shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              Height
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPointId(null);
                onChangeChartType?.('head');
              }}
              className={`flex-1 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                chartType === 'head'
                  ? 'bg-[var(--color-card)] text-[var(--color-text-main)] shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              Head Size
            </button>
          </div>
        </div>
      )}

      {/* 2. Vector Canvas with Straight Grid Baselines, Golden Curves & Tap-Only Detail Card */}
      <div ref={chartBoxRef} className="relative w-full">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto block select-none touch-manipulation"
          onClick={() => {
            if (selectedPointId) setSelectedPointId(null);
          }}
        >
          {/* Crisp Straight Horizontal Baseline Guidelines aligned to every Y-axis tick */}
          {yTicks.map((tickVal) => {
            const y = getY(tickVal);
            return (
              <line
                key={`ygrid-${tickVal}`}
                x1={padding.left}
                y1={y}
                x2={svgWidth - padding.right}
                y2={y}
                stroke="var(--color-text-muted)"
                strokeOpacity={0.14}
                strokeWidth={0.8}
              />
            );
          })}

          {/* Crisp Straight Vertical Month Reference Guidelines */}
          {xTicks.map((month) => {
            const x = getX(month);
            return (
              <line
                key={`xgrid-${month}`}
                x1={x}
                y1={padding.top}
                x2={x}
                y2={svgHeight - padding.bottom}
                stroke="var(--color-text-muted)"
                strokeOpacity={month === 0 ? 0.22 : 0.08}
                strokeWidth={month === 0 ? 1 : 0.75}
              />
            );
          })}

          {/* Y-Axis numbers on the left */}
          {yTicks.map((tickVal, idx) => {
            const y = getY(tickVal);
            const isTopTick = idx === yTicks.length - 1;
            const labelStr = isTopTick ? `${tickVal} ${unitLabel}` : `${tickVal}`;
            return (
              <text
                key={`ytick-${tickVal}`}
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="text-[11px] sm:text-[12px] fill-[var(--color-text-muted)] font-sans font-semibold"
              >
                {labelStr}
              </text>
            );
          })}

          {/* Golden WHO Percentile Curves */}
          {percentileCurves.map((curve) => (
            <g key={curve.key}>
              <path
                d={curve.path}
                fill="none"
                stroke={curve.isMedian ? 'var(--color-chart-median, #E29B18)' : 'var(--color-chart-curve, #EBB844)'}
                strokeWidth={curve.isMedian ? 2.4 : 1.15}
                strokeOpacity={curve.isMedian ? 1 : 0.85}
              />
              {/* Right edge percentile label */}
              <text
                x={curve.labelX}
                y={curve.labelY}
                textAnchor="start"
                className={`text-[11px] font-sans ${
                  curve.isMedian
                    ? 'font-bold fill-[var(--color-chart-median,#E29B18)]'
                    : 'font-semibold fill-[var(--color-text-muted)]'
                }`}
              >
                {curve.label}
              </text>
            </g>
          ))}

          {/* Baby's Trajectory Line */}
          {babyLinePath && (
            <path
              d={babyLinePath}
              fill="none"
              stroke="var(--color-chart-line, #244B66)"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Baby's Measurement Dots */}
          {babyPoints.map((pt) => {
            const isSelected = activePoint?.entry.id === pt.entry.id;

            return (
              <g
                key={pt.entry.id}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPointId(isSelected ? null : pt.entry.id);
                }}
              >
                {/* Generous touch target */}
                <circle cx={pt.x} cy={pt.y} r={18} fill="transparent" />

                {/* If selected: hollow indicator ring around the dot */}
                {isSelected && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={9.5}
                    fill="var(--color-card)"
                    stroke="var(--color-chart-line, #244B66)"
                    strokeWidth={2.2}
                  />
                )}

                {/* Solid Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 4.2 : 4.5}
                  fill="var(--color-chart-line, #244B66)"
                />

                {/* Small indicator if doctor visit */}
                {pt.entry.isPediatricianVisit && (
                  <circle
                    cx={pt.x + 5}
                    cy={pt.y - 5}
                    r={2.5}
                    fill="var(--color-primary)"
                    stroke="var(--color-card)"
                    strokeWidth={0.9}
                  />
                )}
              </g>
            );
          })}

          {/* X-Axis month numbers at bottom */}
          {xTicks.map((month) => {
            const x = getX(month);
            return (
              <text
                key={`xtick-${month}`}
                x={x}
                y={svgHeight - padding.bottom + 20}
                textAnchor="middle"
                className="text-[11px] sm:text-[12px] fill-[var(--color-text-muted)] font-sans font-semibold"
              >
                {month}
              </text>
            );
          })}

          {/* "months" label cleanly positioned above the right-edge ticks */}
          <text
            x={svgWidth - padding.right}
            y={svgHeight - padding.bottom + 4}
            textAnchor="end"
            className="text-[11px] sm:text-[12px] fill-[var(--color-text-muted)] font-sans font-semibold"
          >
            months
          </text>
        </svg>

        {/* 3. Floating Detail Inspection Card (Appears ONLY when a dot is clicked) */}
        {activePoint && (
          <div className="absolute bottom-9 sm:bottom-10 right-2 sm:right-5 w-52 sm:w-64 rounded-2xl overflow-hidden shadow-xl border border-[var(--color-card-border)] bg-[var(--color-card)] text-xs animate-in fade-in zoom-in-95 duration-150 z-10">
            {/* Header */}
            <div className="bg-[var(--color-surface)] px-3.5 py-2.5 flex items-center justify-between text-[var(--color-text-main)] border-b border-[var(--color-card-border)]">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{formatCardDate(activePoint.entry.date)}</span>
                <span className="text-[var(--color-text-muted)]">|</span>
                <button
                  type="button"
                  onClick={() => onEditEntry?.(activePoint.entry)}
                  className="font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] underline hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPointId(null)}
                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card Body */}
            <div className="p-3.5 space-y-1 bg-[var(--color-card)] text-[var(--color-text-main)]">
              <div className="font-bold text-sm text-[var(--color-text-main)]">
                {activePoint.valStr}
              </div>
              <div className="text-[12px] text-[var(--color-text-muted)] font-medium">
                {activePoint.percentileStr}
              </div>
              <div className="text-[12px] text-[var(--color-text-muted)] font-medium">
                {activePoint.ageStr}
              </div>
              {activePoint.entry.notes && (
                <div className="text-[11px] text-[var(--color-text-muted)] pt-0.5 italic line-clamp-2">
                  &ldquo;{activePoint.entry.notes}&rdquo;
                </div>
              )}
              <div className="pt-2 text-[10px] text-[var(--color-text-muted)] opacity-80">
                Source: WHO
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Subtle Controls & Legend */}
      <div className="mt-3 pt-2.5 border-t border-[var(--color-card-border)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[var(--color-chart-line,#244B66)] inline-block" />
            <span className="font-semibold text-[var(--color-text-main)]">{babyName}&rsquo;s Growth</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1 bg-[var(--color-chart-median,#E29B18)] rounded-full inline-block" />
            <span>50% Median</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!activePoint && babyPoints.length > 0 && (
            <span className="text-[11px] text-[var(--color-text-muted)]">
              Tap any dot to view details
            </span>
          )}
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="text-[11px] font-semibold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] hover:underline cursor-pointer"
            >
              Timeline: 0–{rangeMonths}m
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
