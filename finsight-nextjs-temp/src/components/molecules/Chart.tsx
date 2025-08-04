'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  data: ChartDataPoint[];
  type: 'line' | 'bar' | 'pie' | 'donut';
  width?: number;
  height?: number;
  className?: string;
  title?: string;
  showLabels?: boolean;
  showValues?: boolean;
  showGrid?: boolean;
  animate?: boolean;
}

// Line Chart Component
const LineChart: React.FC<ChartProps> = ({ 
  data, 
  width = 400, 
  height = 300, 
  className,
  showGrid = true,
  animate = true
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const padding = 40;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);

  const points = data.map((point, index) => {
    const x = padding + (chartWidth * index) / (data.length - 1);
    const y = padding + chartHeight - (chartHeight * point.value) / maxValue;
    return { x, y, ...point };
  });

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className={cn("relative", className)}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid Lines */}
        {showGrid && (
          <g className="stroke-gray-200" strokeWidth="1">
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1={padding}
                y1={padding + chartHeight * ratio}
                x2={width - padding}
                y2={padding + chartHeight * ratio}
              />
            ))}
            {/* Vertical grid lines */}
            {data.map((_, index) => (
              <line
                key={index}
                x1={padding + (chartWidth * index) / (data.length - 1)}
                y1={padding}
                x2={padding + (chartWidth * index) / (data.length - 1)}
                y2={height - padding}
              />
            ))}
          </g>
        )}

        {/* Area fill */}
        <motion.path
          d={`${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="url(#gradient)"
          fillOpacity="0.1"
          initial={animate ? { pathLength: 0 } : {}}
          animate={animate ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animate ? { pathLength: 0 } : {}}
          animate={animate ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Data points */}
        {points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="6"
            fill="#3B82F6"
            stroke="white"
            strokeWidth="2"
            initial={animate ? { scale: 0 } : {}}
            animate={animate ? { scale: 1 } : {}}
            transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
            className="cursor-pointer hover:r-8 transition-all"
          />
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Bar Chart Component
const BarChart: React.FC<ChartProps> = ({ 
  data, 
  width = 400, 
  height = 300, 
  className,
  showValues = true,
  animate = true
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const padding = 40;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);
  const barWidth = chartWidth / data.length * 0.7;
  const barSpacing = chartWidth / data.length * 0.3;

  return (
    <div className={cn("relative", className)}>
      <svg width={width} height={height}>
        {data.map((item, index) => {
          const barHeight = (chartHeight * item.value) / maxValue;
          const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
          const y = height - padding - barHeight;

          return (
            <g key={index}>
              {/* Bar */}
              <motion.rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color || "#3B82F6"}
                rx="4"
                initial={animate ? { height: 0, y: height - padding } : {}}
                animate={animate ? { height: barHeight, y } : {}}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              
              {/* Value label */}
              {showValues && (
                <motion.text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className="text-sm font-medium fill-gray-700"
                  initial={animate ? { opacity: 0 } : {}}
                  animate={animate ? { opacity: 1 } : {}}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {item.value}
                </motion.text>
              )}
              
              {/* Category label */}
              <motion.text
                x={x + barWidth / 2}
                y={height - padding + 20}
                textAnchor="middle"
                className="text-xs fill-gray-500"
                initial={animate ? { opacity: 0 } : {}}
                animate={animate ? { opacity: 1 } : {}}
                transition={{ delay: index * 0.1 + 0.6 }}
              >
                {item.label}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Pie Chart Component
const PieChart: React.FC<ChartProps> = ({ 
  data, 
  width = 300, 
  height = 300, 
  className,
  showLabels = true,
  animate = true
}) => {
  const radius = Math.min(width, height) / 2 - 20;
  const centerX = width / 2;
  const centerY = height / 2;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativeAngle = 0;

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  return (
    <div className={cn("relative", className)}>
      <svg width={width} height={height}>
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const startAngle = cumulativeAngle;
          const endAngle = cumulativeAngle + angle;
          
          const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
          const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
          const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
          const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          cumulativeAngle += angle;

          return (
            <motion.path
              key={index}
              d={pathData}
              fill={item.color || colors[index % colors.length]}
              stroke="white"
              strokeWidth="2"
              initial={animate ? { scale: 0 } : {}}
              animate={animate ? { scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          );
        })}
      </svg>
      
      {/* Legend */}
      {showLabels && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2"
              initial={animate ? { opacity: 0, x: -20 } : {}}
              animate={animate ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1 + 0.6 }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Donut Chart Component
const DonutChart: React.FC<ChartProps> = ({ 
  data, 
  width = 300, 
  height = 300, 
  className,
  showLabels = true,
  animate = true
}) => {
  const outerRadius = Math.min(width, height) / 2 - 20;
  const innerRadius = outerRadius * 0.6;
  const centerX = width / 2;
  const centerY = height / 2;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativeAngle = 0;

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  return (
    <div className={cn("relative", className)}>
      <svg width={width} height={height}>
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const startAngle = cumulativeAngle;
          const endAngle = cumulativeAngle + angle;
          
          const x1 = centerX + outerRadius * Math.cos((startAngle * Math.PI) / 180);
          const y1 = centerY + outerRadius * Math.sin((startAngle * Math.PI) / 180);
          const x2 = centerX + outerRadius * Math.cos((endAngle * Math.PI) / 180);
          const y2 = centerY + outerRadius * Math.sin((endAngle * Math.PI) / 180);
          
          const x3 = centerX + innerRadius * Math.cos((endAngle * Math.PI) / 180);
          const y3 = centerY + innerRadius * Math.sin((endAngle * Math.PI) / 180);
          const x4 = centerX + innerRadius * Math.cos((startAngle * Math.PI) / 180);
          const y4 = centerY + innerRadius * Math.sin((startAngle * Math.PI) / 180);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${x1} ${y1}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            'Z'
          ].join(' ');

          cumulativeAngle += angle;

          return (
            <motion.path
              key={index}
              d={pathData}
              fill={item.color || colors[index % colors.length]}
              stroke="white"
              strokeWidth="2"
              initial={animate ? { scale: 0 } : {}}
              animate={animate ? { scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          );
        })}
        
        {/* Center content */}
        <motion.text
          x={centerX}
          y={centerY - 8}
          textAnchor="middle"
          className="text-2xl font-bold fill-gray-900"
          initial={animate ? { opacity: 0 } : {}}
          animate={animate ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          {total}
        </motion.text>
        <motion.text
          x={centerX}
          y={centerY + 16}
          textAnchor="middle"
          className="text-sm fill-gray-500"
          initial={animate ? { opacity: 0 } : {}}
          animate={animate ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          Total
        </motion.text>
      </svg>
      
      {/* Legend */}
      {showLabels && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2"
              initial={animate ? { opacity: 0, x: -20 } : {}}
              animate={animate ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1 + 0.6 }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">{item.value}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Chart Component
const Chart: React.FC<ChartProps> = ({ type, title, className, ...props }) => {
  const ChartComponent = {
    line: LineChart,
    bar: BarChart,
    pie: PieChart,
    donut: DonutChart,
  }[type];

  return (
    <div className={cn("bg-white rounded-xl p-6 shadow-soft", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ChartComponent {...props} type={type} />
    </div>
  );
};

export default Chart;
