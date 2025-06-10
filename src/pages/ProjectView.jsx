import { useState,useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {list_project,update_stage,update_hosting_stage,update_stage_update,update_document,delete_document} from '../api/api';
import { useRef } from 'react';
import Swal from "sweetalert2";
import { 
  ArrowLeft,
  Edit,
  Upload,
  CheckCircle,
  Clock,
  User,
  Globe,
  Server,
  Palette,
  CreditCard,
  FileText,
  Calendar,
  Download,
  Trash2,
  ExternalLink,
  Target,
  Users,
  DollarSign,
  Activity,
  CheckSquare,
  Lock,
  Check,
  Paperclip,
  Eye,
  RefreshCw
} from "lucide-react";


import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";


const ProjectView = () => {
   const { id } = useParams();

       const inputRef = useRef();
const [modalOpen, setModalOpen]       = useState(false);
const [modalOpen2, setModalOpen2]       = useState(false);
const [activeDoc, setActiveDoc]       = useState(null); 
const [modalOpen1, setModalOpen1]       = useState(false);
const [activeDoc1, setActiveDoc1]       = useState(null); 
const [previewUrl, setPreviewUrl] = useState(null);
const [fileName, setFileName] = useState('');
const [activeTab, setActiveTab] = useState("overview");
const [modalOpenForAccepatance, setModalOpenForAccepatance] = useState(false);
const [notes, setNotes]       = useState(); 
const [filenamenotes, setfilenamenotes]       = useState(); 
const [pdfFile, setPdfFile] = useState(null);
const [pdfUrl, setPdfUrl] = useState(null);
const [error, setError] = useState(null);
const [selectedFile, setSelectedFile] = useState(null);
  
    const [fordata, setforData] = useState("");
     const [doc_notes,setDocumentNotes]=useState(null);

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}







  async function fetchProject(id) {
  try {
    const response = await list_project(id);
    const proj = response.data.data;

       console.log("🔥 list_project response:", response);


    // Parse the JSON‐encoded "assignedTo" field into a real array
    let assignedArr = [];
    try {
      assignedArr = JSON.parse(proj.assignedTo);
    } catch {
      assignedArr = [];
    }

    // If you have other stringified arrays (e.g. services), parse them similarly:
    let servicesArr = [];
    try {
      servicesArr = JSON.parse(proj.services);
    } catch {
      servicesArr = [];
    }


     const stagesObj = {
      domain: proj.domain,
      hosting: proj.hosting,
      design: proj.design,
      madeLive: proj.madeLive,
      balanceAsked: proj.balanceAsked,
    };


    // Build the final project object
    setProject({
      ...proj,
      assignedTo: assignedArr,
      services: servicesArr,
      stages: stagesObj,
      // …include any other parsed fields here
    });
  } catch (err) {
    console.error("Fetch error:", err);
    toast.error("Failed to fetch project. Please try again.");
  }
}

 const [project, setProject] = useState({
    id: id || "1",
    name: "Sai Garments Website",
    customer: {
      name: "Sai Garments Ltd",
      email: "contact@saigarments.com",
      phone: "+91 98765 43210"
    },
    status: "In Progress",
    deadline: "2024-07-15",
    totalPrice: 45000,
    advancePaid: 25000,
    balanceRemaining: 20000,
    balanceAsked: false,
    services: ["Website Design", "SEO Setup", "Logo Design"],
    domain: {
      name: "saigarments.com",
      owner: "Client has it"
    },
    hosting: {
      status: "Need to assign"
    },
    logo: {
      status: "Designed",
      type: "Paid",
      cost: 5000
    },
    contactInfo: "Sai Garments, 123 Fashion Street, Mumbai - 400001",
    notes: "Premium e-commerce website with custom design and mobile responsiveness.",
    team: [
      { id: 1, name: "Raj Patel", role: "Designer", avatar: "RP" },
      { id: 2, name: "Priya Shah", role: "Developer", avatar: "PS" },
      { id: 3, name: "Amit Kumar", role: "SEO Specialist", avatar: "AK" }
    ],
    stages: {
      domain: "Booked",
      hosting: "Pending",
      design: "In Progress",
      madeLive: "No",
      balanceAsked: "No"
    },
    attachments: [
      { name: "logo-design.png", type: "image", size: "2.4 MB", date: "2024-06-01" },
      { name: "content-doc.pdf", type: "pdf", size: "1.8 MB", date: "2024-06-03" },
      { name: "references.zip", type: "archive", size: "15.2 MB", date: "2024-06-05" }
    ],
    activity: [
      { action: "Stage updated: Design → In Progress", user: "Priya Shah", time: "2 hours ago" },
      { action: "File uploaded: logo-design.png", user: "Raj Patel", time: "1 day ago" },
      { action: "Project created", user: "Agency Owner", time: "3 days ago" }
    ],
    // New documents section
    documents: {
      engagementForm: {
        status: "Received",
        sentOn: "2024-06-01",
        receivedOn: "2024-06-03",
        fileName: "engagement-form-signed.pdf",
        fileSize: "1.2 MB",
        notes: "Signed and received on time"
      },
      acceptanceForm: {
        status: "Pending",
        sentOn: "2024-06-10",
        receivedOn: null,
        fileName: null,
        fileSize: null,
        notes: ""
      }
    }
  });

    const [date, setDate] = useState(project.sent_on);
 const handleSubmit = async () => {
    if (!pdfFile) return;

    const formData = new FormData();
    formData.append('file', pdfFile);

    try {
      // Replace with your API endpoint
      const response = await fetch('/your-api-endpoint', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        alert('File uploaded successfully');
      } else {
        setError('Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    }
  };

  
    
useEffect(() => {
  if (!id) return;
  fetchProject(id);
}, [id]);



 




  
  const stageDefinitions = [
    {
      key: "domain",
      label: "Domain Setup",
      icon: Globe,
      options: ["Pending", "Booked"],
      completedValues: ["Booked"]
    },
    {
      key: "hosting",
      label: "Hosting Assignment",
      icon: Server,
      options: ["Pending", "Assigned"],
      completedValues: ["Assigned"]
    },
    {
      key: "design",
      label: "Design & Development",
      icon: Palette,
      options: ["Not Started", "In Progress", "Client Changes", "Done"],
      completedValues: ["Done"]
    },
    {
      key: "madeLive",
      label: "Made Live",
      icon: ExternalLink,
      options: ["No", "Yes"],
      completedValues: ["Yes"]
    },
    {
      key: "balanceAsked",
      label: "Balance Payment Asked",
      icon: CreditCard,
      options: ["No", "Yes"],
      completedValues: ["Yes"]
    }
  ];

    const isStageCompleted = (stageIndex) => {
    const stageDef = stageDefinitions[stageIndex];
    const currentValue = project?.[stageDef.key];
    return stageDef.completedValues.includes(currentValue);
  };

 
  const isStageUnlocked = (stageIndex) => {
    if (stageIndex === 0) return true;
    return isStageCompleted(stageIndex - 1);
  };


  const getCurrentStage = () => {
    for (let i = 0; i < stageDefinitions.length; i++) {
      if (!isStageCompleted(i)) return i;
    }
    return stageDefinitions.length - 1; // All completed
  };

 
  const getOverallProgress = () => {
    const completedStages = stageDefinitions.filter((_, index) => isStageCompleted(index)).length;
    return Math.round((completedStages / stageDefinitions.length) * 100);
  };



  const updateStage = async (stageKey, newValue) => {
  if (!project) return;
  const projectId = project.id;

  // 1) Optimistically update local state
  setProject(prev => ({
    ...prev,
    stages: {
      ...prev.stages,
      [stageKey]: newValue,
    },
  }));

  // 2) Send PUT to backend
  try {
    await update_stage_update({ id: projectId, [stageKey]: newValue });
    // (Optional) if you want to re‐fetch from server:
        await fetchProject(projectId);
  } catch (err) {
    console.error(`Failed to update ${stageKey}:`, err);
    // Roll back on error
    setProject(prev => ({
      ...prev,
      stages: {
        ...prev.stages,
        [stageKey]: project.stages[stageKey], // restore old value
      },
    }));
  }
};

 const updateStage_hosting = async (stageKey, newValue) => {
  if (!project) return;
  const projectId = project.id;

  // 1) Optimistically update local state
  setProject(prev => ({
    ...prev,
    stages: {
      ...prev.stages,
      [stageKey]: newValue,
    },
  }));

  // 2) Send PUT to backend
  try {
    await update_hosting_stage({ id: projectId, [stageKey]: newValue });
    // (Optional) if you want to re‐fetch from server:
        await fetchProject(projectId);
  } catch (err) {
    console.error(`Failed to update ${stageKey}:`, err);
    // Roll back on error
    setProject(prev => ({
      ...prev,
      stages: {
        ...prev.stages,
        [stageKey]: project.stages[stageKey], // restore old value
      },
    }));
  }
};




 const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-500";
    case "in progress":
      return "bg-blue-500";
    case "pending":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

  const getStageStatus = (stage) => {
    switch (stage.toLowerCase()) {
      case "Booked":
      case "Pending":
      case "Done":
      case "Not Started":
      case "Client Changes":
      case "Yes": return "text-green-600 bg-green-50";
      case "In Progress": return "text-blue-600 bg-blue-50";
      case "Assigned":
      case "No": return "text-yellow-600 bg-yellow-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };




  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    // Check if file exists and is a PDF
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError(null);
      
      // Create a URL for preview
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
    } else {
      setError('Please select a valid PDF file');
      setPdfFile(null);
      setPdfUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Document management functions
  const updateDocumentStatus = (docType, status) => {
    setProject(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: {
          ...prev.documents[docType],
          status,
          receivedOn: status === "Received" ? new Date().toISOString().split('T')[0] : null
        }
      }
    }));
  };

  const downloadFile=(filepath)=>{
   console.log(filepath);

 const link = document.createElement('a');
   

   link.href = filepath;
   link.target = '_blank';

   const fileName = filepath.split('/').pop() || 'downloaded-file';
   link.download = fileName; 
   

   document.body.appendChild(link);
   

   link.click();
   
   
   document.body.removeChild(link);

  }

  const deleteFile=async(id)=>{

      // const respo=await delete_document(id);
      // console(respo);


    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    // Proceed only if user confirms
    if (result.isConfirmed) {
        try {
            const respo = await delete_document(id);
            console.log(respo);

            // Show success message
            await Swal.fire({
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                icon: 'success',
                confirmButtonColor: '#3085d6'
            });
           window.location.reload(true);
          
        } catch (error) {
            // Show error message
            await Swal.fire({
                title: 'Error!',
                text: 'Failed to delete the file.',
                icon: 'error',
                confirmButtonColor: '#3085d6'
            });
        }
    }

  }


  const handleElements=async ()=>{

    console.log("gdfkgjfgjhjklgjhjfg ----");
      console.log("project id",project.id);

    console.log("previre", typeof previewUrl);
    console.log("file name",typeof fileName);
    console.log("date name",typeof date);
    console.log("doc_notes ",typeof doc_notes);
    console.log("setSelectedFile ",typeof selectedFile);
    console.log("forpurpose ", fordata);

     const formData = new FormData();
  // If you stored the real File object in state (e.g. selectedFile), use that:
  if (previewUrl) {
    formData.append("document", previewUrl);
  }
  // Otherwise you could re-fetch it from your previewUrl, but best is to keep the File..
const today = new Date();
const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
// formData.append('sentOn', formattedDate);


  formData.append("sentOn", date ?? formattedDate);
  formData.append("notes", doc_notes ?? "");
  formData.append("id",   project.id);
  formData.append("file",   selectedFile);
  formData.append("forpurpose",   fordata || 'General Documents');
  //  formData.append('forpurpose', forPurpose || 'General Documents');
  // formData.append("doc_type",   "Engagement Form");
     formData.append('doc_type', fordata ? 'Engagement Form' : 'General Documents');


 
  try {
    // 2) Call your API helper — adjust signature as needed
    const response = await update_document(
    
      formData
    );
    console.log("✅ update_document response:", response.data);

    // 3) (Optionally) refresh your project object so UI stays in sync
    await fetchProject(project.id);
  } catch (err) {
    console.error("❌ update_document failed:", err);
  }



  }

    const handleAcceptanceElements=async ()=>{

    console.log("gdfkgjfgjhjklgjhjfg ----");
      console.log("project id",project.id);

    console.log("previre", typeof previewUrl);
    console.log("file name",typeof fileName);
    console.log("date name",typeof date);
    console.log("doc_notes ",typeof doc_notes);
    console.log("setSelectedFile ",typeof selectedFile);
    console.log("forpurpose ", fordata);

     const formData = new FormData();
  // If you stored the real File object in state (e.g. selectedFile), use that:
  if (previewUrl) {
    formData.append("document", previewUrl);
  }
  // Otherwise you could re-fetch it from your previewUrl, but best is to keep the File
  formData.append("sentOn", date ?? "");
  formData.append("notes", doc_notes ?? "");
  formData.append("id",   project.id);
  formData.append("file",   selectedFile);
  formData.append("forpurpose",   fordata);
    formData.append("doc_type",   "Acceptance Form");


 
  try {
    // 2) Call your API helper — adjust signature as needed
    const response = await update_document(
    
      formData
    );
    console.log("✅ update_document response:", response.data);

    // 3) (Optionally) refresh your project object so UI stays in sync
    await fetchProject(project.id);
  } catch (err) {
    console.error("❌ update_document failed:", err);
  }



  }



  const updateDocumentNotes = (docType, notes) => {
setDocumentNotes(notes);


  };

  const handleFileUpload = (docType, file) => {
  
  };

  const daysUntilDeadline = Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24));





  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    handleFileUpload('engagementForm', file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFileName(file.name);
    e.target.value = null;
  };




  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Sidebar />
      
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-800">{project.projectTitle}</h1>
                <div className="flex items-center space-x-4">
                  <Badge className={`${getStatusColor(project.status)} text-white`}>
                    {project.status}
                  </Badge>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className={daysUntilDeadline < 0 ? "text-red-600 font-semibold" : daysUntilDeadline < 7 ? "text-yellow-600" : ""}>
                      {daysUntilDeadline < 0 ? `${Math.abs(daysUntilDeadline)} days overdue` :
                       daysUntilDeadline === 0 ? "Due today" :
                       `${daysUntilDeadline} days left`}
                    </span>
                  </div>
                </div>
                
                {/* Overall Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                    <span className="text-sm font-bold text-purple-600">{project.overAllProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.overAllProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div className="flex -space-x-2">
                    {project.team.map((member) => (
                      <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                        <AvatarFallback className="text-xs bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div> */}


    <div>
  <h2 className="text-lg font-medium mb-2">Assigned To:</h2>
  <div className="flex space-x-2">
    {(project.assignedTo || []).map((fullName, idx) => (
      <span
        key={idx}
        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
      >
        {fullName}
      </span>
    ))}
  </div>
</div>


              </div>

              <div className="flex flex-wrap gap-2">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Add File
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {[
              { id: "overview", label: "Overview", icon: Target },
              { id: "stages", label: "Project Stages", icon: CheckSquare },
              { id: "documents", label: "Client Documents", icon: FileText },
              { id: "files", label: "Files & Activity", icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                    activeTab === tab.id 
                      ? "bg-purple-600 text-white" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span>Project Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Customer</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <Link to={`/customer/${project.customer.id}`} className="text-purple-600 hover:underline">
                          {project.customer.fullName}
                        </Link>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Domain</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span>{project.domainName}</span>
                        <Badge variant="secondary" className="text-xs">{project.domainOwnership == "client"
                              ? "Client has it"
                              : "Need to register"}</Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Hosting</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Server className="h-4 w-4 text-gray-400" />
                        {/* {getStageStatus(project.hosting.status)} */}
                        <Badge className="">
                          {project.hostingType == "client"
                              ? "Client has it"
                              : "Need to Assign"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Logo</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Palette className="h-4 w-4 text-gray-400" />
                        <span>{project.hasLogo =="No" ? "Designed" : "Client Has Logo"  }</span>
                        <Badge variant="outline" className="text-xs">
                          {project.logoType ? (
                                      <>
                                        {project.logoType} – ₹
                                        {project.logoCost != null
                                          ? project.logoCost.toLocaleString()
                                          : "0"}
                                      </>
                                    ) : (
                                      <em>Logo Not Required</em>
                                    )}

                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Services</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.services.map((service, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact Info for Website</label>
                    <p className="text-gray-800 mt-1 p-3 bg-gray-50 rounded-lg">{project.contactDetails}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Notes</label>
                    <p className="text-gray-800 mt-1 p-3 bg-gray-50 rounded-lg">{project.notes}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Assigned Team */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-500" />
                    <span>Assigned Team</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                 <div>
                    <h2 className="text-lg font-medium mb-2">Assigned To:</h2>
                    <div className="flex space-x-2">
                      {(project.assignedTo || []).map((fullName, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {fullName}
                        </span>
                      ))}
                    </div>
                  </div>
                    
               
                </CardContent>
              </Card>
            </div>

            {/* Payment Info */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Payment Info</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-100">Total Price</span>
                    <span className="font-bold text-xl">₹{project.totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-green-100">Logo Amount</span>
                    <span className="font-bold text-xl">
                      {project.logoCost != null
                        ? `₹${project.logoCost.toLocaleString()}`
                        : "—"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-green-100">Advance Paid</span>
                    <span className="font-bold text-lg">₹{project.advancePaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-100">Balance Remaining</span>
                    <span className="font-bold text-lg">₹{project.balanceRemaining.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-green-400">
                    <span className="text-green-100">Balance Asked</span>
                    <Badge className={project.balanceAsked =="Yes" ? "bg-white text-green-600" : "bg-yellow-500 text-white"}>
                      {project.balanceAsked }
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Live Site
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Request Payment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "stages" && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-purple-500" />
                <span>Project Stages Tracker</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Desktop: Horizontal Stepper */}
                <div className="hidden md:block">
                  <div className="flex items-center justify-between mb-8">
                    {stageDefinitions.map((stage, index) => {
                      const Icon = stage.icon;
                      const isCompleted = isStageCompleted(index);
                      const isUnlocked = isStageUnlocked(index);
                      const isCurrent = getCurrentStage() === index;
                      
                      return (
                        <div key={stage.key} className="flex items-center">
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isCompleted 
                                ? "bg-green-500 text-white shadow-lg" 
                                : isCurrent
                                ? "bg-purple-500 text-white shadow-lg animate-pulse"
                                : isUnlocked
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 text-gray-500"
                            }`}>
                              {isCompleted ? (
                                <Check className="h-6 w-6" />
                              ) : !isUnlocked ? (
                                <Lock className="h-5 w-5" />
                              ) : (
                                <Icon className="h-5 w-5" />
                              )}
                            </div>
                            <span className={`text-xs font-medium text-center ${
                              isCompleted ? "text-green-600" : isCurrent ? "text-purple-600" : "text-gray-600"
                            }`}>
                              {stage.label}
                            </span>

                          </div>
                          {index < stageDefinitions.length - 1 && (
                            <div className={`w-16 h-1 mx-4 transition-all duration-300 ${
                              isCompleted ? "bg-green-400" : "bg-gray-300"
                            }`}></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stage Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stageDefinitions.map((stage, index) => {
                    const Icon = stage.icon;
                    const isCompleted = isStageCompleted(index);
                    const isUnlocked = isStageUnlocked(index);
                    const currentValue = project.stages[stage.key];
                    
                    return (
                      <Card key={stage.key} className={`transition-all duration-200 ${
                        isCompleted 
                          ? "border-green-500 bg-green-50" 
                          : isUnlocked
                          ? "border-purple-300 bg-white hover:shadow-md"
                          : "border-gray-200 bg-gray-50"
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted 
                                ? "bg-green-500 text-white" 
                                : isUnlocked
                                ? "bg-purple-500 text-white"
                                : "bg-gray-400 text-white"
                            }`}>
                              {isCompleted ? (
                                <Check className="h-4 w-4" />
                              ) : !isUnlocked ? (
                                <Lock className="h-3 w-3" />
                              ) : (
                                <Icon className="h-4 w-4" />
                              )}
                            </div>
                            <h3 className="font-medium text-gray-800">{stage.label}</h3>
                          </div>
                          
                          {isUnlocked ? (
                            <Select 
                              value={currentValue} 
                              onValueChange={(value) => updateStage(stage.key, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {stage.options.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-center space-x-2 text-gray-500">
                              <Lock className="h-4 w-4" />
                              <span className="text-sm">Complete previous step to proceed</span>
                            </div>
                          )}
                          
                          <Badge className={`mt-2 ${getStageStatus(currentValue)}`}>
                            {currentValue}
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Mobile: Vertical Stepper  Hosting*/}
                <div className="block md:hidden space-y-4">
                  {stageDefinitions.map((stage, index) => {
                    const Icon = stage.icon;
                    const isCompleted = isStageCompleted(index);
                    const isUnlocked = isStageUnlocked(index);
                    const isCurrent = getCurrentStage() === index;
                    const currentValue = project.stages[stage.key];
                    
                    return (
                      <div key={stage.key} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? "bg-green-500 text-white" 
                              : isCurrent
                              ? "bg-purple-500 text-white animate-pulse"
                              : isUnlocked
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-gray-500"
                          }`}>
                            {isCompleted ? (
                              <Check className="h-5 w-5" />
                            ) : !isUnlocked ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Icon className="h-5 w-5" />
                            )}
                          </div>
                          {index < stageDefinitions.length - 1 && (
                            <div className={`w-1 h-12 mt-2 ${
                              isCompleted ? "bg-green-400" : "bg-gray-300"
                            }`}></div>
                          )}
                        </div>
                        
                        <div className="flex-1 pb-8">
                          <h3 className="font-medium text-gray-800 mb-2">{stage.label}</h3>
                          {isUnlocked ? (
                            <Select 
                              value={currentValue} 
                              onValueChange={(value) => updateStage_hosting(stage.key, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {stage.options.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option} 
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-center space-x-2 text-gray-500">
                              <Lock className="h-4 w-4" />
                              <span className="text-sm">Complete previous step to proceed</span>
                            </div>
                          )}
                          <Badge className={`mt-2 ${getStageStatus(currentValue)}`}>
                            {currentValue}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "documents" && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span>📝 Client Documents & Agreements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Engagement Form Card */}

     
                <Card className="border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Paperclip className="h-5 w-5 text-purple-500" />
                      <span>Engagement Form  </span>
                      {/* <Badge className={
                            project.documents[0].status === "Received"
                          ? "bg-green-500 text-white"
                          : project.documents[0].status === "Sent"
                          ? "bg-blue-500 text-white"
                          : "bg-yellow-500 text-white"
                      }>
                        {project.documents[0].status === "Received"
                      ? "✅ Received"
                      : project.documents[0].status === "Sent"
                      ? "✉️ Sent"
                      : "⚠️ Pending"}
                      </Badge> */}
                    </CardTitle>
                  </CardHeader>
                
                
                  <CardContent className="space-y-4">
                    {/* File Upload/Display */}
                 
                     
                     <div className="space-y-4">
                              {
                              
                              project.documents
                            .filter(doc => doc.doc_type === "Engagement Form")
                            .map((doc, idx) => (
                              
                              
                             
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center space-x-3">
                                    <FileText className="h-8 w-8 text-red-500" />
                                    <div>
                                      <p className="font-medium text-gray-800">{doc.doc_type}</p>
                                      <p className="text-sm text-gray-600">{doc.doc_name}</p>
                                 <p className="text-sm text-gray-600">
                                            <span
                                              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                                doc.doc_name === "Engagement Form With Signature"
                                                  ? "bg-green-100 text-green-800"
                                                  : "bg-blue-100 text-blue-800"
                                              }`}
                                            >
                                              {doc.doc_name === "Engagement Form With Signature" ? "Received" : "Sent On"}
                                            </span>{" "}
                                            {doc.sent_on}
                                          </p>
                                      <p className="text-sm text-gray-600"> {(doc.file_size / 1024 / 1024).toFixed(2)} MB</p>

                                       
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                       <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                                                          <DialogTrigger asChild>
                                                            <Button
                                                              size="sm"
                                                              variant="outline"
                                                              onClick={() => {
                                                                setActiveDoc(doc);
                                                                setModalOpen(true);
                                                              }}
                                                            >
                                                              <Eye className="h-4 w-4" />
                                                            </Button>
                                                          </DialogTrigger>
                                                          <DialogContent className="max-w-lg">
                                                            <DialogHeader>
                                                              <DialogTitle>Document Details</DialogTitle>
                                                              <DialogDescription>
                                                                Preview <strong>{activeDoc?.doc_name}</strong>
                                                              </DialogDescription>
                                                            </DialogHeader>

                                                            <div className="space-y-4">
                                                              {/* 1) PDF preview */}
                                                              <object
                                                               
                                                               data={activeDoc?.url}
                                                                type="application/pdf"
                                                                className="w-full h-96 border rounded"
                                                              >
                                                                <p>
                                                                  <a
                                                                    href={activeDoc?.doc_type}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                  >
                                                                    Download PDF 
                                                                  </a>
                                                                </p>
                                                              </object>

                                                              {/* 2) Metadata */}
                                                              <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                  <span className="block text-sm font-medium text-gray-600">Status</span>
                                                                  <Badge
                                                                    className={
                                                                      activeDoc?.doc_name == "Engagement Form With Signature"
                                                                        ? "bg-green-500 text-white"
                                                                        : activeDoc?.doc_name === "Engagement Form With Changes"
                                                                        ? "bg-blue-500 text-white"
                                                                        : "bg-yellow-500 text-white"
                                                                    }
                                                                  >
                                                                    {activeDoc?.doc_name=="Engagement Form With Signature" ? "Received On" :"Sent On"}
                                                                  </Badge>
                                                                </div>
                                                                <div>
                                                                  <span className="block text-sm font-medium text-gray-600">Sent On</span>
                                                                  <p className="mt-1">{activeDoc?.sent_on || "—"}</p>
                                                                </div>
                                                              </div>

                                                              {/* 3) Notes */}
                                                              <div>
                                                                <span className="block text-sm font-medium text-gray-600">Notes</span>
                                                                <p className="mt-1 whitespace-pre-wrap">{activeDoc?.notes || "No notes."}</p>
                                                              </div>
                                                            </div>

                                                            <DialogFooter>
                                                              <Button variant="outline" onClick={() => setModalOpen(false)}>
                                                                Close
                                                              </Button>
                                                            </DialogFooter>
                                                          </DialogContent>
                                        </Dialog>





                                 
                                  </div>
                                </div>
                              ))}
                            </div>

                     

                    <div>
                    

                       <Dialog open={modalOpen1} onOpenChange={setModalOpen1}>
        <DialogTrigger asChild>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setModalOpen1(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Upload New Document
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Engagement Form</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* File picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select PDF
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                className="mt-1"
              />
              {selectedFile && (
                <p className="mt-1 text-sm text-gray-600">
                  {selectedFile.name}
                </p>
              )}
            </div>

{/* purpose */}

              <div>
              <label className="block text-sm font-medium text-gray-700">
                For
              </label>
              <select
                value={fordata}
                onChange={(e) => setforData(e.target.value)}
                className="mt-1 block w-full border rounded px-2 py-1 bg-white"
              >
                <option value="" disabled>
                  Select For
                </option>
      
                <option value="Engagement Form For Signature">Engagement Form For Signature</option>
                <option value="Engagement Form With Signature">Engagement Form with Signature</option>
                <option value="Engagement Form With Changes">Engagement Form With Changes </option>
              </select>
            </div>



         


            {/* Date picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {  fordata=="Engagement Form With Signature" ? "Received On" : "Sent On"}
                </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full border rounded px-2 py-1"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
                placeholder="Any internal notes…"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen1(false)}>
              Cancel
            </Button>
            <Button onClick={handleElements}>Submit</Button>
          </DialogFooter>
        </DialogContent>
                   </Dialog>






                    </div>
                  </CardContent>
               
               
               
               
                </Card>

                          {/* Acceptance Form Card */}
              
                 <Card className="border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Paperclip className="h-5 w-5 text-purple-500" />
                      <span>Acceptance Form  fdf </span>
                      {/* <Badge className={
                            project.documents[0].status === "Received"
                          ? "bg-green-500 text-white"
                          : project.documents[0].status === "Sent"
                          ? "bg-blue-500 text-white"
                          : "bg-yellow-500 text-white"
                      }>
                        {project.documents[0].status === "Received"
                      ? "✅ Received"
                      : project.documents[0].status === "Sent"
                      ? "✉️ Sent"
                      : "⚠️ Pending"}
                      </Badge> */}
                    </CardTitle>
                  </CardHeader>
                
                
                  <CardContent className="space-y-4">
                    {/* File Upload/Display */}
      
                     
                     <div className="space-y-4">
                              {project.documents
                            .filter(doc => doc.doc_type === "Acceptance Form")
                            .map((doc, idx) => (
                                                          <div
                                  key={idx}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center space-x-3">
                                    <FileText className="h-8 w-8 text-red-500" />
                                    <div>
                                      <p className="font-medium text-gray-800">{doc.doc_type}</p>
                                      <p className="text-sm text-gray-600">{doc.doc_name}</p>
                                     
                                      <p className="text-sm text-gray-600">
                                                                <span
                                                                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                                                    doc.doc_name === "Acceptance Form With Signature"
                                                                      ? "bg-green-100 text-green-800"
                                                                      : "bg-blue-100 text-blue-800"
                                                                  }`}
                                                                >
                                                                  {doc.doc_name === "Acceptance Form With Signature" ? "Received" : "Received"}
                                                                </span>{" "}
                                                                {doc.sent_on}
                                                              </p>

                                      <p className="text-sm text-gray-600"> {(doc.file_size / 1024 / 1024).toFixed(2)} MB</p>

                                       
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                       <Dialog open={modalOpen2} onOpenChange={setModalOpen2}>
                                                          <DialogTrigger asChild>
                                                            <Button
                                                              size="sm"
                                                              variant="outline"
                                                              onClick={() => {
                                                                setActiveDoc(doc);
                                                                setModalOpen2(true);
                                                              }}
                                                            >
                                                              <Eye className="h-4 w-4" />
                                                            </Button>
                                                          </DialogTrigger>
                                                          <DialogContent className="max-w-lg">
                                                            <DialogHeader>
                                                              <DialogTitle>Document Details  </DialogTitle>
                                                              <DialogDescription>
                                                                Preview <strong>{activeDoc?.doc_name}</strong>
                                                              </DialogDescription>
                                                            </DialogHeader>

                                                            <div className="space-y-4">
                                                              {/* 1) PDF preview */}
                                                              <object
                                                               
                                                               data={activeDoc?.url}
                                                                type="application/pdf"
                                                                className="w-full h-96 border rounded"
                                                              >
                                                                <p>
                                                                  <a
                                                                    href={activeDoc?.doc_type}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                  >
                                                                    Download PDF
                                                                  </a>
                                                                </p>
                                                              </object>

                                                              {/* 2) Metadata */}
                                                              <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                  <span className="block text-sm font-medium text-gray-600">Status </span>
                                                                  <Badge
                                                                    className={
                                                                      activeDoc?.doc_name === "Acceptance Form With Signature"
                                                                        ? "bg-green-500 text-white"
                                                                        : activeDoc?.doc_name === "Acceptance Form With Signature"
                                                                        ? "bg-blue-500 text-white"
                                                                        : "bg-yellow-500 text-white"
                                                                    }
                                                                  >
                                                                    {activeDoc?.doc_name=="Acceptance Form With Signature" ? "Received" : "Received"}
                                                                  </Badge>
                                                                </div>
                                                                <div>
                                                                  <span className="block text-sm font-medium text-gray-600">

                                                                     {activeDoc?.doc_name=="Acceptance Form With Signature" ? "Received" : "Received"}

                                                                  </span>
                                                                  <p className="mt-1">{activeDoc?.sent_on || "—"}</p>
                                                                </div>
                                                              </div>

                                                              {/* 3) Notes */}
                                                              <div>
                                                                <span className="block text-sm font-medium text-gray-600">Notes</span>
                                                                <p className="mt-1 whitespace-pre-wrap">{activeDoc?.notes || "No notes."}</p>
                                                              </div>
                                                            </div>

                                                            <DialogFooter>
                                                              <Button variant="outline" onClick={() => setModalOpen(false)}>
                                                                Close
                                                              </Button>
                                                            </DialogFooter>
                                                          </DialogContent>
                                        </Dialog>





                                  
                                  </div>
                                </div>
                              ))}
                            </div>

                     

                    <div>
                    

    <Dialog open={modalOpenForAccepatance} onOpenChange={setModalOpenForAccepatance}>
        <DialogTrigger asChild>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setModalOpenForAccepatance(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Upload New Document
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Acceptance Form </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* File picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select PDF
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                className="mt-1"
              />
              {selectedFile && (
                <p className="mt-1 text-sm text-gray-600">
                  {selectedFile.name}
                </p>
              )}
            </div>

{/* purpose */}

                            <div>
              <label className="block text-sm font-medium text-gray-700">
                For
              </label>
              <select
                value={fordata}
                onChange={(e) => setforData(e.target.value)}
                className="mt-1 block w-full border rounded px-2 py-1 bg-white"
              >
                <option value="" disabled>
                  Select 
                </option>
      
                <option value="Acceptance Form With Signature">Acceptance Form With Signature</option>
            
                <option value="Acceptance Form With Changes">Acceptance Form With Changes </option>
              </select>
            </div>



            {/* Date picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Received On
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full border rounded px-2 py-1"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
                placeholder="Any internal notes…"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen1(false)}>
              Cancel
            </Button>
            <Button onClick={handleAcceptanceElements}>Submit</Button>
          </DialogFooter>
        </DialogContent>
                   </Dialog>






                    </div>
                  </CardContent>
               
               
               
               
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "files" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attachments */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span>Attachments</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">

                {/* project.documents
                            .filter(doc => doc.doc_type === "Acceptance Form")
                            .map((doc, idx) => ( */}
                {project.documents.filter(doc=>doc.doc_type=="General Documents").map((file, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{file.doc_name}</p>
                    
                           <p className="text-sm text-gray-600"> {(file.file_size / 1024 / 1024).toFixed(2)} MB  - {  new Date(file.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={()=>downloadFile(file.url)}>
                        <Download className="h-4 w-4" />
                      </Button>


                      <Button size="sm" variant="outline" onClick={()=>deleteFile(file.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
               



                {/* <label className="w-full mt-4 inline-flex items-center justify-center cursor-pointer border rounded-md px-4 py-2 hover:bg-gray-100">
  <Upload className="h-4 w-4 mr-2" />
  Upload New File dfsdf
  <input type="file" className="hidden" onChange={handleFileChange} />
</label>
 */}

 <Dialog open={modalOpen1} onOpenChange={setModalOpen1}>
        <DialogTrigger asChild>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setModalOpen1(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Upload New Document 
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* File picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select PDF
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                className="mt-1"
              />
              {selectedFile && (
                <p className="mt-1 text-sm text-gray-600">
                  {selectedFile.name}
                </p>
              )}
            </div>



           
              



         


          
            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                File Name
              </label>
             <input
                  type="text"
                      value={filenamenotes}
                      onChange={(e) => filenamedetails(e.target.value)}
                      className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                      placeholder="Your text here..."
                      required
                />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen1(false)}>
              Cancel
            </Button>
            <Button onClick={handleElements}>Submit</Button>
          </DialogFooter>
        </DialogContent>
                   </Dialog>





   
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.activities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.stage} - Change to {activity.details} </p>
                      <p className="text-sm text-gray-600">by {activity.updated_by}</p>
                    <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
