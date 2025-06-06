"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { month: "Jan", revenue: 24000 },
    { month: "Feb", revenue: 22100 },
    { month: "Mar", revenue: 22900 },
    { month: "Apr", revenue: 20000 },
    { month: "May", revenue: 27800 },
    { month: "Jun", revenue: 18900 },
    { month: "Jul", revenue: 23900 },
    { month: "Aug", revenue: 34900 },
    { month: "Sep", revenue: 32000 },
    { month: "Oct", revenue: 31000 },
    { month: "Nov", revenue: 37000 },
    { month: "Dec", revenue: 40000 },
];

export default function RevenueTrendsChart() {
    return (
        <div className="h-full w-full min-h-[220px] flex items-center justify-center mt-14">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fill: "#757575", fontSize: 13 }} axisLine={false} tickLine={false} />
                    <YAxis
                        tickFormatter={v => `$${v / 1000}k`}
                        tick={{ fill: "#757575", fontSize: 13 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            background: "#fff",
                            border: "1px solid #e0e0e0",
                            borderRadius: 8,
                            color: "#333",
                            fontSize: 14,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                        }}
                        formatter={v => `$${v.toLocaleString()}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1976d2"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#fff", stroke: "#1976d2", strokeWidth: 2 }}
                        activeDot={{ r: 7, fill: "#1976d2" }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}