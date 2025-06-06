
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddStaffModal from "../components/AddStaffModal";
import { Plus, Eye, Edit, UserX, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const StaffList = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock staff data
  const staffMembers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      employeeId: "EMP001",
      role: "Frontend Developer",
      status: "Active",
      profilePicture: "",
      phone: "+1 234 567 8901"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@company.com",
      employeeId: "EMP002",
      role: "UI/UX Designer",
      status: "On Leave",
      profilePicture: "",
      phone: "+1 234 567 8902"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      employeeId: "EMP003",
      role: "Backend Developer",
      status: "Active",
      profilePicture: "",
      phone: "+1 234 567 8903"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      employeeId: "EMP004",
      role: "Project Manager",
      status: "Resigned",
      profilePicture: "",
      phone: "+1 234 567 8904"
    }
  ];

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

  const filteredStaff = staffMembers.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
              <p className="text-gray-600 mt-2">Manage your team members and their information</p>
            </div>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Staff
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name, email, employee ID, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {staffMembers.filter(s => s.status === "Active").length}
                  </div>
                  <div className="text-sm text-gray-600">Active Staff</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {staffMembers.filter(s => s.status === "On Leave").length}
                  </div>
                  <div className="text-sm text-gray-600">On Leave</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {staffMembers.filter(s => s.status === "Resigned").length}
                  </div>
                  <div className="text-sm text-gray-600">Resigned</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {staffMembers.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Staff</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Staff Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((staff) => (
              <Card key={staff.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={staff.profilePicture} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{staff.name}</CardTitle>
                      <p className="text-sm text-gray-600">{staff.role}</p>
                      <Badge variant={getStatusBadgeVariant(staff.status)} className="mt-1">
                        {staff.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">ID:</span> {staff.employeeId}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {staff.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {staff.phone}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Link to={`/staff/${staff.id}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {staff.status === "Active" && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <UserX className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No staff members found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      <AddStaffModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default StaffList;
