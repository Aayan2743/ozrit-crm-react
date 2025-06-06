import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Swal from "sweetalert2";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Briefcase,
  Filter,
  SortAsc,
  SortDesc,
  UserPlus,
  Star,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useLoaderData,useFetcher } from 'react-router-dom'

import {delete_customer} from '../api/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

   const details =useLoaderData();
   const fetcher = useFetcher();
   const customerList = details?.data?.data || [];
  console.log("saa",details.data.data);


 

   useEffect(() => {
    setCustomers(details.data.data); // initialize from loader data
  }, [details]);

  // Update customers when fetcher loads new data
  useEffect(() => {
  
   if (Array.isArray(fetcher.data?.data)) {
    setCustomers(fetcher.data.data);
  }

  }, [fetcher.data]);



  const handleDeleteCustomer = async (customerId) => {
    
    // const delete_response = await delete_customer(customerId);

    //  window.location.reload();


    const result = await Swal.fire({
    title: "Are you sure?",
    text: "This will permanently delete the customer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, keep it",
  });

  if (result.isConfirmed) {
    try {
      await delete_customer(customerId);
      Swal.fire("Deleted!", "Customer has been deleted.", "success");
      window.location.reload(); // or re-fetch your list instead of reloading
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not delete the customer. Please try again.", "error");
    }
  }

   
    
   
  };

  const filteredAndSortedCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterBy === "all") return matchesSearch;
      if (filterBy === "active") return matchesSearch && customer.status === "active";
      if (filterBy === "new") return matchesSearch && customer.status === "new";
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "a-z":
          return a.fullName.localeCompare(b.fullName);
        case "z-a":
          return b.fullName.localeCompare(a.fullName);
        default:
          return 0;
      }
    });

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === "active").length,
    new: customers.filter(c => c.status === "new").length
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                <Users className="h-8 w-8 text-purple-500" />
                <span>Customer Directory</span>
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your amazing client relationships
              </p>
            </div>
            <Link to="/add-customer">
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-3xl font-bold text-gray-900">{details.data.total_count}</p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Month</p>
                    <p className="text-3xl font-bold text-gray-900">{details.data.current_month_count}</p>
                  </div>
                  <div className="bg-green-500 p-3 rounded-full">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Year</p>
                    <p className="text-3xl font-bold text-gray-900">{details.data.current_year_count}</p>
                  </div>
                  <div className="bg-yellow-500 p-3 rounded-full">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

             <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Leads</p>
                    <p className="text-3xl font-bold text-gray-900">{details.data.total_count}</p>
                  </div>
                  <div className="bg-yellow-500 p-3 rounded-full">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            
          </div>

          {/* Search and Filters */}
          <Card className="bg-white shadow-lg border-0 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48 h-12">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="a-z">A to Z</SelectItem>
                    <SelectItem value="z-a">Z to A</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filter */}
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-full md:w-48 h-12">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="active">Active Clients</SelectItem>
                    <SelectItem value="new">New Leads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer List */}
        {filteredAndSortedCustomers.length === 0 ? (
          
          /* Empty State */
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {searchTerm ? "No customers found" : "No customers yet"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? "Try adjusting your search or filters" 
                    : "Start building your client base by adding your first customer"
                  }
                </p>
                {!searchTerm && (
                  <Link to="/add-customer">
                    <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Customer
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
          
        ) : (
          
          /* Customer Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCustomers.map((customer) => (
              <Card key={customer.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {customer.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-800">{customer.fullName}</CardTitle>
                        <Badge 
                          variant={customer.status === "active" ? "default" : "secondary"}
                          className="mt-1"
                        >
                          {customer.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{customer.mobile}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    
                    {customer.address && (
                      <div className="flex items-start space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{customer.address}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Briefcase className="h-4 w-4 text-purple-500" />
                      <span className="text-gray-600">{customer.projects} projects</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link to={`/customer/${customer.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-3 w-3 mr-1" />
                        View 
                      </Button>

                    </Link>
                       <Link to={`/edit-customer/${customer.id}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                     </Link>  

                    <Button size="sm" variant="outline" className="flex-1 text-green-600 hover:text-green-700">
                      <Plus className="h-3 w-3 mr-1" />
                      Project
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
