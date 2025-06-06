import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Sparkles
} from "lucide-react";

import {customer_store} from '../api/api';
const AddCustomer = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    notes: ""
  });

  const steps = [
    { id: 1, title: "Basic Info", icon: User },
    { id: 2, title: "Contact Details", icon: Phone },
    { id: 3, title: "Additional Info", icon: FileText }
  ];

  const progress = (currentStep / steps.length) * 100;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const validateCurrentStep = () => {
  switch (currentStep) {
    case 1:
      if (!formData.fullName.trim()) {
        toast.error("Please enter the full name!");
        return false;
      }
      return true;

    case 2:
      // Mobile validation (basic 10-digit check)
      const mobileRegex = /^[0-9]{10}$/;
      if (!formData.mobile.trim()) {
        toast.error("Please enter the mobile number!");
        return false;
      }
      if (!mobileRegex.test(formData.mobile)) {
        toast.error("Please enter a valid mobile number!");
        return false;
      }

      // Email validation (basic email format check)
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!formData.email.trim()) {
        toast.error("Please enter the email address!");
        return false;
      }
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address!");
        return false;
      }
      return true;

    case 3:
      if (!formData.address.trim()) {
        toast.error("Please enter the Address!");
        return false;
      }
      if (!formData.notes.trim()==="") {
        toast.error("Please enter the Notes address!");
        return false;
      }
      return true;

    default:
      return true;
  }
};



  const handleNext = (e) => {
     e?.preventDefault();
    if (validateCurrentStep() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    
    // Ensure we're on the final step before allowing submission
    if (currentStep !== steps.length) {
      toast.error("Please complete all steps!");
      return;
    }
    
    // Final validation
    if (!formData.fullName || !formData.mobile || !formData.email) {
      toast.error("Please fill in all required fields!");
      return;
    }

    // Save to localStorage
    // const customers = JSON.parse(localStorage.getItem("customers") || "[]");
    // const newCustomer = {
    //   id: Date.now(),
    //   ...formData,
    //   createdAt: new Date().toISOString(),
    //   projects: 0,
    //   status: "new"
    // };

   console.log("form-data",formData);

     try {
           //  const response= await api.post('web-login',payload());
          const response= await customer_store(formData);
   
            console.log(response);
         if(response.data.status){
            toast.success("Customer added! Now assign a project 💡", {
              duration: 2000,
            });

            navigate('/customer-list')

         }else{
             setCurrentStep(2);
              toast.error(response.data.message);
         }



          } catch (error) {

              const message = error?.response?.data?.message || "Something went wrong";
              toast.error(message);
              console.error(error);



          }


   
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="h-16 w-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Let's start with the basics</h3>
              <p className="text-gray-600">Tell us about your new client</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-gray-700 font-medium">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter client's full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="mt-1 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Phone className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
              <p className="text-gray-600">How can we reach them?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="mobile" className="text-gray-700 font-medium">
                  Mobile Number *
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="+91 9999999999"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  className="mt-1 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileText className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Additional Details</h3>
              <p className="text-gray-600">Any extra information?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="address" className="text-gray-700 font-medium">
                  Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter client's address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="mt-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="notes" className="text-gray-700 font-medium">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about the client..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="mt-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-8 w-8 text-purple-500" />
              <h1 className="text-3xl font-bold text-gray-800">Add New Customer</h1>
            </div>
            <p className="text-gray-600">
              Let's add a new client to your growing network
            </p>
          </div>

          {/* Progress Bar */}
          <Card className="mb-8 bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Step {currentStep} of {steps.length}
                  </span>
                  <span className="text-sm font-medium text-purple-600">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="flex justify-between">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center space-y-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isCompleted ? "bg-green-500 text-white" :
                        isActive ? "bg-purple-500 text-white" :
                        "bg-gray-200 text-gray-500"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <span className={`text-xs font-medium ${
                        isActive ? "text-purple-600" : "text-gray-500"
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit}>
                {renderStepContent()}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  
                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Add Customer</span>
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Mascot/Encouragement */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-lg rounded-full px-4 py-2 shadow-lg">
              <span className="text-2xl">🎯</span>
              <span className="text-sm font-medium text-gray-700">
                You're doing great! Keep adding those amazing clients.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
