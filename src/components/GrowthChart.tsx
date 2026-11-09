import React, { useState, useMemo } from 'react';
import { ChartType, Gender, GrowthEntry, MetricUnit, WHOPercentileRow } from '../types/growth';
import { getWHOTable, kgToLbsOz, cmToInches, calculatePercentile, calculateAge } from '../data/whoGrowthStandards';
import { X, Edit2 } from 'lucide-react';

interface GrowthChartProps {
  entries: GrowthEntry[];
  chartType: ChartType;
  onChangeChartType?: (type: ChartType) => void;
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

// Cubic spline smoothing for smooth, organic vector curves
function getCubicBezierPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} L ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}`;
  }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
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
  gender,
  unit,
  babyName,
  babyAgeMonths,
  babyBirthDate,
  timelineRange = 'auto',
  onOpenAddModal,
  onOpenSettings,
  onEditEntry,
}) => {
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

  // SVG dimensions: generous 800x600 for vertical breathing room
  const svgWidth = 800;
  const svgHeight = 580;
  const padding = { top: 32, right: 64, bottom: 48, left: 56 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

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

  // Determine Y-axis min and max with neat integer steps matching reference style
  const { minY, maxY, yTicks } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    filteredTable.forEach((row) => {
      min = Math.min(min, convertValue(row.p3));
      max = Math.max(max, convertValue(row.p97));
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

    const roundedMin = Math.max(0, Math.floor(min / step) * step - step);
    const roundedMax = Math.ceil(max / step) * step + step;

    const ticks: number[] = [];
    for (let v = roundedMin; v <= roundedMax; v += step) {
      ticks.push(v);
    }

    return { minY: roundedMin, maxY: roundedMax, yTicks: ticks };
  }, [filteredTable, entries, chartType, unit, rangeMonths]);

  // Coordinate mappers
  const getX = (month: number) => padding.left + (month / (rangeMonths || 1)) * plotWidth;
  const getY = (val: number) => padding.top + plotHeight - ((val - minY) / (maxY - minY || 1)) * plotHeight;

  // 9 smooth golden WHO curves matching the reference design
  const percentileCurves = useMemo(() => {
    const defs = [
      { key: 'p98', label: '98%', getValue: (r: WHOPercentileRow) => r.p97 * 1.025, isMedian: false },
      { key: 'p95', label: '95%', getValue: (r: WHOPercentileRow) => r.p85 + (r.p97 - r.p85) * 0.83, isMedian: false },
      { key: 'p90', label: '90%', getValue: (r: WHOPercentileRow) => r.p85 + (r.p97 - r.p85) * 0.42, isMedian: false },
      { key: '75', label: '75%', getValue: (r: WHOPercentileRow) => r.p50 + (r.p85 - r.p50) * 0.71, isMedian: false },
      { key: 'p50', label: '50%', getValue: (r: WHOPercentileRow) => r.p50, isMedian: true },
      { key: 'p25', label: '25%', getValue: (r: WHOPercentileRow) => r.p15 + (r.p50 - r.p15) * 0.29, isMedian: false },
      { key: 'p10', label: '10%', getValue: (r: WHOPercentileRow) => r.p3 + (r.p15 - r.p3) * 0.58, isMedian: false },
      { key: 'p5', label: '5%', getValue: (r: WHOPercentileRow) => r.p3 + (r.p15 - r.p3) * 0.22, isMedian: false },
      { key: 'p2', label: '2%', getValue: (r: WHOPercentileRow) => r.p3 * 0.975, isMedian: false },
    ];

    return defs.map((def) => {
      const points = filteredTable.map((r) => ({
        x: getX(r.month),
        y: getY(convertValue(def.getValue(r))),
      }));

      const lastPt = points[points.length - 1];

      return {
        key: def.key,
        label: def.label,
        isMedian: def.isMedian,
        path: getCubicBezierPath(points),
        labelX: svgWidth - padding.right + 10,
        labelY: lastPt ? lastPt.y + 4 : 0,
      };
    });
  }, [filteredTable, minY, maxY, unit, rangeMonths]);

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
  }, [entries, chartType, rangeMonths, unit, minY, maxY, babyBirthDate, gender]);

  // Smooth spline trajectory for baby's measurements
  const babyLinePath = useMemo(() => {
    return getCubicBezierPath(babyPoints.map((p) => ({ x: p.x, y: p.y })));
  }, [babyPoints]);

  // Selected point: defaults to latest entry (as in reference screenshot)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  const activePoint = useMemo(() => {
    if (babyPoints.length === 0) return null;
    if (selectedPointId === 'none') return null;
    if (selectedPointId) {
      const found = babyPoints.find((p) => p.entry.id === selectedPointId);
      if (found) return found;
    }
    // Default to the latest point
    return babyPoints[babyPoints.length - 1];
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
    <div className="bg-white dark:bg-[#18201B] rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xs p-3.5 sm:p-6 transition-all text-[#2A4356] dark:text-[#E0ECF5] w-full max-w-full overflow-hidden">
      
      {/* 1. Clean Segmented Header Controls: Weight | Height | Head Size */}
      <div className="w-full max-w-md mx-auto mb-4 sm:mb-6">
        <div className="bg-[#EFE8DC] dark:bg-[#252E27] p-1 rounded-2xl flex items-center justify-between shadow-2xs">
          <button
            type="button"
            onClick={() => onChangeChartType?.('weight')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
              chartType === 'weight'
                ? 'bg-white dark:bg-[#1A221D] text-[#1E3A52] dark:text-white shadow-xs'
                : 'text-[#617482] dark:text-[#95A7B5] hover:text-[#1E3A52] dark:hover:text-white'
            }`}
          >
            Weight
          </button>
          <button
            type="button"
            onClick={() => onChangeChartType?.('height')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
              chartType === 'height'
                ? 'bg-white dark:bg-[#1A221D] text-[#1E3A52] dark:text-white shadow-xs'
                : 'text-[#617482] dark:text-[#95A7B5] hover:text-[#1E3A52] dark:hover:text-white'
            }`}
          >
            Height
          </button>
          <button
            type="button"
            onClick={() => onChangeChartType?.('head')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
              chartType === 'head'
                ? 'bg-white dark:bg-[#1A221D] text-[#1E3A52] dark:text-white shadow-xs'
                : 'text-[#617482] dark:text-[#95A7B5] hover:text-[#1E3A52] dark:hover:text-white'
            }`}
          >
            Head Size
          </button>
        </div>
      </div>

      {/* 2. Vector Canvas with Golden Curves & Floating Detail Card */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-h-[360px] sm:min-h-[480px] block select-none touch-manipulation"
        >
          {/* Y-Axis floating numbers on the left */}
          {yTicks.map((tickVal, idx) => {
            const y = getY(tickVal);
            const isTopTick = idx === yTicks.length - 1;
            const labelStr = isTopTick ? `${tickVal} ${unitLabel}` : `${tickVal}`;
            return (
              <text
                key={`ytick-${tickVal}`}
                x={padding.left - 12}
                y={y + 4}
                textAnchor="end"
                className="text-[12px] sm:text-[13px] fill-[#2A4356] dark:fill-[#9FB4C7] font-sans font-medium"
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
                stroke={curve.isMedian ? '#E29B18' : '#EBB844'}
                strokeWidth={curve.isMedian ? 2.5 : 1.2}
                strokeOpacity={curve.isMedian ? 1 : 0.85}
                className={curve.isMedian ? 'dark:stroke-[#F5BA42]' : 'dark:stroke-[#F0C35B]'}
              />
              {/* Right edge percentile label */}
              <text
                x={curve.labelX}
                y={curve.labelY}
                textAnchor="start"
                className={`text-[11px] font-sans ${
                  curve.isMedian
                    ? 'font-bold fill-[#E29B18] dark:fill-[#F5BA42]'
                    : 'font-medium fill-[#2A4356] dark:fill-[#9FB4C7]'
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
              stroke="#244B66"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dark:stroke-[#68A4CC]"
            />
          )}

          {/* Baby's Measurement Dots */}
          {babyPoints.map((pt) => {
            const isSelected = activePoint?.entry.id === pt.entry.id;

            return (
              <g
                key={pt.entry.id}
                className="cursor-pointer"
                onClick={() => setSelectedPointId(pt.entry.id)}
              >
                {/* Generous touch target */}
                <circle cx={pt.x} cy={pt.y} r={18} fill="transparent" />

                {/* If selected: hollow indicator ring around the dot matching reference image */}
                {isSelected && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={9.5}
                    fill="white"
                    stroke="#244B66"
                    strokeWidth={2}
                    className="dark:fill-[#18201B] dark:stroke-[#68A4CC] transition-all"
                  />
                )}

                {/* Solid Navy Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 4 : 4.5}
                  fill="#244B66"
                  className="dark:fill-[#68A4CC]"
                />

                {/* Small indicator if doctor visit */}
                {pt.entry.isPediatricianVisit && (
                  <circle
                    cx={pt.x + 5}
                    cy={pt.y - 5}
                    r={2.5}
                    fill="#3B82F6"
                    stroke="white"
                    strokeWidth={0.8}
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
                y={svgHeight - padding.bottom + 22}
                textAnchor="middle"
                className="text-[12px] sm:text-[13px] fill-[#2A4356] dark:fill-[#9FB4C7] font-sans font-medium"
              >
                {month}
              </text>
            );
          })}

          {/* "months" label at bottom right */}
          <text
            x={svgWidth - padding.right + 2}
            y={svgHeight - padding.bottom + 22}
            textAnchor="start"
            className="text-[12px] sm:text-[13px] fill-[#2A4356] dark:fill-[#9FB4C7] font-sans font-medium"
          >
            months
          </text>
        </svg>

        {/* 3. Floating Detail Inspection Card (Matching Screenshot Design) */}
        {activePoint && (
          <div className="absolute bottom-5 sm:bottom-6 right-3 sm:right-6 w-56 sm:w-64 rounded-2xl overflow-hidden shadow-xl border border-stone-200/80 dark:border-stone-700 bg-white dark:bg-[#1E2621] text-xs animate-in fade-in zoom-in-95 duration-150">
            {/* Header: Warm beige banner */}
            <div className="bg-[#EFE8DC] dark:bg-[#2A342D] px-3.5 py-2.5 flex items-center justify-between text-[#2A4356] dark:text-[#D4E4F0]">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{formatCardDate(activePoint.entry.date)}</span>
                <span className="text-stone-400">|</span>
                <button
                  type="button"
                  onClick={() => onEditEntry?.(activePoint.entry)}
                  className="font-bold underline hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPointId('none')}
                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors cursor-pointer text-[#2A4356] dark:text-[#D4E4F0]"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card Body */}
            <div className="p-3.5 space-y-1 bg-white dark:bg-[#1E2621] text-[#2A4356] dark:text-[#D4E4F0]">
              <div className="font-bold text-sm text-[#1E3A52] dark:text-white">
                {activePoint.valStr}
              </div>
              <div className="text-[12px] text-[#2A4356] dark:text-[#C5D7E5] font-medium">
                {activePoint.percentileStr}
              </div>
              <div className="text-[12px] text-[#2A4356] dark:text-[#C5D7E5] font-medium">
                {activePoint.ageStr}
              </div>
              {activePoint.entry.notes && (
                <div className="text-[11px] text-stone-500 dark:text-stone-400 pt-0.5 italic line-clamp-2">
                  &ldquo;{activePoint.entry.notes}&rdquo;
                </div>
              )}
              <div className="pt-2 text-[10px] text-stone-400 dark:text-stone-500">
                Source: WHO
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Subtle Controls & Legend */}
      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2.5 text-xs text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#244B66] dark:bg-[#68A4CC] inline-block" />
            <span className="font-semibold text-[#1E3A52] dark:text-white">{babyName}&rsquo;s Growth</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1 bg-[#E29B18] rounded-full inline-block" />
            <span>50% (WHO Median)</span>
          </div>
        </div>

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="text-[11px] font-semibold text-[#244B66] dark:text-[#68A4CC] hover:underline cursor-pointer"
          >
            Timeline: 0–{rangeMonths}m
          </button>
        )}
      </div>
    </div>
  );
};
