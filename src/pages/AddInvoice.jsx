
import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import {list_project_by_customer_id,list_customers} from '../api/api';

const AddInvoice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customers,setCustomer]=useState([]);
   const get_customers=async()=>{
       const customers=await list_customers()
        const customerData = customers.data.data.map(({ id, fullName  }) => ({ id, fullName }));
   
    setCustomer(customerData)
    }
  
      useEffect(()=>{
         
          get_customers();
        
      
        },[])


  const [formData, setFormData] = useState({
    customer: "",
    project: "",
    invoiceDate: "",
    dueDate: "",
    advancePaid: 0,
    notes: "",
    status: "Unpaid"
  });


  const fetchProjectsByCustomerId = async (customerId) => {
  try {
     
      const intCustomerId = parseInt(customerId);
          
    const res = await list_project_by_customer_id(intCustomerId)
    const projects = res.data;
    console.log("dkjfhdfkjghdfjkghdf",projects)
    // setCustomerProjects(projects);

    // // Optional: auto-select first project
    // setFormData((prev) => ({
    //   ...prev,
    //   project: projects[0]?.id?.toString() || "",
    // }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    // setCustomerProjects([]);
  }
};

  const [services, setServices] = useState([
    { name: "", qty: 1, unitPrice: 0, total: 0 }
  ]);

  // Mock data
  // const customers = [
  //   { id: 1, name: "Tech Startup Inc" },
  //   { id: 2, name: "Digital Agency" },
  //   { id: 3, name: "Restaurant Chain" }
  // ];

  const projects = [
    { id: 1, name: "E-commerce Website", customerId: 1 },
    { id: 2, name: "Portfolio Website", customerId: 2 },
    { id: 3, name: "Food Delivery App", customerId: 3 }
  ];

  const addService = () => {
    setServices([...services, { name: "", qty: 1, unitPrice: 0, total: 0 }]);
  };

  const removeService = (index) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const updateService = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    
    // Auto-calculate total
    if (field === 'qty' || field === 'unitPrice') {
      updatedServices[index].total = updatedServices[index].qty * updatedServices[index].unitPrice;
    }
    
    setServices(updatedServices);
  };

  const calculateGrandTotal = () => {
    return services.reduce((sum, service) => sum + service.total, 0);
  };

  const calculateBalance = () => {
    return calculateGrandTotal() - formData.advancePaid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.customer || !formData.project || !formData.invoiceDate || !formData.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (services.some(s => !s.name || s.unitPrice <= 0)) {
      toast({
        title: "Error",
        description: "Please complete all service details.",
        variant: "destructive"
      });
      return;
    }

    // Simulate save
    console.log("Invoice Data:", {
      ...formData,
      services,
      totalAmount: calculateGrandTotal(),
      balance: calculateBalance()
    });

    toast({
      title: "Success",
      description: "Invoice created successfully!"
    });

    // Redirect to invoice view (simulated with invoice list for now)
    navigate("/invoices");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
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
                <h1 className="text-3xl font-bold text-gray-900">Add New Invoice</h1>
                <p className="text-gray-600 mt-2">Create a new invoice for your client</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="customer">Customer *</Label>
                    <Select value={formData.customer} onValueChange={(value) => {
                        setFormData({ ...formData, customer: value, project: "" });
                        fetchProjectsByCustomerId(value); // 🔁 call API on change
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="project">Linked Project *</Label>
                    <Select value={formData.project} onValueChange={(value) => setFormData({...formData, project: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="invoiceDate">Invoice Date *</Label>
                    <Input
                      type="date"
                      value={formData.invoiceDate}
                      onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Services & Pricing</CardTitle>
                  <Button type="button" onClick={addService} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <div className="md:col-span-2">
                        <Label>Service Name</Label>
                        <Input
                          value={service.name}
                          onChange={(e) => updateService(index, 'name', e.target.value)}
                          placeholder="Enter service name"
                        />
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={service.qty}
                          onChange={(e) => updateService(index, 'qty', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div>
                        <Label>Unit Price (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={service.unitPrice}
                          onChange={(e) => updateService(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1">
                          <Label>Total</Label>
                          <div className="h-10 flex items-center px-3 border rounded-md bg-gray-50">
                            ₹{service.total.toLocaleString()}
                          </div>
                        </div>
                        {services.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeService(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>Total Amount</Label>
                    <div className="h-10 flex items-center px-3 border rounded-md bg-gray-50 font-semibold">
                      ₹{calculateGrandTotal().toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="advancePaid">Advance Paid (₹)</Label>
                    <Input
                      type="number"
                      min="0"
                      max={calculateGrandTotal()}
                      value={formData.advancePaid}
                      onChange={(e) => setFormData({...formData, advancePaid: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label>Balance</Label>
                    <div className={`h-10 flex items-center px-3 border rounded-md font-semibold ${
                      calculateBalance() > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      ₹{calculateBalance().toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Add any additional notes..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Link to="/invoices">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                Create Invoice
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInvoice;
