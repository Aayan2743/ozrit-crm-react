// EditCustomer.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import { list_customer,customer_update } from "../api/api";

export default function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams(); // assume your route is something like "/customers/:id/edit"
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    notes: "",
  });

  // 1) On mount, fetch the existing customer data by ID
  useEffect(() => {
    async function fetchCustomer() {
      try {
        const response = await list_customer(id);

        console.log(response.data.status);
        
        if (response.data.status) {
          const { fullName, mobile, email, address, notes } = response.data.data;
          setFormData({ fullName, mobile, email, address: address || "", notes: notes || "" });
        } else {
          toast.error("Could not load customer data.");
        //   navigate("/customers", { replace: true });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch customer. Please try again.");
        // navigate("/customers", { replace: true });
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomer();
  }, [id, navigate]);

  // 2) Simple client‐side validation before submitting
//   const validateFields = () => {
//     if (!formData.fullName.trim()) {
//       toast.error("Name cannot be empty.");
//       return false;
//     }

//     const phoneRegex = /^[0-9]{10}$/;
//     if (!formData.mobile.trim()) {
//       toast.error("Mobile number cannot be empty.");
//       return false;
//     }
//     if (!phoneRegex.test(formData.mobile)) {
//       toast.error("Mobile number must be 10 digits.");
//       return false;
//     }

//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//     if (!formData.email.trim()) {
//       toast.error("Email cannot be empty.");
//       return false;
//     }
//     if (!emailRegex.test(formData.email)) {
//       toast.error("Please enter a valid email address.");
//       return false;
//     }

//     // Address and notes are optional, so no further checks
//     return true;
//   };

  // 3) Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateFields()) return;

    setIsLoading(true);
    try {
      const payload = {
        id,
        fullName: formData.fullName.trim(),
        mobile: formData.mobile,
        email: formData.email.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
      };



      console.log("sdfjflkgj",payload);

     
      const response = await customer_update(payload);
      if (response.data.status) {
        toast.success("Customer updated successfully!", { duration: 2000 });
        navigate("/customer-list");
      } else {
        toast.error(response.data.message || "Update failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4) Update form state on change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    // You can replace this with a spinner or skeleton if you prefer
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <span className="text-lg font-medium text-gray-600">Loading…</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-8 w-8 text-purple-500" />
              <h1 className="text-3xl font-bold text-gray-800">Edit Customer</h1>
            </div>
            <p className="text-gray-600">
              Modify the customer’s details and save your changes
            </p>
          </div>

          {/* Edit Form Card */}
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-gray-700 font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="10‐digit mobile number"
                    value={formData.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700 font-medium">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="1234 Main St, City, State, PIN"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    rows={3}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-gray-700 font-medium">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional remarks…"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    rows={4}
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/customer-list")}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Cancel</span>
                  </Button>

                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex items-center space-x-2"
                    disabled={isLoading}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
