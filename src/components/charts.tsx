"use client";

import {
  ResponsiveContainer,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  LabelList,
} from "recharts";

interface ScorePoint {
  label: string;
  percentage: number;
  title: string;
  mode?: string;
}

interface SubjectBarData {
  subjectName: string;
  averagePercentage: number;
  attemptCount: number;
  color: string;
}

const tooltipStyle = {
  background: "var(--card)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  boxShadow: "var(--shadow-card)",
  fontSize: "13px",
  fontFamily: "Plus Jakarta Sans, sans-serif",
  color: "var(--foreground)",
  padding: "10px 14px",
} as const;

const axisTickStyle = {
  fontSize: "11px",
  fill: "var(--muted-foreground)",
  fontFamily: "Plus Jakarta Sans, sans-serif",
} as const;

const modeColors: Record<string, string> = {
  practice: "#F4899A",
  test: "#7C6FDB",
};

const modeLabels: Record<string, string> = {
  practice: "Practice",
  test: "Test",
};

export function ScoreProgressionChart({ points }: { points: ScorePoint[] }) {
  const hasTest = points.some((p) => p.mode === "test");
  const hasPractice = points.some((p) => p.mode === "practice" || !p.mode);

  // Build a combined dataset where each point has practicePercentage and testPercentage
  // so the two lines can be plotted independently on the same x-axis
  const chartData = points.map((p) => ({
    label: p.label,
    title: p.title,
    mode: p.mode ?? "practice",
    practicePercentage: p.mode === "test" ? null : p.percentage,
    testPercentage: p.mode === "test" ? p.percentage : null,
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 24, right: 24, bottom: 8, left: -8 }}>
          <defs>
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid
            strokeDasharray="3 6"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={axisTickStyle}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={axisTickStyle}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ stroke: "#9F7AEA", strokeWidth: 1, strokeDasharray: "4 4" }}
            formatter={(value, name) => {
              if (value === null || value === undefined) return null as unknown as [string, string];
              const modeKey = name === "practicePercentage" ? "practice" : "test";
              return [`${value}%`, modeLabels[modeKey] ?? name] as [string, string];
            }}
            labelFormatter={(label) => `Ngày ${label}`}
          />
          {hasPractice && (
            <Line
              type="monotone"
              dataKey="practicePercentage"
              stroke={modeColors.practice}
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--card)", stroke: modeColors.practice, strokeWidth: 2.5 }}
              activeDot={{
                r: 7,
                fill: modeColors.practice,
                stroke: "var(--card)",
                strokeWidth: 3,
              }}
              connectNulls
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
          )}
          {hasTest && (
            <Line
              type="monotone"
              dataKey="testPercentage"
              stroke={modeColors.test}
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--card)", stroke: modeColors.test, strokeWidth: 2.5 }}
              activeDot={{
                r: 7,
                fill: modeColors.test,
                stroke: "var(--card)",
                strokeWidth: 3,
              }}
              connectNulls
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      {(hasPractice || hasTest) && (
        <div className="flex items-center gap-4 mt-3 justify-end">
          {hasPractice && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: modeColors.practice }} />
              <span className="font-sans text-[11px]" style={{ color: "var(--muted-foreground)" }}>Practice</span>
            </div>
          )}
          {hasTest && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: modeColors.test }} />
              <span className="font-sans text-[11px]" style={{ color: "var(--muted-foreground)" }}>Test</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SubjectAveragesChart({ data }: { data: SubjectBarData[] }) {
  const chartHeight = Math.max(data.length * 64 + 24, 180);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 60, bottom: 8, left: 8 }}
        barSize={28}
      >
        <defs>
          {data.map((entry, i) => (
            <linearGradient
              key={i}
              id={`barGrad-${i}`}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor={entry.color} stopOpacity={0.7} />
              <stop offset="100%" stopColor={entry.color} stopOpacity={1} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid
          strokeDasharray="3 6"
          stroke="var(--border)"
          horizontal={false}
        />
        <XAxis
          type="number"
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tick={axisTickStyle}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="subjectName"
          tick={{
            ...axisTickStyle,
            fontSize: "13px",
            fill: "var(--foreground)",
            fontWeight: 600,
          }}
          tickLine={false}
          axisLine={false}
          width={160}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: "rgba(159, 122, 234, 0.08)" }}
          formatter={(value, _name, props) => {
            const count = (props?.payload as SubjectBarData)?.attemptCount ?? 0;
            return [`${value}% (${count} lần)`, "Trung bình"];
          }}
        />
        <Bar
          dataKey="averagePercentage"
          radius={[8, 8, 8, 8]}
          isAnimationActive
          animationDuration={1000}
          animationEasing="ease-out"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={`url(#barGrad-${i})`} />
          ))}
          <LabelList
            dataKey="averagePercentage"
            position="right"
            formatter={(val) => `${val}%`}
            style={{
              fontSize: "13px",
              fontWeight: 700,
              fill: "var(--foreground)",
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
