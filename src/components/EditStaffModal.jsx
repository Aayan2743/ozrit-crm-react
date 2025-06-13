
import { useEffect, useState } from "react";
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


import {create_staff} from '../api/api';
 import { useRef } from "react";

import {update_staff} from '../api/api';
// inside your component


const EditStaffModal = ({  staff,  onSave, isOpen, onClose }) => {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const docInputRef=useRef(null);


console.log("aaaaaaaa",staff);


  const [formData, setFormData] = useState({
    id:"",
    fullName: "",
    email: "",
    mobileNumbers: "",
    employeeId: "",
    role: "",
    department: "",
    joiningDate: null,
    shiftStart: "",
    shiftEnd: "",
    notes: "",
    // profilePicture: null,
    // profilePreview: null,  
    // documents: []
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        id:staff.id || "",
        fullName: staff.name || "",
        email: staff.email || "",
        mobileNumbers: staff.contact || "",
        employeeId: staff.employeeId || "",
        role: staff.role || "",
        department: staff.department || "",
        joiningDate: staff.joiningDate || null,
        shiftStart: staff.shiftStart || "",
        shiftEnd: staff.shiftEnd || "",
        notes: staff.notes || "",
      });
    }
  }, [staff]);


  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
      // revoke old preview if any
      if (formData.profilePreview) {
        URL.revokeObjectURL(formData.profilePreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        profilePicture: file,
        profilePreview: previewUrl
      }));
    } else if (type === "document") {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, file]
      }));
    }
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (formData.profilePreview) {
        URL.revokeObjectURL(formData.profilePreview);
      }
    };
  }, [formData.profilePreview]);

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

  
    const add_staff=async()=>{
          const add_new_staff= await update_staff(formData);
      
          console.log("add staff",add_new_staff);

         
          if(add_new_staff.data.status==false){
              toast({
                  title: "Error",
                  description:add_new_staff.data.message ,
                });
          }else{
                toast({
                 title: "Success",
                description: add_new_staff.data.message,
               });

                setFormData({
                  fullName: "",
                  email: "",
                  mobileNumbers: "",
                  employeeId: "",
                  role: "",
                  department: "",
                  joiningDate: null,
                  shiftStart: "",
                  shiftEnd: "",
                  notes: "",
                  // profilePicture: null,
                  //  profilePreview: null,  
                  // documents: []
                });
                
                 onSave();  
                onClose();

          }
    }

  add_staff();
   


    

    
    // Reset form
    
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
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
              <Label>Mobile Number</Label>

                <Input
                  id="phone"
                  type="mobile"
                  value={formData.mobileNumbers}
                  onChange={(e) => handleInputChange("mobileNumbers", e.target.value)}
                  required
                />

              
             
            </div>

            {/* Profile Picture */}
           
    

{/* <div>
  <Label>Profile Picture</Label>
  <div className="mt-2">
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={(e) => handleFileUpload("profile", e.target.files[0])}
      className="hidden"
    />
    <Button
      type="button"
      variant="outline"
      className="cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
    >
      <Upload className="h-4 w-4 mr-2" />
      Upload Picture
    </Button>
      {formData.profilePreview && (
        <div className="mt-2">
          <img
            src={formData.profilePreview}
            alt="Profile Preview"
            className="h-24 w-24 object-cover rounded-full"
          />
        </div>
)}

  </div>
</div> */}


         
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
                    <SelectItem value="UI/UX">UI/UX</SelectItem>
                    <SelectItem value="Wordpress">Wordpress</SelectItem>
                    <SelectItem value="DigitalMarketing">Digital Marketing</SelectItem>
                    <SelectItem value="FrontEnd">Front end</SelectItem>
                    <SelectItem value="BackEnd">BackEnd</SelectItem>
                    <SelectItem value="AppDevelopment">App Development</SelectItem>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="HrAdmin">Hr Admin</SelectItem>
                    <SelectItem value="HrAccounts">Hr Accounts</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
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
                      {formData.joiningDate ? format(formData.joiningDate, "yyyy-MM-dd") : "Pick a date"}
                     
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.joiningDate}
                      onSelect={(date) =>{
                         const onlyDate = date.toISOString().split("T")[0];
                       handleInputChange("joiningDate", onlyDate);
                      }
                      }
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
          {/* <div className="space-y-4">
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
          </div> */}


           {/* <div className="space-y-4">
      <h3 className="text-lg font-semibold">Documents</h3>

      <div>
        <Label>Upload Documents (Aadhar, Resume, etc.)</Label>
        <div className="mt-2">
          <input
            ref={docInputRef}
            type="file"
            multiple
            onChange={(e) => {
              Array.from(e.target.files).forEach(file =>
                handleFileUpload("document", file)
              );
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
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <span className="text-sm">{doc.name}</span>
                 
                  <a
                    href={formData.documentPreviews[index]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-500 text-sm underline"
                  >
                    View
                  </a>
                </div>
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
        </div> */}

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
              Edit Staff Member 
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffModal;
