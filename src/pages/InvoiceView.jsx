
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddPaymentModal from "../components/AddPaymentModal";
import { Download, Edit, DollarSign, ArrowLeft, Eye } from "lucide-react";

const InvoiceView = () => {
  const { id } = useParams();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Mock invoice data
  const invoice = {
    id: 1,
    invoiceNumber: "INV-2024-001",
    customer: {
      name: "Tech Startup Inc",
      email: "contact@techstartup.com",
      phone: "+1 234 567 8901"
    },
    project: "E-commerce Website",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    status: "Unpaid",
    services: [
      { name: "Website Design", qty: 1, unitPrice: 5000, total: 5000 },
      { name: "Frontend Development", qty: 1, unitPrice: 7000, total: 7000 },
      { name: "Backend Development", qty: 1, unitPrice: 3000, total: 3000 }
    ],
    totalAmount: 15000,
    advancePaid: 10000,
    balance: 5000,
    notes: "Initial payment received. Final payment due on completion."
  };

  // Mock payment history
  const paymentHistory = [
    {
      id: 1,
      date: "2024-01-16",
      amount: 5000,
      mode: "Bank Transfer",
      staff: "John Doe",
      hasScreenshot: true
    },
    {
      id: 2,
      date: "2024-01-20",
      amount: 5000,
      mode: "UPI",
      staff: "Jane Smith",
      hasScreenshot: false
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/invoices">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Invoices
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{invoice.invoiceNumber}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant={getStatusBadgeVariant(invoice.status)}>
                    {invoice.status}
                  </Badge>
                  <span className="text-gray-600">Issue Date: {invoice.issueDate}</span>
                  <span className="text-gray-600">Due Date: {invoice.dueDate}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Invoice
              </Button>
              {invoice.balance > 0 && (
                <Button onClick={() => setPaymentModalOpen(true)}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer & Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer & Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-medium">Name:</span> {invoice.customer.name}</div>
                        <div><span className="font-medium">Email:</span> {invoice.customer.email}</div>
                        <div><span className="font-medium">Phone:</span> {invoice.customer.phone}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Project Information</h4>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-medium">Project:</span> {invoice.project}</div>
                        <div><span className="font-medium">Invoice Date:</span> {invoice.issueDate}</div>
                        <div><span className="font-medium">Due Date:</span> {invoice.dueDate}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services & Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Services & Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.services.map((service, index) => (
                        <TableRow key={index}>
                          <TableCell>{service.name}</TableCell>
                          <TableCell className="text-center">{service.qty}</TableCell>
                          <TableCell className="text-right">₹{service.unitPrice.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹{service.total.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Payment History */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentHistory.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Payment Mode</TableHead>
                          <TableHead>Logged By</TableHead>
                          <TableHead>Proof</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentHistory.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                            <TableCell>{payment.mode}</TableCell>
                            <TableCell>{payment.staff}</TableCell>
                            <TableCell>
                              {payment.hasScreenshot ? (
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              ) : (
                                <span className="text-gray-400">No proof</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No payments recorded yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Total Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold">₹{invoice.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Advance Paid:</span>
                    <span className="font-semibold text-green-600">₹{invoice.advancePaid.toLocaleString()}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance:</span>
                    <span className={`font-bold text-lg ${invoice.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{invoice.balance.toLocaleString()}
                    </span>
                  </div>
                  <Badge variant={getStatusBadgeVariant(invoice.status)} className="w-full justify-center">
                    {invoice.status}
                  </Badge>
                </CardContent>
              </Card>

              {/* Notes */}
              {invoice.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{invoice.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddPaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        invoice={invoice}
      />
    </div>
  );
};

export default InvoiceView;
