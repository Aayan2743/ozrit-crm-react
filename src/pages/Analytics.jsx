import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  Star,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("6months");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");

  // Demo data for metrics
  const metrics = [
    {
      title: "Total Revenue",
      value: "₹4,85,000",
      change: "+22%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Total Expenses",
      value: "₹1,45,000",
      change: "+8%",
      trend: "up",
      icon: TrendingDown,
      color: "text-red-600"
    },
    {
      title: "Net Profit",
      value: "₹3,40,000",
      change: "+28%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Pending Payments",
      value: "₹85,000",
      change: "-15%",
      trend: "down",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Projects Completed",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: CheckCircle,
      color: "text-purple-600"
    },
    {
      title: "Best Service",
      value: "Web Design",
      change: "₹2,85,000",
      trend: "up",
      icon: Star,
      color: "text-yellow-600"
    }
  ];

  // Demo data for charts
  const monthlyData = [
    { month: "Jan", revenue: 45000, expenses: 15000, profit: 30000 },
    { month: "Feb", revenue: 52000, expenses: 18000, profit: 34000 },
    { month: "Mar", revenue: 48000, expenses: 16000, profit: 32000 },
    { month: "Apr", revenue: 61000, expenses: 19000, profit: 42000 },
    { month: "May", revenue: 55000, expenses: 17000, profit: 38000 },
    { month: "Jun", revenue: 68000, expenses: 22000, profit: 46000 },
  ];

  const serviceData = [
    { name: "Web Design", value: 285000, color: "#8b5cf6" },
    { name: "SEO Services", value: 125000, color: "#06b6d4" },
    { name: "App Development", value: 85000, color: "#10b981" },
    { name: "Digital Marketing", value: 65000, color: "#f59e0b" },
    { name: "Maintenance", value: 45000, color: "#ef4444" },
  ];

  const clientData = [
    { name: "TechCorp Solutions", amount: 125000 },
    { name: "Digital Innovations", amount: 98000 },
    { name: "StartupHub", amount: 85000 },
    { name: "E-commerce Plus", amount: 72000 },
    { name: "Creative Agency", amount: 65000 },
  ];

  const paymentStatusData = [
    { name: "Paid", value: 70, count: 18, color: "#10b981" },
    { name: "Advance Only", value: 20, count: 4, color: "#f59e0b" },
    { name: "Unpaid", value: 10, count: 2, color: "#ef4444" },
  ];

  const transactions = [
    {
      id: 1,
      project: "E-commerce Website",
      client: "TechCorp Solutions",
      amount: 85000,
      mode: "Bank Transfer",
      date: "2024-05-15",
      advance: 25000,
      balance: 60000,
      status: "paid"
    },
    {
      id: 2,
      project: "SEO Optimization",
      client: "Digital Innovations",
      amount: 45000,
      mode: "UPI",
      date: "2024-05-12",
      advance: 15000,
      balance: 30000,
      status: "advance"
    },
    {
      id: 3,
      project: "Mobile App",
      client: "StartupHub",
      amount: 125000,
      mode: "Bank Transfer",
      date: "2024-05-08",
      advance: 50000,
      balance: 75000,
      status: "unpaid"
    },
  ];

  const chartConfig = {
    revenue: { label: "Revenue", color: "#8b5cf6" },
    expenses: { label: "Expenses", color: "#ef4444" },
    profit: { label: "Profit", color: "#10b981" },
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
              <p className="text-gray-600 mt-1">Great work! You're up 22% from last month 🚀</p>
            </div>
            <div className="flex gap-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="yearly">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg bg-opacity-10 ${metric.color.replace('text-', 'bg-')}`}>
                        <Icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                      {metric.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <p className="text-sm text-gray-600">{metric.title}</p>
                      <p className={`text-sm font-medium mt-1 ${
                        metric.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}>
                        {metric.change} vs last month
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue & Expenses */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Monthly Revenue & Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" />
                      <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Revenue by Service */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {serviceData.map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: service.color }}
                        />
                        <span className="text-sm">{service.name}</span>
                      </div>
                      <span className="text-sm font-medium">₹{service.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Client-wise Revenue */}
            <Card>
              <CardHeader>
                <CardTitle>Top Clients by Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientData.map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-600">₹{client.amount.toLocaleString()}</p>
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(client.amount / 125000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Status & Profit Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {paymentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value}% (${props.payload.count} projects)`, 
                          name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  {paymentStatusData.map((status, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-sm font-medium">{status.name}</span>
                      </div>
                      <p className="text-lg font-bold mt-1">{status.value}%</p>
                      <p className="text-xs text-gray-600">{status.count} projects</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Profit Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Profit Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Project / Client</th>
                      <th className="text-left p-3">Amount</th>
                      <th className="text-left p-3">Payment Mode</th>
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Advance / Balance</th>
                      <th className="text-left p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{transaction.project}</p>
                            <p className="text-sm text-gray-600">{transaction.client}</p>
                          </div>
                        </td>
                        <td className="p-3 font-medium">₹{transaction.amount.toLocaleString()}</td>
                        <td className="p-3">{transaction.mode}</td>
                        <td className="p-3">{transaction.date}</td>
                        <td className="p-3">
                          <div className="text-sm">
                            <p>₹{transaction.advance.toLocaleString()} / ₹{transaction.balance.toLocaleString()}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge 
                            variant={
                              transaction.status === 'paid' ? 'default' : 
                              transaction.status === 'advance' ? 'secondary' : 'destructive'
                            }
                          >
                            {transaction.status === 'paid' ? 'Paid' : 
                             transaction.status === 'advance' ? 'Advance Only' : 'Unpaid'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
