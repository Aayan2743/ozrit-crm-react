
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import {create_payment} from '../api/api';

const AddPaymentModal = ({ isOpen, onClose, invoice }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentDate: "",
    paymentMode: "",
    hasProof: false,
    screenshot: null
  });
  const { toast } = useToast();

  const handleClose = () => {
    setCurrentStep(1);
    setPaymentData({
      amount: 0,
      paymentDate: "",
      paymentMode: "",
      hasProof: false,
      screenshot: null
    });
    onClose();
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!paymentData.amount || !paymentData.paymentDate || !paymentData.paymentMode) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // const handleSubmit = () => {
  //   // Simulate payment processing
  //   console.log("Payment Data:", paymentData);
    
  //   toast({
  //     title: "Success",
  //     description: `₹${paymentData.amount.toLocaleString()} added to invoice ${invoice?.invoiceNumber} ✅`
  //   });

  //   handleClose();
  // };




const handleSubmit = async () => {
  // 1) client-side validation
  if (!paymentData.amount || !paymentData.paymentDate || !paymentData.paymentMode) {
    toast({
      title: 'Error',
      description: 'Please fill in all required fields.',
      variant: 'destructive',
    });
    return;
  }

  // 2) build your FormData
  const formData = new FormData();         // ← declare here
  formData.append('invoice_id', invoice.id);
  formData.append('project_id', invoice.project_id);
  formData.append('payment_date', paymentData.paymentDate);
  formData.append('amount', paymentData.amount);
  formData.append('payment_mode', paymentData.paymentMode);
  formData.append('payment_proof', paymentData.hasProof ? 1 : 0);
  if (paymentData.hasProof && paymentData.screenshot) {
    formData.append('payment_file', paymentData.screenshot);
  }


  try {
    // 3) send via your helper
    const res = await create_payment(formData);

    if (res.data.status) {
      toast({
        title: 'Success',
        description: `₹${paymentData.amount.toLocaleString()} added to invoice ${invoice.invoiceNumber} ✅`,
      });
      handleClose();

      // 4) optionally refresh the invoice details
      // const fresh = await list_invoice_id(invoice.id);
      // setInvoice(fresh.data.invoice);
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    console.error(err);
    toast({
      title: 'Upload Failed',
      description: err.response?.data?.message || err.message,
      variant: 'destructive',
    });
  }
};

 

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment - Step {currentStep} of 3</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full ${
                  step <= currentStep ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Payment Summary */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice:</span>
                  <span className="font-medium">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Invoice:</span>
                  <span className="font-medium">₹{invoice.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Advance Paid:</span>
                  <span className="font-medium text-green-600">₹{invoice.advancePaid?.toLocaleString()}</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance:</span>
                  <span className="font-bold text-lg text-red-600">₹{invoice.balance?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment Entry */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Details</h3>
              
              <div>
                <Label htmlFor="amount">Amount Being Paid Now *</Label>
                <Input
                  type="number"
                  min="1"
                  max={invoice.balance}
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: parseFloat(e.target.value) || 0})}
                  placeholder="Enter amount"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum: ₹{invoice.balance?.toLocaleString()}
                </p>
              </div>

              <div>
                <Label htmlFor="paymentDate">Payment Date *</Label>
                <Input
                  type="date"
                  value={paymentData.paymentDate}
                  onChange={(e) => setPaymentData({...paymentData, paymentDate: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="paymentMode">Payment Mode *</Label>
                <Select value={paymentData.paymentMode} onValueChange={(value) => setPaymentData({...paymentData, paymentMode: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Do you have payment proof?</Label>
                <div className="flex space-x-4 mt-2">
                  <Button
                    type="button"
                    variant={paymentData.hasProof ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPaymentData({...paymentData, hasProof: true})}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={!paymentData.hasProof ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPaymentData({...paymentData, hasProof: false})}
                  >
                    No
                  </Button>
                </div>
              </div>

              {paymentData.hasProof && (
                <div>
                  <Label htmlFor="screenshot">Upload Screenshot</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPaymentData({...paymentData, screenshot: e.target.files[0]})}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Confirm Payment</h3>
              
              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-green-700">Payment Ready to Process</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{paymentData.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{paymentData.paymentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mode:</span>
                  <span className="font-medium">{paymentData.paymentMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Proof:</span>
                  <span className="font-medium">{paymentData.hasProof ? 'Yes' : 'No'}</span>
                </div>
                
                <hr className="my-2" />
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining Balance:</span>
                  <span className="font-bold">₹{(invoice.balance - paymentData.amount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? handleClose : handlePrevious}
            >
              {currentStep === 1 ? 'Cancel' : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </>
              )}
            </Button>

            {currentStep === 3 ? (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Confirm Payment
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentModal;
