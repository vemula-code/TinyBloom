import React, { useState, useMemo } from 'react';
import { ChartType, Gender, GrowthEntry, MetricUnit, WHOPercentileRow } from '../types/growth';
import { getWHOTable, kgToLbsOz, cmToInches, calculatePercentile, formatOrdinal, calculateAge } from '../data/whoGrowthStandards';
import { Plus } from 'lucide-react';

interface GrowthChartProps {
  entries: GrowthEntry[];
  chartType: ChartType;
  gender: Gender;
  unit: MetricUnit;
  babyName: string;
  babyAgeMonths?: number;
  babyBirthDate?: string;
  timelineRange?: 'auto' | 6 | 12 | 18 | 24;
  onOpenAddModal?: () => void;
  onOpenSettings?: () => void;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
  entries,
  chartType,
  gender,
  unit,
  babyName,
  babyAgeMonths,
  babyBirthDate,
  timelineRange = 'auto',
  onOpenAddModal,
  onOpenSettings,
}) => {
  // Automatic age range according to user rule:
  // - If baby under 3 months: 0–6m
  // - Till 10 months: 0–12m
  // - Later (> 10 months): 0–24m
  // Can also be customized in Settings
  const rangeMonths = useMemo<6 | 12 | 18 | 24>(() => {
    if (timelineRange && timelineRange !== 'auto') {
      return timelineRange;
    }
    const validEntryAges = entries
      .map((e) => e.ageMonths)
      .filter((a) => typeof a === 'number' && !isNaN(a) && a > 0);
    const maxEntryAge = validEntryAges.length > 0 ? Math.max(...validEntryAges) : 0;
    const effectiveAge = Math.max(babyAgeMonths || 0, maxEntryAge);

    if (effectiveAge < 3) return 6;
    if (effectiveAge <= 10) return 12;
    if (effectiveAge <= 18) return 18;
    return 24;
  }, [timelineRange, babyAgeMonths, entries]);

  const [hoveredPoint, setHoveredPoint] = useState<{
    entry: GrowthEntry;
    x: number;
    y: number;
    valStr: string;
    percentileStr: string;
  } | null>(null);

  const rawTable = useMemo(() => getWHOTable(chartType, gender), [chartType, gender]);

  // Filter table by selected max age (6, 12, 18, or 24 months)
  const filteredTable = useMemo(() => {
    return rawTable.filter((row) => row.month <= rangeMonths);
  }, [rawTable, rangeMonths]);

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 440;
  const padding = { top: 30, right: 65, bottom: 50, left: 60 };
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
    if (chartType === 'weight') return unit === 'imperial' ? 'lbs' : 'kg';
    return unit === 'imperial' ? 'in' : 'cm';
  }, [chartType, unit]);

  // Determine Y-axis min and max
  const { minY, maxY } = useMemo(() => {
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

    // Add 10% breathing room
    const range = max - min || 10;
    const roundedMin = Math.max(0, Math.floor(min - range * 0.1));
    const roundedMax = Math.ceil(max + range * 0.1);
    return { minY: roundedMin, maxY: roundedMax };
  }, [filteredTable, entries, chartType, unit, rangeMonths]);

  // Coordinate mappers
  const getX = (month: number) => padding.left + (month / rangeMonths) * plotWidth;
  const getY = (val: number) => padding.top + plotHeight - ((val - minY) / (maxY - minY || 1)) * plotHeight;

  // Build SVG path string from an array of [x, y] coordinates
  const buildLinePath = (coords: { x: number; y: number }[]): string => {
    if (coords.length === 0) return '';
    return coords.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');
  };

  // Build filled band polygon path between two percentile keys
  const buildBandPath = (keyBottom: keyof WHOPercentileRow, keyTop: keyof WHOPercentileRow): string => {
    const topPoints = filteredTable.map((row) => ({
      x: getX(row.month),
      y: getY(convertValue(row[keyTop])),
    }));
    const bottomPoints = filteredTable.map((row) => ({
      x: getX(row.month),
      y: getY(convertValue(row[keyBottom])),
    })).reverse();

    if (topPoints.length === 0) return '';
    const first = topPoints[0];
    let path = `M ${first.x} ${first.y}`;
    for (let i = 1; i < topPoints.length; i++) {
      path += ` L ${topPoints[i].x} ${topPoints[i].y}`;
    }
    for (const pt of bottomPoints) {
      path += ` L ${pt.x} ${pt.y}`;
    }
    path += ' Z';
    return path;
  };

  // Paths for reference curves
  const pathP3 = useMemo(() => buildLinePath(filteredTable.map((r) => ({ x: getX(r.month), y: getY(convertValue(r.p3)) }))), [filteredTable, minY, maxY, unit]);
  const pathP15 = useMemo(() => buildLinePath(filteredTable.map((r) => ({ x: getX(r.month), y: getY(convertValue(r.p15)) }))), [filteredTable, minY, maxY, unit]);
  const pathP50 = useMemo(() => buildLinePath(filteredTable.map((r) => ({ x: getX(r.month), y: getY(convertValue(r.p50)) }))), [filteredTable, minY, maxY, unit]);
  const pathP85 = useMemo(() => buildLinePath(filteredTable.map((r) => ({ x: getX(r.month), y: getY(convertValue(r.p85)) }))), [filteredTable, minY, maxY, unit]);
  const pathP97 = useMemo(() => buildLinePath(filteredTable.map((r) => ({ x: getX(r.month), y: getY(convertValue(r.p97)) }))), [filteredTable, minY, maxY, unit]);

  // Shaded area bands
  const bandOuterLow = useMemo(() => buildBandPath('p3', 'p15'), [filteredTable, minY, maxY, unit]);
  const bandCore = useMemo(() => buildBandPath('p15', 'p85'), [filteredTable, minY, maxY, unit]);
  const bandOuterHigh = useMemo(() => buildBandPath('p85', 'p97'), [filteredTable, minY, maxY, unit]);

  // Baby's plotted points
  const babyPoints = useMemo(() => {
    const pts: { entry: GrowthEntry; x: number; y: number; rawVal: number; convVal: number }[] = [];

    // Sort entries chronologically to ensure accurate trajectory
    const sortedEntries = entries.slice().sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
        return timeA - timeB;
      }
      return (a.ageMonths || 0) - (b.ageMonths || 0);
    });

    const earliestDate = sortedEntries[0]?.date;

    sortedEntries.forEach((entry) => {
      let val: number | undefined;
      if (chartType === 'weight') val = entry.weightKg;
      else if (chartType === 'height') val = entry.heightCm;
      else if (chartType === 'head') val = entry.headCircumferenceCm;

      if (val !== undefined && val > 0) {
        let plotAge = typeof entry.ageMonths === 'number' && !isNaN(entry.ageMonths) ? entry.ageMonths : 0;

        // If plotAge is 0 or invalid, but entry has a date after birthDate or earliest checkup
        if (plotAge <= 0 && entry.date) {
          if (babyBirthDate && entry.date > babyBirthDate) {
            plotAge = calculateAge(babyBirthDate, entry.date).exactMonths;
          } else if (earliestDate && entry.date > earliestDate) {
            plotAge = calculateAge(earliestDate, entry.date).exactMonths;
          }
        }

        if (plotAge <= rangeMonths) {
          const convVal = convertValue(val);
          pts.push({
            entry: { ...entry, ageMonths: plotAge },
            x: getX(plotAge),
            y: getY(convVal),
            rawVal: val,
            convVal,
          });
        }
      }
    });

    return pts;
  }, [entries, chartType, rangeMonths, unit, minY, maxY, babyBirthDate]);

  const babyLinePath = useMemo(() => {
    return buildLinePath(babyPoints.map((p) => ({ x: p.x, y: p.y })));
  }, [babyPoints]);

  // Y-axis grid lines (5 to 6 ticks)
  const yTicks = useMemo(() => {
    const count = 5;
    const step = (maxY - minY) / count;
    const ticks: number[] = [];
    for (let i = 0; i <= count; i++) {
      ticks.push(Math.round((minY + i * step) * 10) / 10);
    }
    return ticks;
  }, [minY, maxY]);

  // X-axis month ticks
  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = rangeMonths <= 6 ? 1 : rangeMonths <= 12 ? 1 : 2;
    for (let m = 0; m <= rangeMonths; m += step) {
      ticks.push(m);
    }
    return ticks;
  }, [rangeMonths]);

  // Format value label
  const formatValWithUnit = (rawVal: number) => {
    if (chartType === 'weight') {
      if (unit === 'imperial') {
        const { displayStr } = kgToLbsOz(rawVal);
        return displayStr;
      }
      return `${rawVal.toFixed(2)} kg`;
    }
    if (unit === 'imperial') {
      return `${cmToInches(rawVal).toFixed(1)} in`;
    }
    return `${rawVal.toFixed(1)} cm`;
  };

  return (
    <div className="bg-white dark:bg-[#1A221D] rounded-3xl border border-[var(--color-card-border,#E2E9E0)] shadow-2xs p-3.5 sm:p-5 transition-all text-[var(--color-text-main)] w-full max-w-full overflow-hidden">
      {/* Chart Top Bar Controls - Clean and compact */}
      <div className="flex flex-row items-center justify-between gap-2 pb-3 border-b border-[var(--color-card-border,#E2E9E0)]">
        <div className="truncate">
          <div className="flex items-center gap-1.5 truncate">
            <h3 className="text-sm sm:text-base font-bold font-heading text-[var(--color-text-main)] tracking-tight truncate">
              {chartType === 'weight'
                ? 'Weight'
                : chartType === 'height'
                ? 'Length'
                : 'Head Size'} · {gender === 'boy' ? 'Boys' : 'Girls'}
            </h3>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] uppercase shrink-0">
              WHO
            </span>
          </div>
        </div>

        {/* Timeline Range Indicator (Auto-selected based on baby's age, adjustable in Settings) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/25 text-xs font-bold text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] transition-all cursor-pointer shadow-2xs"
            title="Auto-adjusted based on baby's age. Tap to adjust timeline in Settings."
          >
            <span>Timeline: 0–{rangeMonths}m</span>
          </button>
        </div>
      </div>

      {/* SVG Interactive Canvas - 100% vector responsive with zero horizontal overflow */}
      <div className="relative w-full pt-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto block select-none touch-manipulation"
        >
          <defs>
            {/* Shaded bands gradient */}
            <linearGradient id="bandCoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="bandOuterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </linearGradient>
            {/* Baby glow filter */}
            <filter id="babyGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f97316" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Background grid horizontal ticks & lines */}
          {yTicks.map((tickVal, i) => {
            const y = getY(tickVal);
            return (
              <g key={`y-${i}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="#e7e5e4"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[11px] fill-stone-400 font-mono"
                >
                  {tickVal}
                </text>
              </g>
            );
          })}

          {/* Background grid vertical month ticks & lines */}
          {xTicks.map((month) => {
            const x = getX(month);
            return (
              <g key={`x-${month}`}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={svgHeight - padding.bottom}
                  stroke="#f5f5f4"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={svgHeight - padding.bottom + 18}
                  textAnchor="middle"
                  className="text-[11px] fill-stone-500 font-medium"
                >
                  {month}m
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={svgWidth / 2}
            y={svgHeight - 12}
            textAnchor="middle"
            className="text-[11px] fill-stone-400 font-medium tracking-wide uppercase"
          >
            Age (Months)
          </text>
          <text
            x={-(svgHeight / 2)}
            y={18}
            transform="rotate(-90)"
            textAnchor="middle"
            className="text-[11px] fill-stone-400 font-medium tracking-wide uppercase"
          >
            {chartType === 'weight'
              ? `Weight (${unitLabel})`
              : chartType === 'height'
              ? `Length / Height (${unitLabel})`
              : `Head Circumference (${unitLabel})`}
          </text>

          {/* WHO Shaded Envelopes */}
          <path d={bandOuterLow} fill="url(#bandOuterGrad)" />
          <path d={bandCore} fill="url(#bandCoreGrad)" />
          <path d={bandOuterHigh} fill="url(#bandOuterGrad)" />

          {/* Reference Curves */}
          <path d={pathP3} fill="none" stroke="#d6d3d1" strokeWidth="1" strokeDasharray="4 4" />
          <path d={pathP15} fill="none" stroke="#99f6e4" strokeWidth="1.2" />
          <path d={pathP50} fill="none" stroke="#14b8a6" strokeWidth="2" strokeDasharray="6 3" />
          <path d={pathP85} fill="none" stroke="#99f6e4" strokeWidth="1.2" />
          <path d={pathP97} fill="none" stroke="#d6d3d1" strokeWidth="1" strokeDasharray="4 4" />

          {/* Percentile labels on the right edge */}
          {filteredTable.length > 0 && (() => {
            const lastRow = filteredTable[filteredTable.length - 1];
            const pList = [
              { label: '97th', val: lastRow.p97, color: 'text-stone-400' },
              { label: '85th', val: lastRow.p85, color: 'text-teal-600' },
              { label: '50th', val: lastRow.p50, color: 'text-teal-700 font-semibold' },
              { label: '15th', val: lastRow.p15, color: 'text-teal-600' },
              { label: '3rd', val: lastRow.p3, color: 'text-stone-400' },
            ];
            return pList.map((p, idx) => (
              <text
                key={idx}
                x={svgWidth - padding.right + 8}
                y={getY(convertValue(p.val)) + 4}
                className={`text-[10px] font-mono fill-stone-500`}
              >
                {p.label}
              </text>
            ));
          })()}

          {/* Baby's Trajectory Line */}
          {babyLinePath && (
            <path
              d={babyLinePath}
              fill="none"
              stroke="#ea580c"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#babyGlow)"
            />
          )}

          {/* Baby's Data Points */}
          {babyPoints.map((pt, i) => {
            const isHovered = hoveredPoint?.entry.id === pt.entry.id;
            const percentileInfo = calculatePercentile(chartType, pt.rawVal, pt.entry.ageMonths, gender);
            return (
              <g
                key={pt.entry.id}
                className="cursor-pointer group"
                onMouseEnter={() =>
                  setHoveredPoint({
                    entry: pt.entry,
                    x: pt.x,
                    y: pt.y,
                    valStr: formatValWithUnit(pt.rawVal),
                    percentileStr: percentileInfo.displayStr,
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() =>
                  setHoveredPoint({
                    entry: pt.entry,
                    x: pt.x,
                    y: pt.y,
                    valStr: formatValWithUnit(pt.rawVal),
                    percentileStr: percentileInfo.displayStr,
                  })
                }
              >
                {/* Hit area */}
                <circle cx={pt.x} cy={pt.y} r={18} fill="transparent" />
                {/* Outer ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 8 : 6}
                  fill="#ffffff"
                  stroke="#3D5939"
                  strokeWidth={isHovered ? 3 : 2.5}
                  className="transition-all duration-150"
                />
                {/* Center dot */}
                <circle cx={pt.x} cy={pt.y} r={3} fill="#5D7C57" />
                {/* Doctor visit icon marker */}
                {pt.entry.isPediatricianVisit && (
                  <circle
                    cx={pt.x + 6}
                    cy={pt.y - 6}
                    r={3}
                    fill="#326180"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover / Click Floating Tooltip with smart edge-clamping */}
        {hoveredPoint && (() => {
          const xPct = (hoveredPoint.x / svgWidth) * 100;
          const yPct = (hoveredPoint.y / svgHeight) * 100;
          const isNearTop = yPct < 32;
          const isNearLeft = xPct < 25;
          const isNearRight = xPct > 75;

          const transformY = isNearTop ? 'translateY(12px)' : 'translateY(calc(-100% - 12px))';
          const posStyle: React.CSSProperties = {
            top: `${yPct}%`,
          };

          if (isNearLeft) {
            posStyle.left = '8px';
            posStyle.transform = transformY;
          } else if (isNearRight) {
            posStyle.right = '8px';
            posStyle.left = 'auto';
            posStyle.transform = transformY;
          } else {
            posStyle.left = `${xPct}%`;
            posStyle.transform = `translateX(-50%) ${transformY}`;
          }

          return (
            <div
              className="absolute z-30 pointer-events-none bg-[#1A231D] text-white rounded-2xl px-3.5 py-2.5 shadow-2xl text-xs border border-[var(--color-primary)]/40 min-w-[170px] max-w-[240px] animate-in fade-in duration-150"
              style={posStyle}
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-1 mb-1.5">
                <span className="font-bold text-stone-200">
                  {hoveredPoint.entry.ageMonths === 0 ? 'Birth / Newborn' : `${hoveredPoint.entry.ageMonths.toFixed(1)} mo`}
                </span>
                <span className="text-[10px] text-stone-300 font-mono">
                  {hoveredPoint.entry.date}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-extrabold text-[#F5D77A] font-mono">
                  {hoveredPoint.valStr}
                </span>
                <span className="text-[11px] text-emerald-300 font-bold">
                  {hoveredPoint.percentileStr}
                </span>
              </div>
              {hoveredPoint.entry.notes && (
                <p className="mt-1 pt-1 border-t border-white/10 text-[10px] text-stone-300 line-clamp-2 italic">
                  &ldquo;{hoveredPoint.entry.notes}&rdquo;
                </p>
              )}
            </div>
          );
        })()}
      </div>

      {/* Selected Data Point Mobile Inspection Card - 100% visible, never cut off */}
      {hoveredPoint && (
        <div className="mt-2.5 p-3 rounded-2xl bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-between gap-2.5 animate-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {hoveredPoint.entry.ageMonths === 0 ? '0m' : `${hoveredPoint.entry.ageMonths.toFixed(0)}m`}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[var(--color-text-main)]">
                  {hoveredPoint.valStr}
                </span>
                <span className="text-[11px] font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] px-2 py-0.2 rounded-full bg-[var(--color-primary)]/20">
                  {hoveredPoint.percentileStr}
                </span>
                {hoveredPoint.entry.isPediatricianVisit && (
                  <span className="text-[10px] text-blue-700 dark:text-blue-300 font-semibold">
                    Pediatrician Visit
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[var(--color-text-muted)] truncate mt-0.5">
                Recorded on {hoveredPoint.entry.date} {hoveredPoint.entry.notes ? `· "${hoveredPoint.entry.notes}"` : ''}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHoveredPoint(null)}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-card)]/50 transition-colors shrink-0 cursor-pointer"
            title="Dismiss selection"
            aria-label="Dismiss selection"
          >
            <span className="text-xs font-bold px-1 select-none">✕</span>
          </button>
        </div>
      )}

      {/* Chart Footer Legend */}
      <div className="mt-3.5 pt-3 border-t border-[var(--color-card-border,#E2E9E0)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#ea580c] rounded-full inline-block" />
            <span className="font-bold text-[var(--color-text-main)]">{babyName}’s Growth</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#5284A6] rounded-full inline-block" />
            <span>WHO 50th % (Median)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#0d9488]/15 border border-[#0d9488]/40 rounded-xs inline-block" />
            <span>15th – 85th % (Core)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#326180] inline-block" />
            <span>Doctor Visit</span>
          </div>
        </div>

        <span className="text-[11px] text-[var(--color-text-muted)] italic">
          Tap data points to inspect
        </span>
      </div>

      {/* Detailed Post-Chart WHO Guide & Reassurance */}
      <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-[var(--color-primary)]/8 dark:bg-white/5 border border-[var(--color-primary)]/20 text-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl select-none">🌱</span>
          <h4 className="font-bold text-[var(--color-text-main)] text-xs sm:text-sm">
            Official WHO Standards · Detailed Guide for Parents
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-[#141B17] border border-[var(--color-card-border)] space-y-1">
            <span className="font-bold text-[var(--color-primary-dark,#2F4F2D)] dark:text-[var(--color-primary)] block">
              1. Not a Test or Contest
            </span>
            <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              Higher is <strong>not better</strong>, and lower is <strong>not worse</strong>. A baby on the 15th percentile is just as healthy, happy, and thriving as one on the 85th.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#141B17] border border-[var(--color-card-border)] space-y-1">
            <span className="font-bold text-[var(--color-primary-dark,#2F4F2D)] dark:text-[var(--color-primary)] block">
              2. Consistency Over Numbers
            </span>
            <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              Pediatricians look for <strong>steady progress</strong> along your child&apos;s own curve over time, rather than any single checkup number.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#141B17] border border-[var(--color-card-border)] space-y-1">
            <span className="font-bold text-[var(--color-primary-dark,#2F4F2D)] dark:text-[var(--color-primary)] block">
              3. Genetics &amp; Uniqueness
            </span>
            <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              Every baby inherits unique family genetics and natural body types. Never compare your child to siblings or peers.
            </p>
          </div>
        </div>

        <div className="pt-1 text-[11px] text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-primary)]/15">
          <p>
            <strong>About the bands:</strong> The shaded green area represents the WHO 15th to 85th percentile core zone where 70% of healthy babies naturally track. The outer bounds (P3 to P97) represent the full clinical spectrum recognized worldwide by the World Health Organization.
          </p>
        </div>
      </div>
    </div>
  );
};
