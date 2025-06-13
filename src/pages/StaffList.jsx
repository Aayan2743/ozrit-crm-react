
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddStaffModal from "../components/AddStaffModal";
import EditStaffModal from "../components/EditStaffModal";
import { Plus, Eye, Edit, UserX, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {get_all_staffs,delete_staff} from '../api/api';
import Swal from 'sweetalert2';
const StaffList = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddModalOpen1, setIsAddModalOpen1] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
   const [selectedStaff, setSelectedStaff] = useState(null);
   const [loading, setLoading] = useState(false);

   const deleteHandler=async (id)=>{
        // const deletestaff=delete_staff(id);



        // console.log(deletestaff);
    const result = await Swal.fire({
    title: 'Are you sure?',
    text: "This will permanently delete the staff member.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      // Call your API
      const response = await delete_staff(id);
      if (response.data.status) {
        Swal.fire(
          'Deleted!',
          'The staff member has been deleted.',
          'success'
        );

          get_my_staff();
        // Optionally re-fetch your list here, e.g. fetchStaff()
      } else {
        Swal.fire(
          'Error',
          response.data.message || 'Could not delete staff.',
          'error'
        );
      }
    } catch (err) {
      Swal.fire(
        'Error',
        err.message || 'An unexpected error occurred.',
        'error'
      );
    }
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    Swal.fire(
      'Cancelled',
      'Your staff member is safe.',
      'info'
    );
  }


   }

  const [staffMembers,setStaff]=useState([])
     
        const get_my_staff=async()=>{
           setLoading(true);
            try{
             
            
               const data= await get_all_staffs();

              console.log("my staff",data.data.data);

              setStaff(data.data.data);
              
            }catch(error){
                console.log(error)
            }finally{
                setLoading(false);
            }

         
      }

  useEffect(()=>{

     
      get_my_staff();

    
  },[]);








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

  // const filteredStaff = staffMembers.filter(staff =>
  //   staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  // );

const filteredStaff = staffMembers.filter(staff => {
  const name       = (staff.name       || "").toLowerCase();
  const email      = (staff.email      || "").toLowerCase();
  const employeeId = (staff.employeeId || "").toLowerCase();
  const role       = (staff.role       || "").toLowerCase();
  const term       = searchTerm.toLowerCase();

  return (
    name.includes(term) ||
    email.includes(term) ||
    employeeId.includes(term) ||
    role.includes(term)
  );
});


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
                      <span className="font-medium">Phone:</span> {staff.contact}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Link to={`/staff/${staff.id}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="flex-1"  onClick={() => {
                          setSelectedStaff(staff);    
                          setIsAddModalOpen1(true);   
                        }}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {staff.status === "Active" && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={()=>deleteHandler(staff.id)}>
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

      <EditStaffModal 
       staff={selectedStaff}
        isOpen={isAddModalOpen1} 
        onClose={() => setIsAddModalOpen1(false)} 
        onSave={() => get_my_staff()} 
      />
    </div>
  );
};

export default StaffList;
