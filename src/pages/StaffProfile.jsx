
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {get_all_staff} from '../api/api';



// const [staffs, setStaff]=useState({

// });




import { 
  ArrowLeft, 
  Edit, 
  Download, 
  Eye,
  FileText,
  DollarSign,
  Calendar,
  AlertTriangle,
  Clock,
  FolderOpen,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

const StaffProfile = () => {
  const { id } = useParams();
    const [loading, setLoading] = useState(false);
  const [staffMembers,setStaff]=useState([])
 
  const getstaff= async (id)=>{
      setLoading(true)
        try{
           const data=await get_all_staff(id);
       console.log('staff',data.data.data);
      setStaff(data.data.data);

        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
      
    }
 
  useEffect(()=>{

    getstaff(id);

 
  },
  [id]);




  // Mock staff data - in real app, fetch based on ID
  const staff = {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    employeeId: "EMP001",
    role: "Frontend Developer",
    department: "Engineering",
    status: "Active",
    profilePicture: "",
    phone: ["+1 234 567 8901", "+1 234 567 8902"],
    joiningDate: "2023-01-15",
    shift: "09:00 AM - 06:00 PM",
    notes: "Excellent performer with strong React skills. Team lead for multiple projects.",
    documents: [
      { name: "Resume.pdf", type: "resume", uploadDate: "2023-01-10" },
      { name: "Aadhar_Card.pdf", type: "id", uploadDate: "2023-01-10" },
      { name: "Educational_Certificate.pdf", type: "education", uploadDate: "2023-01-10" }
    ],
    payslips: [
      { month: "December 2024", salary: 75000, deductions: 5000, netPaid: 70000 },
      { month: "November 2024", salary: 75000, deductions: 5000, netPaid: 70000 },
      { month: "October 2024", salary: 75000, deductions: 5000, netPaid: 70000 }
    ],
    leaves: [
      { dates: "Dec 20-22, 2024", type: "Casual", status: "Approved", days: 3 },
      { dates: "Nov 15, 2024", type: "Sick", status: "Approved", days: 1 },
      { dates: "Oct 10-12, 2024", type: "Earned", status: "Approved", days: 3 }
    ],
    leaveStats: { taken: 7, remaining: 18, total: 25 },
    complaints: [
      { date: "Dec 1, 2024", issue: "Laptop performance issues", status: "Resolved", notes: "Replaced with new laptop" }
    ],
    attendance: [
      { date: "Dec 23, 2024", punchIn: "09:15 AM", punchOut: "06:30 PM", totalHours: "9h 15m" },
      { date: "Dec 22, 2024", punchIn: "09:00 AM", punchOut: "06:00 PM", totalHours: "9h 0m" },
      { date: "Dec 21, 2024", punchIn: "09:10 AM", punchOut: "06:15 PM", totalHours: "9h 5m" }
    ],
    projects: [
      { name: "E-commerce Platform", role: "Lead Developer", status: "In Progress", deadline: "2024-02-15" },
      { name: "Mobile App Redesign", role: "Frontend Developer", status: "Completed", deadline: "2023-12-01" }
    ]
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Active":
        return "default";
      case "On Leave":
        return "secondary";
      case "Resigned":
        return "destructive";
      default:
        return "outline";
    }
  };

  const initials = (staffMembers.name || "")
  .trim()                          // remove extra whitespace
  .split(/\s+/)                    // split on one or more spaces
  .map(word => word.charAt(0))    // take first letter of each word
  .join("")                        // concatenate
  .toUpperCase();   

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
          <div className="spinner-text">Loading Staff</div>
        </div>
      </>
    );
  }
  
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/staff">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Staff
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Staff Profile</h1>
            </div>
          
          </div>

          {/* Personal & Job Info Card */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-start space-x-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={staffMembers.profile_pic_url} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white text-2xl">
                   {initials}

                    
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h2 className="text-2xl font-bold">{staffMembers.name}</h2>
                    <Badge variant={getStatusBadgeVariant(staffMembers.status)} className="text-sm">
                      {staffMembers.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{staffMembers.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{staffMembers.contact}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span><strong>ID:</strong> {staffMembers.employeeId}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span><strong>Role:</strong> {staffMembers.role}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span><strong>Joined:</strong> {new Date(staffMembers.joiningDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span><strong>Shift:</strong> {staffMembers.shiftStart} - {staffMembers.shiftEnd}</span>
                      </div>
                    </div>
                  </div>
                  
                  {staff.notes && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{staffMembers.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different sections */}
          <Tabs defaultValue="documents" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="documents">📄 Documents</TabsTrigger>
              <TabsTrigger value="payslips">💰 Payslips</TabsTrigger>
              <TabsTrigger value="leaves">🏖️ Leaves</TabsTrigger>
              <TabsTrigger value="complaints">❗ Complaints</TabsTrigger>
              <TabsTrigger value="attendance">⏱️ Attendance</TabsTrigger>
              <TabsTrigger value="projects">📁 Projects</TabsTrigger>
            </TabsList>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Uploaded Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">

      <p>Coming Soon</p>


                    {/* {staff.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-gray-600">Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))} */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payslips Tab */}
            <TabsContent value="payslips">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Payslip History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       <p>Coming Soon</p>
                    {/* {staff.payslips.map((payslip, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{payslip.month}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Salary:</span>
                              <span>₹{payslip.salary.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Deductions:</span>
                              <span>₹{payslip.deductions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span>Net Paid:</span>
                              <span>₹{payslip.netPaid.toLocaleString()}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-3">
                            <Download className="h-4 w-4 mr-1" />
                            Download PDF
                          </Button>
                        </CardContent>
                      </Card>
                    ))} */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leaves Tab */}
            <TabsContent value="leaves">
              <div className="space-y-6">
                {/* Leave Stats */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-6 text-center">
                         <p>Coming Soon</p>
                      {/* <div>
                        <div className="text-2xl font-bold text-red-600">{staff.leaveStats.taken}</div>
                        <div className="text-sm text-gray-600">Taken</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{staff.leaveStats.remaining}</div>
                        <div className="text-sm text-gray-600">Remaining</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{staff.leaveStats.total}</div>
                        <div className="text-sm text-gray-600">Total</div>
                      </div> */}
                    </div>
                  </CardContent>
                </Card>

                {/* Leave History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Leave History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                         <p>Coming Soon</p>
                      {/* {staff.leaves.map((leave, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{leave.dates}</h4>
                            <p className="text-sm text-gray-600">{leave.type} Leave • {leave.days} day(s)</p>
                          </div>
                          <Badge variant={leave.status === "Approved" ? "default" : "secondary"}>
                            {leave.status}
                          </Badge>
                        </div>
                      ))} */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Complaints Tab */}
            <TabsContent value="complaints">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Complaints Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                       <p>Coming Soon</p>
                    {/* {staff.complaints.map((complaint, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{complaint.issue}</h4>
                          <Badge variant={complaint.status === "Resolved" ? "default" : "destructive"}>
                            {complaint.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Reported on {new Date(complaint.date).toLocaleDateString()}</p>
                        {complaint.notes && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{complaint.notes}</p>
                        )}
                      </div>
                    ))} */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Attendance & Time Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* {staff.attendance.map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{new Date(record.date).toLocaleDateString()}</h4>
                          <p className="text-sm text-gray-600">
                            {record.punchIn} - {record.punchOut}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{record.totalHours}</div>
                          <div className="text-sm text-gray-600">Total Time</div>
                        </div>
                      </div>
                    ))} */}
                       <p>Coming Soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FolderOpen className="h-5 w-5 mr-2" />
                    Assigned Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* {staff.projects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-gray-600">{project.role}</p>
                          <p className="text-sm text-gray-600">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                      </div>
                    ))} */}

                       <p>Coming Soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
