
import { useState, useMemo,useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {list_projects} from '../api/api';

import { 
  Search,
  Filter,
  Plus,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Grid3X3,
  List,
  ArrowUpDown,
  Globe,
  Server,
  Palette,
  ExternalLink,
  DollarSign
} from "lucide-react";

const AllProjects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [deadlineFilter, setDeadlineFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("cards");
  const [showFilters, setShowFilters] = useState(false);



  const [projects,setProjects]=useState([]);

  const fetchProjects = async () => {
  try {
    // Call your API helper (which itself presumably returns a promise)
    const response = await list_projects();

    console.log("fgfg",response.data);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    // Re‐throw or return a fallback so callers know something went wrong
    throw error;
  }
};


useEffect(() => {
  
    const load = async () => {
      try {
        const data = await fetchProjects();     // 1) wait for API call
        console.log("fgdfgfd",data);
       
        if (Array.isArray(data)) {             // 2) make sure it’s actually an array
          setProjects(data);                   // 3) update your state
        } else {
          console.warn("fetchProjects did not return an array:", data);
        }
      } catch (err) {
        console.error("Error loading projects:", err);
      }
    };

    load();
    // We don’t need fetcher.data here at all, because load() directly populates state.
  }, []);   




  const getDeadlineStatus = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const daysDiff = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return { status: "overdue", days: Math.abs(daysDiff) };
    if (daysDiff <= 30) return { status: "upcoming", days: daysDiff };
    return { status: "normal", days: daysDiff };
  };

  const getStageColor = (stage) => {
    switch (stage.toLowerCase()) {
      case "domain": return "bg-blue-100 text-blue-800";
      case "hosting": return "bg-yellow-100 text-yellow-800";
      case "design": return "bg-purple-100 text-purple-800";
      case "live": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {

    
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-500";
      case "in progress": return "bg-blue-500";
      case "on hold": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStageIcon = (stage) => {
    switch (stage.toLowerCase()) {
      case "domain": return Globe;
      case "hosting": return Server;
      case "design": return Palette;
      case "live": return ExternalLink;
      default: return Clock;
    }
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStage = stageFilter === "all" || project.currentStage.toLowerCase() === stageFilter.toLowerCase();
      
      const deadlineStatus = getDeadlineStatus(project.deadline);
      const matchesDeadline = deadlineFilter === "all" || 
                             (deadlineFilter === "upcoming" && deadlineStatus.status === "upcoming") ||
                             (deadlineFilter === "overdue" && deadlineStatus.status === "overdue");
      
 
                  const assignedNames = Array.isArray(project.assignedTo)
                    ? project.assignedTo
                    : JSON.parse(project.assignedTo || "[]");

                  // 2. Now check if staffFilter matches one of those names
                  const matchesStaff =
                    staffFilter === "all" ||
                    assignedNames.some((name) => name === staffFilter);
      
      const matchesStatus = statusFilter === "all" || project.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStage && matchesDeadline && matchesStaff && matchesStatus;
    });

    // Sort projects
    // filtered.sort((a, b) => {
    //   switch (sortBy) {
    //     case "newest":
    //       return new Date(b.createdAt) - new Date(a.createdAt);
    //     case "oldest":
    //       return new Date(a.createdAt) - new Date(b.createdAt);
    //     case "deadline-asc":
    //       return new Date(a.deadline) - new Date(b.deadline);
    //     case "deadline-desc":
    //       return new Date(b.deadline) - new Date(a.deadline);
    //     case "name-asc":
    //       return a.name.localeCompare(b.name);
    //     case "name-desc":
    //       return b.name.localeCompare(a.name);
    //     case "balance":
    //       return b.balanceRemaining - a.balanceRemaining;
    //     default:
    //       return 0;
    //   }
    // });


    filtered.sort((a, b) => {
  switch (sortBy) {
    case "newest":
      return new Date(b.createdAt) - new Date(a.createdAt);

    case "oldest":
      return new Date(a.createdAt) - new Date(b.createdAt);

    case "deadline-asc":
      return new Date(a.deadline || "") - new Date(b.deadline || "");

    case "deadline-desc":
      return new Date(b.deadline || "") - new Date(a.deadline || "");

    case "name-asc": {
      const nameA = (a.name || "").toString();
      const nameB = (b.name || "").toString();
      return nameA.localeCompare(nameB);
    }

    case "name-desc": {
      const nameA = (a.name || "").toString();
      const nameB = (b.name || "").toString();
      return nameB.localeCompare(nameA);
    }

    case "balance":
      // ensure balanceRemaining is a number (or fallback to 0)
      return (b.balanceRemaining || 0) - (a.balanceRemaining || 0);

    default:
      return 0;
  }
});


    return filtered;
  }, [projects, searchTerm, stageFilter, deadlineFilter, staffFilter, statusFilter, sortBy]);

  // const allStaff = [...new Set(projects.flatMap(p => p.assignedTo.map(s => s.name)))];

  const allStaff = [
  ...new Set(
    projects.flatMap(p => {
      // 1) Turn the JSON‐string into a real array of strings
      const arr = JSON.parse(p.assignedTo); // arr is now ["John Doe", …]

      // 2) If you stored each staff as an object { name: "…" } instead, you’d do:
      //    return arr.map(obj => obj.name);
      //    but in your case each element is already a string.

      return arr; 
    })
  )
];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Sidebar />
      
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">All Projects</h1>
              <p className="text-gray-600 mt-1">Manage and track all your projects</p>
            </div>
            <Link to="/add-project">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Project
              </Button>
            </Link>
          </div>

          {/* Search and View Toggle */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects or customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="rounded-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="mb-6 shadow-lg border-0">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                    <select
                      value={stageFilter}
                      onChange={(e) => setStageFilter(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Stages</option>
                      <option value="domain">Domain</option>
                      <option value="hosting">Hosting</option>
                      <option value="design">Design</option>
                      <option value="live">Live</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                    <select
                      value={deadlineFilter}
                      onChange={(e) => setDeadlineFilter(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Deadlines</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Staff</label>
                    <select
                      value={staffFilter}
                      onChange={(e) => setStaffFilter(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Staff</option>
                      {allStaff.map(staff => (
                        <option key={staff} value={staff}>{staff}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Status</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on hold">On Hold</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="deadline-asc">Deadline (Ascending)</option>
                      <option value="deadline-desc">Deadline (Descending)</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="balance">Pending Balance</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Projects Grid */}
        <div className={`grid gap-6 ${viewMode === "cards" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
          {filteredAndSortedProjects.map((project) => {
            const deadlineInfo = getDeadlineStatus(project.deadline);
            const StageIcon = getStageIcon(project.currentStage);
            
            return (
              <Card key={project.id} className="shadow-lg border-0 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-800 mb-2">
                        <Link to={`/project/${project.id}`} className="hover:text-purple-600 transition-colors">
                          {project.projectTitle}
                        </Link>
                      </CardTitle>
                      <Link 
                        to={`/customer/${project.customer.id}`}
                        className="text-sm text-purple-600 hover:underline flex items-center"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        {project.customer.fullName}
                      </Link>
                    </div>
                    <Badge className={`${getStatusColor(project.status)} text-white`}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Deadline */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Deadline</span>
                    </div>
                    <Badge 
                      variant={deadlineInfo.status === "overdue" ? "destructive" : 
                              deadlineInfo.status === "upcoming" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {deadlineInfo.status === "overdue" ? `${deadlineInfo.days}d overdue` :
                       deadlineInfo.status === "upcoming" ? `${deadlineInfo.days}d left` :
                      //  new Date(project.deadline).toLocaleDateString()}
                      project.deadline}
                    </Badge>
                  </div>

                  {/* Current Stage */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <StageIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Current Stage</span>
                    </div>
                    <Badge className={getStageColor(project.currentStage)}>
                      {project.currentStage}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-800">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Assigned Team */}
                  {/* <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Team</span>
                      <div className="flex -space-x-2">
                        {project.assignedStaff.map((member) => (
                          <Avatar key={member.id} className="w-6 h-6 border-2 border-white">
                            <AvatarFallback className="text-xs bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </div> */}

                  {/* …inside your component’s return()… */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Team</span>
                        <div className="flex -space-x-2">
                          {JSON.parse(project.assignedTo).map((staffName, idx) => {
                            // Compute initials from the full name, e.g. "John Doe" → "JD"
                            const initials = staffName
                              .split(' ')
                              .map((w) => w.charAt(0).toUpperCase())
                              .join('');

                            return (
                              <Avatar key={idx} className="w-6 h-6 border-2 border-white">
                                <AvatarFallback className="text-xs bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                        </div>
                      </div>
                    </div>


                  {/* Balance */}
                  {project.balanceRemaining > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Balance</span>
                      </div>
                      <span className="text-sm font-medium text-red-600">
                        ₹{project.balanceRemaining.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Services */}
                  {/* <div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.services.slice(0, 2).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          {service}
                        </Badge>
                      ))}
                      {project.services.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                          +{project.services.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div> */}

                  <div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {JSON.parse(project.services)
                        .slice(0, 2)
                        .map((service, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700"
                          >
                            {service}
                          </Badge>
                        ))
                      }
                      {JSON.parse(project.services).length > 2 && (
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                          +{JSON.parse(project.services).length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>


                  {/* Quick Actions */}
                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <Link to={`/project/${project.id}`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </Link>
                     <Link to={`/project-edit/${project.id}`}>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                    </Link>
                  
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAndSortedProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <Link to="/add-project">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </Link>
          </div>
        )}

        {/* Results Summary */}
        {filteredAndSortedProjects.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedProjects.length} of {projects.length} projects
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;
