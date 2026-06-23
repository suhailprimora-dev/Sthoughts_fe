import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
  trendDirection?: "up" | "down";
}

export default function MetricCard({
  title,
  value,
  icon,
  description,
  trend,
  trendDirection = "up",
}: MetricCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase group-hover:text-primary-600 transition-colors">
          {title}
        </span>
        <div className="p-2.5 bg-primary-50 rounded-xl text-primary-600 group-hover:bg-primary-100 group-hover:text-primary-700 transition-all duration-300">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-800">
          {value}
        </h3>
        {description && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {trend && (
              <span
                className={`text-xs font-semibold ${
                  trendDirection === "up" ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {trend}
              </span>
            )}
            <span className="text-xs text-slate-400 font-medium">
              {description}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
