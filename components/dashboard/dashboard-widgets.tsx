"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RiArrowUpLine,
  RiArrowDownLine,
  RiMoneyDollarCircleLine,
  RiShoppingCartLine,
  RiGroupLine,
  RiTruckLine,
  RiLineChartLine,
  RiBarChartBoxLine
} from "react-icons/ri";

import RevenueTrendsChart from "./revenue-trends-chart";

const widgets = [
  {
    title: "Total Revenue",
    value: "$2,847,500",
    change: "+12.5%",
    changeType: "increase",
    icon: RiMoneyDollarCircleLine,
    description: "vs last month"
  },
  {
    title: "Active Orders",
    value: "1,248",
    change: "+8.2%",
    changeType: "increase",
    icon: RiShoppingCartLine,
    description: "vs last month"
  },
  {
    title: "Total Customers",
    value: "3,642",
    change: "-2.1%",
    changeType: "decrease",
    icon: RiGroupLine,
    description: "vs last month"
  },
  {
    title: "Pending Shipments",
    value: "89",
    change: "+15.3%",
    changeType: "increase",
    icon: RiTruckLine,
    description: "vs last week"
  }
];

const recentActivities = [
  { id: 1, action: "New order received", details: "Order #2847 - $1,249.00", time: "2 min ago" },
  { id: 2, action: "Customer registered", details: "John Smith - Premium Account", time: "15 min ago" },
  { id: 3, action: "Shipment delivered", details: "Order #2845 - Delivered to NYC", time: "1 hour ago" },
  { id: 4, action: "Inventory alert", details: "Low stock: Grain Product #123", time: "2 hours ago" },
  { id: 5, action: "Payment received", details: "Invoice #INV-2847 - $3,450.00", time: "3 hours ago" },
];

export default function DashboardWidgets() {
  console.log("DashboardWidgets rendered");

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map((widget, index) => (
          <Card key={index} className="elevation-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {widget.title}
              </CardTitle>
              <widget.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{widget.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {widget.changeType === "increase" ? (
                  <RiArrowUpLine className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <RiArrowDownLine className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={widget.changeType === "increase" ? "text-green-500" : "text-red-500"}>
                  {widget.change}
                </span>
                <span className="ml-1">{widget.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts Section */}
        <Card className="elevation-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <RiLineChartLine className="mr-2 h-5 w-5" />
              Revenue Trends
            </CardTitle>
            <CardDescription>
              Monthly revenue comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center rounded-lg">
              <RevenueTrendsChart />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="elevation-1">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest system activities and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-erp-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.details}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}