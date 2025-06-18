// EditExpenseModal.js
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
// import { update_expense } from "../api/api";

const EditExpenseModal = ({ expenseData, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: expenseData.amount || "",
    category: expenseData.category || "",
    title: expenseData.title || "",
    isPaid: expenseData.status === "paid" ? "paid" : "unpaid",
    date: expenseData.due_date ? new Date(expenseData.due_date) : null,
    hasBill: expenseData.has_bill === 1,
    billFile: null,
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, billFile: file });
    }
  };

  const handleSubmit = async () => {
    if (formData.hasBill && !formData.billFile && !expenseData.bill_url) {
      toast({
        title: "Bill file missing",
        description: "Please upload the bill or continue without it.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("amount", formData.amount);
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("status", formData.isPaid === "paid" ? "paid" : "pending");
      payload.append("dueDate", formData.date ? formData.date.toISOString().split("T")[0] : "");
      payload.append("hasBill", formData.hasBill ? "1" : "0");
      if (formData.billFile) {
        payload.append("bill", formData.billFile);
      }

      const response = await update_expense(expenseData.id, payload);

      if (response.data?.status) {
        toast({
          title: "Expense Updated ✅",
          description: "Changes saved successfully.",
        });
        if (onSuccess) onSuccess(response.data.data);
        onClose();
      } else {
        toast({
          title: "Update Failed",
          description: response.data?.message || "Try again later.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error updating expense",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
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
            {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
          </div>
          {step < 2 && (
            <div className={`w-12 h-1 mx-2 transition-all duration-300 ${
              step < currentStep ? "bg-purple-600" : "bg-gray-200"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  // You can reuse your renderStep from AddExpenseModal if you want

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Expense</DialogTitle>
      </DialogHeader>
      <div className="py-6">
        <StepIndicator />
        {/* renderStep() logic here same as in AddExpenseModal */}
        {/* Bottom buttons for submit and navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(1)}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (formData.hasBill && !formData.billFile && !expenseData.bill_url)}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Saving..." : "Save & Close"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default EditExpenseModal;
