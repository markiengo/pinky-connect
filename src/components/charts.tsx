"use client";

import {
  ResponsiveContainer,
  Area,
  AreaChart,
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
}

interface SubjectBarData {
  subjectName: string;
  averagePercentage: number;
  attemptCount: number;
  color: string;
}

const tooltipStyle = {
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(159, 122, 234, 0.15)",
  borderRadius: "12px",
  boxShadow: "0 8px 32px rgba(30, 27, 58, 0.10), 0 1px 4px rgba(30, 27, 58, 0.06)",
  fontSize: "13px",
  fontFamily: "Plus Jakarta Sans, sans-serif",
  color: "#1E1B3A",
  padding: "10px 14px",
} as const;

const axisTickStyle = {
  fontSize: "11px",
  fill: "#8F8AA3",
  fontFamily: "Plus Jakarta Sans, sans-serif",
} as const;

export function ScoreProgressionChart({ points }: { points: ScorePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={points} margin={{ top: 24, right: 24, bottom: 8, left: -8 }}>
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9F7AEA" stopOpacity={0.28} />
            <stop offset="50%" stopColor="#7C6FDB" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#7C6FDB" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="scoreStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F4899A" />
            <stop offset="50%" stopColor="#7C6FDB" />
            <stop offset="100%" stopColor="#9F7AEA" />
          </linearGradient>
          <filter id="scoreGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid
          strokeDasharray="3 6"
          stroke="#E8E4F2"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={axisTickStyle}
          tickLine={false}
          axisLine={{ stroke: "#E8E4F2" }}
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
          formatter={(value) => [`${value}%`, "Điểm"]}
          labelFormatter={(label) => `Ngày ${label}`}
        />
        <Area
          type="monotone"
          dataKey="percentage"
          stroke="url(#scoreStroke)"
          strokeWidth={3}
          fill="url(#scoreGradient)"
          dot={{ r: 4, fill: "#FFFFFF", stroke: "#7C6FDB", strokeWidth: 2.5 }}
          activeDot={{
            r: 7,
            fill: "#9F7AEA",
            stroke: "#FFFFFF",
            strokeWidth: 3,
            style: { filter: "drop-shadow(0 2px 8px rgba(159,122,234,0.4))" },
          }}
          isAnimationActive
          animationDuration={1200}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
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
          stroke="#E8E4F2"
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
            fill: "#1E1B3A",
            fontWeight: 600,
          }}
          tickLine={false}
          axisLine={false}
          width={160}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: "rgba(159, 122, 234, 0.06)" }}
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
              fill: "#1E1B3A",
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
