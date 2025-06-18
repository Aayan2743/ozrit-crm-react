import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { list_customers, list_project_by_customer_id, list_invoice_ids,invoices_update } from '../api/api';
// import {get_invoice_by_id} from '../api/api'



const UpdateInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [customers, setCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    customer: "",
    project: "",
    invoiceDate: "",
    dueDate: "",
    advancePaid: 0,
    notes: "",
    status: "Unpaid"
  });

  const getCustomers = async () => {
    const res = await list_customers();
    const customerData = res.data.data.map(({ id, fullName }) => ({ id, fullName }));
    setCustomers(customerData);
  };

  const fetchProjectsByCustomerId = async (customerId) => {
    const intCustomerId = parseInt(customerId);
    const res = await list_project_by_customer_id(intCustomerId);

    console.log("ddd",res.data.data)
    const projects = res.data.data.map(({ id, projectTitle }) => ({ id, projectTitle }));

    console.log("project",projects);
    setProjects(projects);
  };

 


useEffect(() => {
  const loadInvoice = async () => {
    try {
      // Step 1: Customers
      const customerRes = await list_customers();
      const customerData = customerRes.data.data.map(({ id, fullName }) => ({
        id,
        fullName,
      }));
      setCustomers(customerData);

      // Step 2: Invoice
      const invoiceRes = await list_invoice_ids(id);
      const invoice = invoiceRes.data.invoice;
      const customerId = invoice.customer.id;
      const projectId = invoice.project.id;

      // Step 3: Projects for that customer
      const projectRes = await list_project_by_customer_id(customerId);
      const projectData = projectRes.data.data.map(({ id, projectTitle }) => ({
        id,
        projectTitle,
      }));
      setProjects(projectData);

      // Step 4: Use setTimeout to delay setting project
      setTimeout(() => {
        setFormData({
          customer: customerId.toString(),
          project: projectId.toString(),
          invoiceDate: invoice.invoiceDate,
          dueDate: invoice.dueDate,
          advancePaid: invoice.advancePaid,
          notes: invoice.notes,
          status: invoice.status,
        });

        const serviceRaw= JSON.parse(invoice.services);
        const rawServices = Array.isArray(serviceRaw) ? serviceRaw : [];

        const normalizedServices = rawServices.map((s) => ({
          name: s.name ?? "",
          qty: Number(s.qty) || 1,
          unitPrice: Number(s.unitPrice) || 0,
          total:
            "total" in s && Number(s.total)
              ? Number(s.total)
              : (Number(s.qty) || 1) * (Number(s.unitPrice) || 0),
        }));

        console.log("normalizedServices", serviceRaw);

        setServices(normalizedServices);

        // setServices(Array.isArray(invoice.services) ? invoice.services : []);
      }, 0); // <- forces it to run AFTER project list is committed
    } catch (error) {
      console.error("Invoice load error:", error);
      toast({
        title: "Error",
        description: "Failed to load invoice data",
        variant: "destructive",
      });
    }
  };

  loadInvoice();
}, [id]);



  // const updateService = (index, field, value) => {
  //   const updated = [...services];
  //   updated[index][field] = value;
  //   if (field === "qty" || field === "unitPrice") {
  //     updated[index].total = updated[index].qty * updated[index].unitPrice;
  //   }
  //   setServices(updated);
  // };


  const updateService = (index, field, value) => {
  const updated = [...services];
  updated[index][field] = value;

  if (field === "qty" || field === "unitPrice") {
    const qty = Number(updated[index].qty) || 1;
    const unitPrice = Number(updated[index].unitPrice) || 0;
    updated[index].total = qty * unitPrice;
  }

  setServices(updated);
};


  // const addService = () => {
  //   setServices([...services, { name: "", qty: 1, unitPrice: 0, total: 0 }]);
  // };


  const addService = () => {
  setServices([...services, { name: "", qty: 1, unitPrice: 0, total: 0 }]);
};
  // const removeService = (index) => {
  //   if (services.length > 1) {
  //     setServices(services.filter((_, i) => i !== index));
  //   }
  // };

  const removeService = (index) => {
  if (services.length > 1) {
    setServices(services.filter((_, i) => i !== index));
  }
};

  const calculateGrandTotal = () => services.reduce((sum, s) => sum + s.total, 0);
  const calculateBalance = () => calculateGrandTotal() - formData.advancePaid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer || !formData.project || !formData.invoiceDate || !formData.dueDate) {
      return toast({ title: "Error", description: "All fields are required.", variant: "destructive" });
    }

    const payload = {
      ...formData,
      services,
      totalAmount: calculateGrandTotal(),
      balance: calculateBalance()
    };

    try {
        const response = await invoices_update(id, payload);
        console.log("Invoice update success:", response.data);
        toast({
          title: "Success",
          description: "Invoice updated successfully!",
        });
        // navigate("/invoices");
      } catch (error) {
        console.error("Invoice update failed:", error.response?.data || error.message);
        toast({
          title: "Error",
          description: "Failed to update invoice.",
          variant: "destructive"
        });
      }


  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link to="/invoices">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Update Invoice</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
     
<Card>
  <CardHeader>
    <CardTitle>Basic Information</CardTitle>
  </CardHeader>
  <CardContent className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>Customer *</Label>
        <Select
          value={formData.customer}
          onValueChange={(value) => {
            setFormData({ ...formData, customer: value, project: "" });
            fetchProjectsByCustomerId(value);
          }}
        >
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
        <Label>Linked Project *</Label>
        <Select
          value={formData.project}
          onValueChange={(value) =>
            setFormData({ ...formData, project: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id.toString()} value={project.id.toString()}>
                {project.projectTitle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>Invoice Date *</Label>
        <Input
          type="date"
          value={formData.invoiceDate}
          onChange={(e) =>
            setFormData({ ...formData, invoiceDate: e.target.value })
          }
        />
      </div>
      <div>
        <Label>Due Date *</Label>
        <Input
          type="date"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
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
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
        >
          <div className="md:col-span-2">
            <Label>Service Name</Label>
            <Input
              value={service.name}
              onChange={(e) =>
                updateService(index, "name", e.target.value)
              }
              placeholder="Enter service name"
            />
          </div>
          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              min="1"
              value={service.qty}
              onChange={(e) =>
                updateService(index, "qty", parseInt(e.target.value) || 1)
              }
            />
          </div>
          <div>
            <Label>Unit Price (₹)</Label>
            <Input
              type="number"
              min="0"
              value={service.unitPrice}
              onChange={(e) =>
                updateService(index, "unitPrice", parseFloat(e.target.value) || 0)
              }
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
        <Label>Advance Paid (₹)</Label>
        <Input
          type="number"
          min="0"
          max={calculateGrandTotal()}
          value={formData.advancePaid}
          readOnly
          onChange={(e) =>
            setFormData({
              ...formData,
              advancePaid: parseFloat(e.target.value) || 0
            })
          }
        />
      </div>
      <div>
        <Label>Balance</Label>
        <div
          className={`h-10 flex items-center px-3 border rounded-md font-semibold ${
            calculateBalance() > 0
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          ₹{calculateBalance().toLocaleString()}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData({ ...formData, status: value })
          }
        >
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
      <Label>Notes (Optional)</Label>
      <Textarea
        value={formData.notes}
        onChange={(e) =>
          setFormData({ ...formData, notes: e.target.value })
        }
        placeholder="Add any additional notes..."
        rows={3}
      />
    </div>
  </CardContent>
</Card>

{/* Submit Button */}
<div className="flex justify-end space-x-4">
  <Link to="/invoices">
    <Button variant="outline">Cancel</Button>
  </Link>
  <Button
    type="submit"
    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
  >
    Update Invoice
  </Button>
</div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateInvoice;
