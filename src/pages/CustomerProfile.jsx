import { useState, useEffect,useLayoutEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {list_customer} from '../api/api';


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Star,
  Eye,
  Edit,
  Copy,
  Plus,
  Download,
  FileText,
  Image,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Users,
  Video,
  MessageSquare,
  Filter,
  TrendingUp,
  PieChart
} from "lucide-react";

const CustomerProfile = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filterBy, setFilterBy] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
   const [loading, setLoading] = useState(false);

  const fetchdata=async(id)=>{
       try{
            const data=await list_customer(id);

           return data;
      }catch(errr)
      {
        console.log(errr)
      }


  }





 



// useEffect(() => {
//   const fetchCustomer = async () => {
//     console.log("Looking for customer with ID:", id);

//     try {
//       const customerData = await fetchdata(id);
     

//       // customerData is { status: true, data: { … } }
//       console.log("Raw payload:", customerData);

//       const inner = customerData.data.data;
//       console.log("Unwrapped inner data:", inner);

    
//       if (inner && typeof inner === "object" && inner.id !== undefined) {
//         console.log("Single customer object returned:", inner);
//         setCustomer(inner);
//       } else {
//            console.log("error in object");
//       }
//     } catch (err) {
//       console.error("Error fetching customer:", err);
    
//     }
//   };

//   fetchCustomer();
// }, [id]);


useLayoutEffect(() => {
    const fetchCustomer = async () => {
      console.log("Looking for customer with ID:", id);
          setLoading(true);

      try {
        const customerData = await fetchdata(id);

        // customerData is { status: true, data: { data: { … } } }
        console.log("Raw payload:", customerData);

        // unwrap two levels: axios → response.data → data field
        const inner = customerData.data.data;
        console.log("Unwrapped inner data:", inner);

        if (inner && typeof inner === "object" && inner.id !== undefined) {
          console.log("Single customer object returned:", inner);
          setCustomer(inner);
        } else {
          console.log("error in object");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching customer:", err);
         setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);



 if (loading) {
    return (
      <>
        {/* Inline CSS for the spinner */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .spinner-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
            }
            .spinner {
              border: 4px solid #f3f3f3;
              border-top: 4px solid #3498db;
              border-radius: 50%;
              width: 48px;
              height: 48px;
              animation: spin 1s linear infinite;
            }
            .spinner-text {
              margin-top: 0.75rem;
              font-size: 1rem;
              color: #555;
            }
          `}
        </style>
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Loading customer…</div>
        </div>
      </>
    );
  }


  if (!customer) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer not found</h2>
            <p className="text-gray-600 mb-4">
              We couldn't find a customer with ID: <code className="bg-gray-100 px-2 py-1 rounded">{id}</code>
            </p>
            <Link to="/customer-list">
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600">
                ← Back to Customers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isHighValueCustomer = projects.length > 2 || projects.reduce((sum, p) => sum + p.totalAmount, 0) > 10000;
  
  const filteredProjects = projects.filter(project => {
    const statusMatch = filterBy === "all" || project.status.toLowerCase().includes(filterBy.toLowerCase());
    const yearMatch = filterYear === "all" || project.year === filterYear;
    return statusMatch && yearMatch;
  });

  const financialData = {
    totalProjects: projects.length,
    totalPaid: projects.reduce((sum, p) => sum + p.amountPaid, 0),
    totalPending: projects.reduce((sum, p) => sum + (p.totalAmount - p.amountPaid), 0),
    totalValue: projects.reduce((sum, p) => sum + p.totalAmount, 0)
  };

  const mockMeetings = [
    { id: 1, type: "Video Call", date: "2024-06-15", summary: "Project kickoff discussion", staff: "John" },
    { id: 2, type: "In-Person", date: "2024-05-10", summary: "Brand requirements meeting", staff: "Sarah" }
  ];

  const mockTasks = [
    { id: 1, title: "Send final design mockups", status: "Pending", assignedTo: "John", dueDate: "2024-06-20" },
    { id: 2, title: "Collect feedback on homepage", status: "Completed", assignedTo: "Sarah", dueDate: "2024-06-18" }
  ];

  const mockFiles = [
    { id: 1, name: "Logo_Final.png", type: "image", uploadDate: "2024-06-10", size: "2.5 MB" },
    { id: 2, name: "Brand_Guidelines.pdf", type: "document", uploadDate: "2024-06-05", size: "1.8 MB" }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link to="/customer-list">
            <Button variant="outline" className="mb-4">
              ← Back to Customers
            </Button>
          </Link>
        </div>

        {/* Customer Overview Section */}
        <Card className={`mb-6 bg-white shadow-lg border-0 ${isHighValueCustomer ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              
              {/* Avatar and Basic Info */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-2xl font-bold">
                      {customer.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isHighValueCustomer && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                      <Star className="h-3 w-3 text-yellow-600 fill-current" />
                    </div>
                  )}
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
                    <span>{customer.fullName}</span>
                    {isHighValueCustomer && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        <Star className="h-3 w-3 mr-1" />
                        VIP Client
                      </Badge>
                    )}
                  </h1>
                  <p className="text-gray-600">Customer since {new Date(customer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a href={`tel:${customer.mobile}`} className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <Phone className="h-4 w-4" />
                  <span>{customer.mobile}</span>
                </a>
                
                <a href={`mailto:${customer.email}`} className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{customer.email}</span>
                </a>
                
                {customer.address && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview Widget */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{financialData.totalProjects}</p>
                </div>
                <div className="bg-blue-500 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">${financialData.totalPaid.toLocaleString()}</p>
                </div>
                <div className="bg-green-500 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Balance Pending</p>
                  <p className="text-2xl font-bold text-orange-600">${financialData.totalPending.toLocaleString()}</p>
                </div>
                <div className="bg-orange-500 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-purple-600">${financialData.totalValue.toLocaleString()}</p>
                </div>
                <div className="bg-purple-500 p-2 rounded-full">
                  <PieChart className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span>Project History</span>
                    <Badge variant="secondary">{projects.length}</Badge>
                  </CardTitle>
                  
                  <div className="flex space-x-2">
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterYear} onValueChange={setFilterYear}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects yet!</h3>
                    <p className="text-gray-600 mb-6">Let's start building something amazing together</p>
                    <Button className="bg-gradient-to-r from-purple-500 to-purple-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Project
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProjects.map((project) => (
                      <Card key={project.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                                <Badge variant={project.status === "Completed" ? "default" : project.status === "In Progress" ? "secondary" : "outline"}>
                                  {project.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4" />
                                  <span>{project.stage}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Users className="h-4 w-4" />
                                  <div className="flex space-x-1">
                                    {project.assignedStaff.map((staff, index) => (
                                      <Avatar key={index} className="w-6 h-6">
                                        <AvatarFallback className="text-xs bg-purple-100 text-purple-800">
                                          {staff.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex items-center space-x-4 text-sm">
                                <span className="text-green-600 font-medium">
                                  Paid: ${project.amountPaid.toLocaleString()}
                                </span>
                                <span className="text-orange-600 font-medium">
                                  Balance: ${(project.totalAmount - project.amountPaid).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 ml-4">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Meetings & Interactions</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-purple-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {mockMeetings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No meetings scheduled</h3>
                    <p className="text-gray-600 mb-6">Start building stronger relationships</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockMeetings.map((meeting) => (
                      <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-full">
                            {meeting.type === "Video Call" ? <Video className="h-4 w-4 text-purple-600" /> : <MessageSquare className="h-4 w-4 text-purple-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{meeting.type}</span>
                              <Badge variant="outline">{new Date(meeting.date).toLocaleDateString()}</Badge>
                            </div>
                            <p className="text-gray-600 text-sm">{meeting.summary}</p>
                            <p className="text-xs text-gray-500">with {meeting.staff}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle>Tasks & To-Dos</CardTitle>
              </CardHeader>
              
              <CardContent>
                {mockTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">All caught up!</h3>
                    <p className="text-gray-600">No pending tasks for this customer</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${task.status === "Completed" ? "bg-green-500" : "bg-orange-500"}`} />
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-600">
                              Assigned to {task.assignedTo} • Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={task.status === "Completed" ? "default" : "secondary"}>
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Attachments & Files</CardTitle>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {mockFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📎</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No files uploaded</h3>
                    <p className="text-gray-600 mb-6">Upload project assets, logos, or references</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockFiles.map((file) => (
                      <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {file.type === "image" ? <Image className="h-6 w-6 text-blue-600" /> : <FileText className="h-6 w-6 text-red-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.name}</p>
                            <p className="text-sm text-gray-600">{file.size}</p>
                            <p className="text-xs text-gray-500">{new Date(file.uploadDate).toLocaleDateString()}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerProfile;
