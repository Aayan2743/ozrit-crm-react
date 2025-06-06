
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Upload,
  FileText,
  CheckCircle,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddExpenseModal = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    title: "",
    isPaid: "unpaid",
    date: null,
    hasBill: false,
    billFile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    "Hosting",
    "Software",
    "Design Outsource",
    "Travel",
    "Marketing",
    "Office Supplies",
    "Freelancer Payment",
    "Miscellaneous"
  ];

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Expense logged successfully! 💸",
      description: `₹${formData.amount} expense has been added to your records.`,
    });
    
    setIsSubmitting(false);
    onClose();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, billFile: file });
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              step <= currentStep
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step < currentStep ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              step
            )}
          </div>
          {step < 2 && (
            <div
              className={`w-12 h-1 mx-2 transition-all duration-300 ${
                step < currentStep ? "bg-purple-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Basic Information</h3>
              <p className="text-gray-600">Let's start with the expense details</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="title">What is this expense for?</Label>
                <Input
                  id="title"
                  placeholder="e.g., Domain for Sai Garments"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Payment Status</Label>
                <div className="flex gap-4 mt-2">
                  <Button
                    type="button"
                    variant={formData.isPaid === "paid" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, isPaid: "paid" })}
                    className="flex-1"
                  >
                    Already Paid
                  </Button>
                  <Button
                    type="button"
                    variant={formData.isPaid === "unpaid" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, isPaid: "unpaid" })}
                    className="flex-1"
                  >
                    Unpaid
                  </Button>
                </div>
              </div>
              
              <div>
                <Label>
                  {formData.isPaid === "paid" ? "Payment Date" : "Due Date"}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upload Bill & Finish</h3>
              <p className="text-gray-600">Do you have a bill or receipt? (Optional)</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.hasBill ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, hasBill: true })}
                  className="flex-1"
                >
                  Yes, I have a bill
                </Button>
                <Button
                  type="button"
                  variant={!formData.hasBill ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, hasBill: false, billFile: null })}
                  className="flex-1"
                >
                  No, continue
                </Button>
              </div>
              
              {formData.hasBill && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload your bill or receipt</p>
                  <p className="text-xs text-gray-500 mb-4">Supports images and PDF files</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="bill-upload"
                  />
                  <Label htmlFor="bill-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>Choose File</span>
                    </Button>
                  </Label>
                  {formData.billFile && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {formData.billFile.name}
                    </p>
                  )}
                </div>
              )}

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-900 mb-3">Review Your Expense:</h4>
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span className="text-lg font-bold text-purple-600">₹{formData.amount || "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Title:</span>
                  <span>{formData.title || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Category:</span>
                  <span>{formData.category || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className={formData.isPaid === "paid" ? "text-green-600" : "text-orange-600"}>
                    {formData.isPaid === "paid" ? "Paid" : "Unpaid"}
                  </span>
                </div>
                {formData.date && (
                  <div className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span>{format(formData.date, "PPP")}</span>
                  </div>
                )}
                {formData.hasBill && formData.billFile && (
                  <div className="flex justify-between">
                    <span className="font-medium">Bill:</span>
                    <span className="text-green-600">✓ Uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New Expense</DialogTitle>
      </DialogHeader>
      
      <div className="py-6">
        <StepIndicator />
        {renderStep()}
        
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < 2 ? (
            <Button
              onClick={handleNext}
              disabled={!formData.amount || !formData.title || !formData.category}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (formData.hasBill && !formData.billFile)}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Saving..." : "Save & Close"}
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

export default AddExpenseModal;
