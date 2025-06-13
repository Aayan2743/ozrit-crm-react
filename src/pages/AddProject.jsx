
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

  //  import { FileText, ExternalLink } from "lucide-react"; // Optional icons
import { 
  Briefcase, 
  Users, 
  DollarSign, 
  CheckCircle,
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Globe,
  Server,
  Palette,
  Calendar,
  Upload,
  UserCheck,
  CreditCard,
  X,
  FileText,
  ExternalLink
} from "lucide-react";

import { list_customers,add_project,get_all_salesTeam } from "../api/api";

const AddProject = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [attachmentss, setAttachmentss] = useState([]);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [paymentScreenshots, setPaymentScreenshots] = useState([]);
  const [salesAgents, setsalesAgents] = useState([]);

  const [formData, setFormData] = useState({
    customerId: "",
    projectTitle: "",
    services: [],
    totalPrice: "",
    orderSource: "",
    salesAgent: "",
    domainName: "",
    domainOwnership: "",
    hostingType: "",
    hasLogo: "",
    logoType: "",
    logoCost: "",
    contactDetails: "",
    deadline: "",
    assignedTo: [],
    attachments: [],
    notes: "",
    advancePaid: "",
    balanceRemaining: "",
    paymentMode: "",
    paymentScreenshot: null
  });

  const steps = [
    { id: 1, title: "Basic Info", icon: Briefcase },
    { id: 2, title: "Requirements", icon: Globe },
    { id: 3, title: "Team & Files", icon: Users },
    { id: 4, title: "Payment", icon: DollarSign }
  ];

  const serviceOptions = [
    "Website Design", "Logo Design", "SEO", "Social Media Marketing", 
    "E-commerce", "Mobile App", "Branding", "Content Writing"
  ];

  const orderSources = [
    "Website", "Referral", "Instagram", "Facebook", "Google Ads", "Direct Contact"
  ];

  const staffMembers = [
    "John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "Alex Brown"
  ];

  const progress = (currentStep / steps.length) * 100;

  const list_customer_data=async()=>{

      const customer_data=await list_customers();
      console.log(customer_data.data.data);
      return customer_data.data.data;

  }


  useEffect(() => {
   
    const fetchdata=async()=>{
        const data = await list_customer_data();
        console.log("Fetched Customer Data:", data);
        setCustomers(data);
    };
    
    fetchdata();
   
  
  }, []);

  
  useEffect(()=>{

    const fetch_sales_staff=async()=>{
      const data=await get_all_salesTeam();
      console.log("ssss",data.data.data);
      setsalesAgents(data.data.data)
    }
    fetch_sales_staff();

  },[])
  





const handleInputChange = (field, value) => {
  setFormData(prev => {
    const updatedFormData = { ...prev, [field]: value };
    console.log(updatedFormData);

    const totalPrice = parseFloat(updatedFormData.totalPrice) || 0;
    const advancePaid = parseFloat(updatedFormData.advancePaid) || 0;

    // ✅ Only add logoCost if hasLogo === "no" AND logoType !== "free"
    const logoCost =
      updatedFormData.hasLogo === "no" && updatedFormData.logoType !== "free"
        ? parseFloat(updatedFormData.logoCost) || 0
        : 0;

    if (
      field === "advancePaid" ||
      field === "totalPrice" ||
      field === "logoCost" ||
      field === "hasLogo" ||
      field === "logoType"
    ) {
      const balance = totalPrice - advancePaid + logoCost;
      updatedFormData.balanceRemaining = balance.toString();
    }

    return updatedFormData;
  });
};

const handleScreenshotUpload = (e) => {
   const files = Array.from(e.target.files);
   const images = files
    .filter((file) => file.type.startsWith("image/"))
    .map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

  setPaymentScreenshots((prev) => [...prev, ...images]);

};

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleFileUpload1 = (e) => {


     const files = Array.from(e.target.files).filter(
    (file) => file.type === "application/pdf"
  );

  const previews = files.map((file) => ({
    file,
    preview: URL.createObjectURL(file),
  }));

  setAttachmentss(previews);

  // Optional: also set to formData
  setFormData((prev) => ({ ...prev, attachments: files }));


};

const handleFileUpload = (e) => {
  const files = Array.from(e.target.files).filter(f => f.type === "application/pdf");

  console.log("dsfsdfsdfsdfsdf",files.map(file => ({ file, preview: URL.createObjectURL(file) })));
setAttachmentss(files.map(file => ({ file, preview: URL.createObjectURL(file) })));


 

  // setAttachments(previews);

   setFormData((prev) => ({
    ...prev,
    attachments: files,
  }));
};

  const handleStaffToggle = (staff) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(staff)
        ? prev.assignedTo.filter(s => s !== staff)
        : [...prev.assignedTo, staff]
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.customerId) {
          toast.error("Please select a customer!");
          return false;
        }
        if (!formData.projectTitle.trim()) {
          toast.error("Please enter project title!");
          return false;
        }
        if (formData.services.length === 0) {
          toast.error("Please select at least one service!");
          return false;
        }
        if (!formData.totalPrice) {
          toast.error("Please enter total project price!");
          return false;
        }
        return true;
      case 2:
        if (!formData.domainName.trim()) {
          toast.error("Please enter domain name!");
          return false;
        }
        if (!formData.domainOwnership) {
          toast.error("Please specify domain ownership!");
          return false;
        }
        if (!formData.hostingType) {
          toast.error("Please specify hosting type!");
          return false;
        }
        if (!formData.hasLogo) {
          toast.error("Please specify logo availability!");
          return false;
        }
        if (!formData.deadline) {
          toast.error("Please select a deadline!");
          return false;
        }
        return true;
      case 3:
        if (formData.assignedTo.length === 0) {
          toast.error("Please assign at least one team member!");
          return false;
        }
        return true;
      case 4:
        if (!formData.advancePaid) {
          toast.error("Please enter advance amount!");
          return false;
        }
        if (!formData.paymentMode) {
          toast.error("Please select payment mode!");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  if (currentStep !== steps.length) {
    toast.error("Please complete all steps!");
    return;
  }
  if (!validateCurrentStep()) return;

  // Build multipart FormData
  const payload = new FormData();
  payload.append("customerId", formData.customerId);
  payload.append("projectTitle", formData.projectTitle);
  payload.append("totalPrice", formData.totalPrice);
  payload.append("orderSource", formData.orderSource || "");
  payload.append("salesAgent", formData.salesAgent || "");
  payload.append("domainName", formData.domainName);
  payload.append("domainOwnership", formData.domainOwnership);
  payload.append("hostingType", formData.hostingType);
  payload.append("hasLogo", formData.hasLogo);
  payload.append("logoType", formData.logoType || "");
  payload.append("logoCost", formData.logoCost || "");
  payload.append("contactDetails", formData.contactDetails || "");
  payload.append("deadline", formData.deadline);
  payload.append("notes", formData.notes || "");
  payload.append("advancePaid", formData.advancePaid);
  payload.append("balanceRemaining", formData.balanceRemaining);
  payload.append("paymentMode", formData.paymentMode || "");

  // Append services one by one as services[]
  formData.services.forEach((svc) => {
    payload.append("services[]", svc);
  });

  // Append assignedTo one by one as assignedTo[]
  formData.assignedTo.forEach((staff) => {
    payload.append("assignedTo[]", staff);
  });

  // Append each PDF as attachments[]

  attachmentss.forEach((item) => {
  const f = item.file;

  // 1) First, ensure it's actually a File
  if (!(f instanceof File)) {
    console.warn("Skipping: not a File instance", f);
    return;
  }

  // 2) Check its MIME‐type
  if (f.type === "application/pdf") {
    // ✔ It’s a PDF, so append it
    payload.append("attachmentsx[]", f);
  } else {
    console.warn(`Skipping "${f.name}": not a PDF (type=${f.type})`);
  }
});



  // Append each image as paymentScreenshots[]
  paymentScreenshots.forEach((item) => {
    payload.append("paymentScreenshots[]", item.file);
  });

  // Debug: print out FormData so you can confirm keys/values

  for (let [key, value] of payload.entries()) {
  if (value instanceof File) {
    console.log(
      `Field: ${key}\n` +
      `  → type: File\n` +
      `  → filename: ${value.name}\n` +
      `  → mime-type: ${value.type}\n` +
      `  → size: ${value.size} bytes\n`
    );
  } else {
    // FormData coerces non‐File values to strings
    console.log(
      `Field: ${key}\n` +
      `  → type: ${typeof value}\n` +
      `  → value: ${value}\n`
    );
  }
}

  try {
    // If using Axios, simply do: add_project(payload)
    const response = await add_project(payload);
    console.log("response",response.status);
    if (!response.data.status) {
      toast.error(response.data.message, { duration: 2000 });
    } else {
      toast.success(response.data.message, { duration: 2000 });
      navigate('/list-projects')
      // navigate("/dashboard") after a delay if desired
    }
  } catch (err) {
    console.error("Error uploading project:", err);
    toast.error("Something went wrong while submitting.", { duration: 3000 });
  }
};


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Briefcase className="h-16 w-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Project Basics</h3>
              <p className="text-gray-600">Let's start with the fundamentals</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer" className="text-gray-700 font-medium">
                  Select Customer *
                </Label>
                <Select value={formData.customerId} onValueChange={(value) => handleInputChange("customerId", value)}>
                  <SelectTrigger className="mt-1 h-12 border-gray-200 focus:border-purple-500">
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.fullName} - {customer.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="projectTitle" className="text-gray-700 font-medium">
                  Project Title *
                </Label>
                <Input
                  id="projectTitle"
                  type="text"
                  placeholder="e.g., Sai Garments Website"
                  value={formData.projectTitle}
                  onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                  className="mt-1 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Services Bought *</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {serviceOptions.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={formData.services.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                      />
                      <Label htmlFor={service} className="text-sm">{service}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalPrice" className="text-gray-700 font-medium">
                    Total Price *
                  </Label>
                  <Input
                    id="totalPrice"
                    type="number"
                    placeholder="₹50,000"
                    value={formData.totalPrice}
                    onChange={(e) => handleInputChange("totalPrice", e.target.value)}
                    className="mt-1 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="orderSource" className="text-gray-700 font-medium">
                    Order Source
                  </Label>
                  <Select value={formData.orderSource} onValueChange={(value) => handleInputChange("orderSource", value)}>
                    <SelectTrigger className="mt-1 h-12 border-gray-200 focus:border-purple-500">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderSources.map((source) => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="salesAgent" className="text-gray-700 font-medium">
                  Sales Agent
                </Label>
                <Select value={formData.salesAgent} onValueChange={(value) => handleInputChange("salesAgent", value)}>
                      <SelectTrigger className="mt-1 h-12 border-gray-200 focus:border-purple-500">
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {salesAgents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.name}>{agent.name}</SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Project Requirements</h3>
              <p className="text-gray-600">Technical specifications and assets</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="domainName" className="text-gray-700 font-medium">
                  Domain Name *
                </Label>
                <Input
                  id="domainName"
                  type="text"
                  placeholder="www.example.com"
                  value={formData.domainName}
                  onChange={(e) => handleInputChange("domainName", e.target.value)}
                  className="mt-1 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Domain Ownership *</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="clientHasDomain"
                      checked={formData.domainOwnership === "client"}
                      onCheckedChange={() => handleInputChange("domainOwnership", "client")}
                    />
                    <Label htmlFor="clientHasDomain">Client has it</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="needToRegister"
                      checked={formData.domainOwnership === "register"}
                      onCheckedChange={() => handleInputChange("domainOwnership", "register")}
                    />
                    <Label htmlFor="needToRegister">Need to register</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Hosting *</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="clientHasHosting"
                      checked={formData.hostingType === "client"}
                      onCheckedChange={() => handleInputChange("hostingType", "client")}
                    />
                    <Label htmlFor="clientHasHosting">Client has it</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="needToAssign"
                      checked={formData.hostingType === "assign"}
                      onCheckedChange={() => handleInputChange("hostingType", "assign")}
                    />
                    <Label htmlFor="needToAssign">Need to assign</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Does client have Logo? *</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasLogo"
                      checked={formData.hasLogo === "yes"}
                      onCheckedChange={() => handleInputChange("hasLogo", "yes")}
                    />
                    <Label htmlFor="hasLogo">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noLogo"
                      checked={formData.hasLogo === "no"}
                      onCheckedChange={() => handleInputChange("hasLogo", "no")}
                    />
                    <Label htmlFor="noLogo">No</Label>
                  </div>
                </div>

                {formData.hasLogo === "no" && (
                  <div className="mt-4 space-y-3">
                    <Label className="text-gray-700 font-medium">Logo Type</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="freeLogo"
                          checked={formData.logoType === "free"}
                          onCheckedChange={() => handleInputChange("logoType", "free")}
                        />
                        <Label htmlFor="freeLogo">Free</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="paidLogo"
                          checked={formData.logoType === "paid"}
                          onCheckedChange={() => handleInputChange("logoType", "paid")}
                        />
                        <Label htmlFor="paidLogo">Paid</Label>
                      </div>
                    </div>
                    {formData.logoType === "paid" && (
                      <Input
                        type="number"
                        placeholder="Logo Cost (₹)"
                        value={formData.logoCost}
                        onChange={(e) => handleInputChange("logoCost", e.target.value)}
                        className="mt-2 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="contactDetails" className="text-gray-700 font-medium">
                  Contact Details for Website
                </Label>
                <Textarea
                  id="contactDetails"
                  placeholder="Phone, email, address, etc."
                  value={formData.contactDetails}
                  onChange={(e) => handleInputChange("contactDetails", e.target.value)}
                  className="mt-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="deadline" className="text-gray-700 font-medium">
                  Deadline *
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange("deadline", e.target.value)}
                  className="mt-1 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Team & Attachments</h3>
              <p className="text-gray-600">Assign team and upload files</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-gray-700 font-medium">Assigned To *</Label>
                <div className="mt-2 space-y-2">
                  {/* {staffMembers.map((staff) => (
                    <div key={staff} className="flex items-center space-x-2">
                      <Checkbox
                        id={staff}
                        checked={formData.assignedTo.includes(staff)}
                        onCheckedChange={() => handleStaffToggle(staff)}
                      />
                      <Label htmlFor={staff} className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4" />
                        <span>{staff}</span>
                      </Label>
                    </div>
                  ))} */}


                   {salesAgents.map((staff) => (
                    <div key={staff.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={staff.id}
                        checked={formData.assignedTo.includes(staff.name)}
                        onCheckedChange={() => handleStaffToggle(staff.name)}
                      />
                      <Label htmlFor={staff.id} className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4" />
                        <span>{staff.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

             <div>
                    <Label htmlFor="attachments" className="text-gray-700 font-medium">
                      Upload Attachments
                    </Label>

                    {/* File Upload Input (hidden) */}
                    <input
                      type="file"
                      id="attachmentsx"
                      name="attachmentsx[]"
                      multiple
                        accept="application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {/* Clickable and Droppable Area */}
                    <label
                      htmlFor="attachmentsx"
                      className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer block"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Drag and drop files here or click to browse</p>
                      <p className="text-xs text-gray-400 mt-1">Logos, content, references, etc.</p>
                    </label>

                   
                

                {attachmentss.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Uploaded PDFs</h3>
                    <ul className="space-y-2">
                      {attachmentss.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded px-4 py-2 transition"
                        >
                          <div className="flex items-center gap-2 text-gray-700">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm truncate max-w-[200px]">{item.file.name}</span>
                          </div>
                          <button
                            type="button"
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => window.open(item.preview, "_blank")}
                          >
                            View <ExternalLink className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}


                  </div>


              <div>
                <Label htmlFor="notes" className="text-gray-700 font-medium">
                  Internal Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Team notes, special instructions, etc."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="mt-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <DollarSign className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Payment Information</h3>
              <p className="text-gray-600">Financial details and payment tracking</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="advancePaid" className="text-gray-700 font-medium">
                    Advance Paid *
                  </Label>
                  <Input
                    id="advancePaid"
                    type="number"
                    placeholder="₹25,000"
                    value={formData.advancePaid}
                    onChange={(e) => handleInputChange("advancePaid", e.target.value)}
                    className="mt-1 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="balanceRemaining" className="text-gray-700 font-medium">
                    Balance Remaining
                  </Label>
                  <Input
                    id="balanceRemaining"
                    type="number"
                    placeholder="Auto-calculated"
                    value={formData.balanceRemaining}
                    onChange={(e) => handleInputChange("balanceRemaining", e.target.value)}
                    className="mt-1 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Payment Mode *</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bankPayment"
                      checked={formData.paymentMode === "bank"}
                      onCheckedChange={() => handleInputChange("paymentMode", "bank")}
                    />
                    <Label htmlFor="bankPayment" className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Bank Transfer</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="upiPayment"
                      checked={formData.paymentMode === "upi"}
                      onCheckedChange={() => handleInputChange("paymentMode", "upi")}
                    />
                    <Label htmlFor="upiPayment" className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>UPI</span>
                    </Label>
                  </div>
                </div>
              </div>

              {/* <div>
                <Label htmlFor="paymentScreenshot" className="text-gray-700 font-medium">
                  Payment Screenshot
                </Label>
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Upload payment confirmation</p>
                </div>
              </div> */}


<div className="space-y-3">
  <Label htmlFor="paymentScreenshot" className="text-gray-700 font-medium">
    Payment Screenshot
  </Label>

  <label
    htmlFor="paymentScreenshot"
    className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition text-center"
  >
    <Upload className="h-8 w-8 text-gray-400 mb-2" />
    <p className="text-sm text-gray-500">Click or drag to upload payment confirmation</p>
    <p className="text-xs text-gray-400 mt-1">JPG, PNG (max 5MB)</p>
    <input
      type="file"
      id="paymentScreenshot"
      accept="image/*"
      multiple
      className="hidden"
      onChange={handleScreenshotUpload}
    />
  </label>

  {paymentScreenshots.length > 0 && (
    <div>
      <p className="text-sm text-gray-600 mb-2">Preview:</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {paymentScreenshots.map((item, index) => (
          <div key={index} className="relative border rounded overflow-hidden">
            <img
              src={item.url}
              alt={`Screenshot ${index + 1}`}
              className="object-cover w-full h-40"
            />
            <button
              onClick={() =>
                setPaymentScreenshots((prev) =>
                  prev.filter((_, i) => i !== index)
                )
              }
              className="absolute top-1 right-1 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
</div>






              {formData.totalPrice && formData.advancePaid && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Payment Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Project Value:</span>
                      <span className="font-medium">₹{formData.totalPrice}</span>
                    </div>
                   

                   {formData.hasLogo === "no" && formData.logoType !== "free" && (
                        <>
                          <div className="flex justify-between">
                            <span>Logo Amount :</span>
                            <span className="font-medium text-gray-800">
                              ₹{formData.logoCost}
                            </span>
                          </div>

                         <div className="flex justify-between">
                      <span>Advance Received:</span>
                      <span className="font-medium text-green-600">₹{formData.advancePaid}</span>
                    </div>


                          <div className="flex justify-between border-t pt-1">
                            <span>Balance Due :</span>
                            <span className="font-bold text-orange-600">
                              ₹{Number(formData.balanceRemaining)}
                            </span>
                          </div>
                        </>
                      )}


                      

                      {(formData.hasLogo === "yes" || formData.logoType === "free") && (
                            <>

                             <div className="flex justify-between">
                      <span>Advance Received:</span>
                      <span className="font-medium text-green-600">₹{formData.advancePaid}</span>
                    </div>


                              <div className="flex justify-between border-t pt-1">
                                <span>Balance Due :</span>
                                <span className="font-bold text-orange-600">
                                  ₹{Number(formData.balanceRemaining)}
                                </span>
                              </div>
                            </>
                          )}

                          
                  
                  </div>
                </div>
              )}
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
              <h1 className="text-3xl font-bold text-gray-800">Add New Project</h1>
            </div>
            <p className="text-gray-600">
              Create a new project and assign it to your team
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
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex items-center space-x-2 text-lg px-8 py-3"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>Create Project</span>
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Encouragement */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-lg rounded-full px-4 py-2 shadow-lg">
              <span className="text-2xl">🚀</span>
              <span className="text-sm font-medium text-gray-700">
                You're building something amazing! Keep going.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
