
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, X, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const AddStaffModal = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumbers: [""],
    employeeId: "",
    role: "",
    department: "",
    joiningDate: null,
    shiftStart: "",
    shiftEnd: "",
    notes: "",
    profilePicture: null,
    documents: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMobileNumberChange = (index, value) => {
    const newMobileNumbers = [...formData.mobileNumbers];
    newMobileNumbers[index] = value;
    setFormData(prev => ({
      ...prev,
      mobileNumbers: newMobileNumbers
    }));
  };

  const addMobileNumber = () => {
    setFormData(prev => ({
      ...prev,
      mobileNumbers: [...prev.mobileNumbers, ""]
    }));
  };

  const removeMobileNumber = (index) => {
    if (formData.mobileNumbers.length > 1) {
      const newMobileNumbers = formData.mobileNumbers.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        mobileNumbers: newMobileNumbers
      }));
    }
  };

  const handleFileUpload = (type, file) => {
    if (type === "profile") {
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
    } else if (type === "document") {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, file]
      }));
    }
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const generateEmployeeId = () => {
    const id = "EMP" + String(Date.now()).slice(-6);
    setFormData(prev => ({
      ...prev,
      employeeId: id
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Staff data:", formData);
    
    toast({
      title: "Success",
      description: "Staff member added successfully!",
    });
    
    // Reset form
    setFormData({
      fullName: "",
      email: "",
      mobileNumbers: [""],
      employeeId: "",
      role: "",
      department: "",
      joiningDate: null,
      shiftStart: "",
      shiftEnd: "",
      notes: "",
      profilePicture: null,
      documents: []
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Mobile Numbers */}
            <div>
              <Label>Mobile Numbers</Label>
              {formData.mobileNumbers.map((mobile, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={mobile}
                    onChange={(e) => handleMobileNumberChange(index, e.target.value)}
                    placeholder="Enter mobile number"
                  />
                  {formData.mobileNumbers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMobileNumber(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMobileNumber}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Another Number
              </Button>
            </div>

            {/* Profile Picture */}
            <div>
              <Label>Profile Picture</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload("profile", e.target.files[0])}
                  className="hidden"
                  id="profilePicture"
                />
                <label htmlFor="profilePicture">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Picture
                  </Button>
                </label>
                {formData.profilePicture && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {formData.profilePicture.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Job Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange("employeeId", e.target.value)}
                    placeholder="Auto-generate or enter manually"
                  />
                  <Button type="button" variant="outline" onClick={generateEmployeeId}>
                    Generate
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="role">Role/Position *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Joining Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.joiningDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.joiningDate ? format(formData.joiningDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.joiningDate}
                      onSelect={(date) => handleInputChange("joiningDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Shift Timings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shiftStart">Shift Start Time</Label>
                <Input
                  id="shiftStart"
                  type="time"
                  value={formData.shiftStart}
                  onChange={(e) => handleInputChange("shiftStart", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="shiftEnd">Shift End Time</Label>
                <Input
                  id="shiftEnd"
                  type="time"
                  value={formData.shiftEnd}
                  onChange={(e) => handleInputChange("shiftEnd", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Documents</h3>
            
            <div>
              <Label>Upload Documents (Aadhar, Resume, etc.)</Label>
              <div className="mt-2">
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    Array.from(e.target.files).forEach(file => {
                      handleFileUpload("document", file);
                    });
                  }}
                  className="hidden"
                  id="documents"
                />
                <label htmlFor="documents">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                </label>
              </div>
              
              {formData.documents.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{doc.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional notes about the employee..."
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600">
              Add Staff Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffModal;
