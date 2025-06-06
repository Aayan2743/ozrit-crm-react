
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  DollarSign,
  AlertCircle,
  FileText,
  Eye,
  Search
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import AddExpenseModal from "@/components/AddExpenseModal";

const ExpenseManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState("6months");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Demo data for expenses
  const expenses = [
    {
      id: 1,
      title: "Domain for Sai Garments",
      amount: 1200,
      category: "Hosting",
      project: "Sai Garments Website",
      client: "Sai Garments",
      status: "paid",
      dateIncurred: "2024-05-15",
      dueDate: null,
      hasBill: true,
      enteredBy: "Admin"
    },
    {
      id: 2,
      title: "Figma Pro Subscription",
      amount: 1500,
      category: "Software",
      project: null,
      client: null,
      status: "paid",
      dateIncurred: "2024-05-10",
      dueDate: null,
      hasBill: true,
      enteredBy: "Designer"
    },
    {
      id: 3,
      title: "Logo Design Outsource",
      amount: 5000,
      category: "Design Outsource",
      project: "StartupHub Branding",
      client: "StartupHub",
      status: "pending",
      dateIncurred: "2024-05-20",
      dueDate: "2024-06-05",
      hasBill: false,
      enteredBy: "Project Manager"
    },
    {
      id: 4,
      title: "AWS Hosting",
      amount: 3500,
      category: "Hosting",
      project: "E-commerce Platform",
      client: "TechCorp Solutions",
      status: "pending",
      dateIncurred: "2024-05-25",
      dueDate: "2024-06-01",
      hasBill: true,
      enteredBy: "Developer"
    },
    {
      id: 5,
      title: "Travel to Client Meeting",
      amount: 2800,
      category: "Travel",
      project: "Digital Innovations",
      client: "Digital Innovations",
      status: "pending",
      dateIncurred: "2024-04-28",
      dueDate: "2024-05-28",
      hasBill: true,
      enteredBy: "Sales"
    }
  ];

  // Analytics data
  const monthlyExpenseData = [
    { month: "Jan", expenses: 15000, revenue: 45000 },
    { month: "Feb", expenses: 18000, revenue: 52000 },
    { month: "Mar", expenses: 16000, revenue: 48000 },
    { month: "Apr", expenses: 19000, revenue: 61000 },
    { month: "May", expenses: 22000, revenue: 55000 },
    { month: "Jun", expenses: 17000, revenue: 68000 },
  ];

  const categoryData = [
    { name: "Hosting", value: 8500, color: "#8b5cf6" },
    { name: "Software", value: 6200, color: "#06b6d4" },
    { name: "Design Outsource", value: 12000, color: "#10b981" },
    { name: "Travel", value: 4500, color: "#f59e0b" },
    { name: "Miscellaneous", value: 3800, color: "#ef4444" },
  ];

  const chartConfig = {
    expenses: { label: "Expenses", color: "#ef4444" },
    revenue: { label: "Revenue", color: "#10b981" },
  };

  // Calculate summary metrics
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const unpaidExpenses = expenses.filter(exp => exp.status === "pending");
  const unpaidAmount = unpaidExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const overdueExpenses = unpaidExpenses.filter(exp => new Date(exp.dueDate) < new Date());
  const dueSoonExpenses = unpaidExpenses.filter(exp => {
    const dueDate = new Date(exp.dueDate);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= weekFromNow;
  });

  const getStatusBadge = (expense) => {
    if (expense.status === "paid") {
      return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
    }
    
    if (expense.status === "pending") {
      const isOverdue = new Date(expense.dueDate) < new Date();
      const isDueSoon = dueSoonExpenses.some(e => e.id === expense.id);
      
      if (isOverdue) {
        return <Badge className="bg-red-100 text-red-800">🔴 Overdue</Badge>;
      }
      if (isDueSoon) {
        return <Badge className="bg-yellow-100 text-yellow-800">🟡 Due This Week</Badge>;
      }
      return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    if (categoryFilter !== "all" && expense.category !== categoryFilter) return false;
    if (statusFilter !== "all" && expense.status !== statusFilter) return false;
    if (searchTerm && !expense.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
              <p className="text-gray-600 mt-1">Track and manage all your business expenses 💸</p>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="h-4 w-4" />
                  Add New Expense
                </Button>
              </DialogTrigger>
              <AddExpenseModal onClose={() => setIsAddModalOpen(false)} />
            </Dialog>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-red-100">
                    <DollarSign className="h-6 w-6 text-red-600" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-sm font-medium text-green-600 mt-1">This Month</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">₹{unpaidAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Unpaid Expenses</p>
                  <p className="text-sm font-medium text-orange-600 mt-1">{unpaidExpenses.length} pending</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-red-100">
                    <Calendar className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">{overdueExpenses.length}</p>
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-sm font-medium text-red-600 mt-1">Needs attention</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-yellow-100">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">{dueSoonExpenses.length}</p>
                  <p className="text-sm text-gray-600">Due This Week</p>
                  <p className="text-sm font-medium text-yellow-600 mt-1">Upcoming dues</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Expense Trend */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Expense vs Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyExpenseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
                        name="Expenses"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Expense by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Expense by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-sm font-medium">₹{category.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Hosting">Hosting</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Design Outsource">Design Outsource</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
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
              </div>
            </CardContent>
          </Card>

          {/* Expense List */}
          <Card>
            <CardHeader>
              <CardTitle>All Expenses ({filteredExpenses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expense Title</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Project/Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Bill</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{expense.title}</p>
                            <p className="text-sm text-gray-500">Added by {expense.enteredBy}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">₹{expense.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{expense.category}</Badge>
                        </TableCell>
                        <TableCell>
                          {expense.project ? (
                            <div>
                              <p className="text-sm font-medium">{expense.project}</p>
                              <p className="text-xs text-gray-500">{expense.client}</p>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(expense)}</TableCell>
                        <TableCell>
                          {expense.dueDate ? (
                            <span className={new Date(expense.dueDate) < new Date() ? "text-red-600 font-medium" : ""}>
                              {expense.dueDate}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {expense.hasBill ? (
                            <Button size="sm" variant="outline" className="gap-1">
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                          ) : (
                            <span className="text-gray-400">No bill</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManagement;
