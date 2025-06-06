
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddPaymentModal from "../components/AddPaymentModal";
import { Plus, Eye, Edit, Download, DollarSign, Search, Filter } from "lucide-react";

const InvoiceList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Mock invoice data
  const invoices = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      customer: "Tech Startup Inc",
      project: "E-commerce Website",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      totalAmount: 15000,
      paidAmount: 10000,
      balance: 5000,
      status: "Unpaid"
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      customer: "Digital Agency",
      project: "Portfolio Website",
      issueDate: "2024-01-10",
      dueDate: "2024-01-25",
      totalAmount: 8000,
      paidAmount: 8000,
      balance: 0,
      status: "Paid"
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      customer: "Restaurant Chain",
      project: "Food Delivery App",
      issueDate: "2024-01-05",
      dueDate: "2024-01-20",
      totalAmount: 25000,
      paidAmount: 0,
      balance: 25000,
      status: "Overdue"
    }
  ];

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Paid":
        return "default";
      case "Unpaid":
        return "secondary";
      case "Overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getDueDateColor = (dueDate, status) => {
    if (status === "Paid") return "text-green-600";
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "text-red-600";
    if (diffDays <= 7) return "text-orange-600";
    return "text-gray-600";
  };

  const handleAddPayment = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentModalOpen(true);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0);
  const overdueCount = invoices.filter(inv => inv.status === "Overdue").length;
  const overdueValue = invoices.filter(inv => inv.status === "Overdue").reduce((sum, inv) => sum + inv.balance, 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
              <p className="text-gray-600 mt-2">Track and manage all your invoices</p>
            </div>
            <Link to="/add-invoice">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Invoice
              </Button>
            </Link>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{totalInvoices}</div>
                  <div className="text-xs text-gray-600">Total Invoices</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">₹{totalRevenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Revenue Billed</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Total Paid</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">₹{totalOutstanding.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Outstanding</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">{overdueCount}</div>
                  <div className="text-xs text-gray-600">Overdue Count</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">₹{overdueValue.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Overdue Value</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invoice Cards */}
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div>
                        <div className="font-semibold text-lg">{invoice.invoiceNumber}</div>
                        <Link to={`/customer/${invoice.id}`} className="text-blue-600 hover:underline">
                          {invoice.customer}
                        </Link>
                        <div className="text-sm text-gray-600">{invoice.project}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Issue Date</div>
                        <div className="font-medium">{invoice.issueDate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Due Date</div>
                        <div className={`font-medium ${getDueDateColor(invoice.dueDate, invoice.status)}`}>
                          {invoice.dueDate}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Amount</div>
                        <div className="font-semibold">₹{invoice.totalAmount.toLocaleString()}</div>
                        <div className="text-sm">
                          <span className="text-green-600">Paid: ₹{invoice.paidAmount.toLocaleString()}</span>
                          {invoice.balance > 0 && (
                            <span className="text-red-600 ml-2">Balance: ₹{invoice.balance.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <Badge variant={getStatusBadgeVariant(invoice.status)} className="mb-2">
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Link to={`/invoice/${invoice.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {invoice.balance > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddPayment(invoice)}
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No invoices found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <AddPaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        invoice={selectedInvoice}
      />
    </div>
  );
};

export default InvoiceList;
