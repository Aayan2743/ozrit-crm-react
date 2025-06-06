import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import ScheduleMeetModal from "@/components/ScheduleMeetModal";
import AddTodoModal from "@/components/AddTodoModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";


import { 
  Users, 
  Briefcase, 
  Play, 
  DollarSign, 
  Clock, 
  Calendar,
  CheckSquare,
  Plus,
  TrendingUp,
  AlertCircle,
  Star,
  Activity
} from "lucide-react";

const Dashboard = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: "Review client proposal for TechCorp", completed: false, priority: "high" },
    { id: 2, text: "Design mockups for new landing page", completed: true, priority: "medium" },
    { id: 3, text: "Call meeting with startup client", completed: false, priority: "high" },
    { id: 4, text: "Update portfolio website", completed: false, priority: "low" },
  ]);

  const [greeting, setGreeting] = useState("");
  const [user, setUserDetails] = useState('');
  const [showScheduleMeetModal, setShowScheduleMeetModal] = useState(false);
  const [showAddTodoModal, setShowAddTodoModal] = useState(false);

  useEffect(() => {

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
    
  const userString = localStorage.getItem('user_details');
  if (userString) {
    setUserDetails(JSON.parse(userString));
  }


    // const name = JSON.parse(localStorage.getItem('user_details') || '[]');
  }, []);

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const metrics = [
    { title: "Total Customers", value: "127", icon: Users, color: "bg-blue-500", trend: "+12%" },
    { title: "Total Projects", value: "89", icon: Briefcase, color: "bg-green-500", trend: "+8%" },
    { title: "Active Projects", value: "23", icon: Play, color: "bg-purple-500", trend: "+15%" },
    { title: "Pending Balance", value: "$24.5K", icon: DollarSign, color: "bg-yellow-500", trend: "+22%" },
  ];

  const secondaryMetrics = [
    { title: "Near Deadline", value: "5", icon: Clock, color: "text-red-500" },
    { title: "Meetings Today", value: "4", icon: Calendar, color: "text-blue-500" },
    { title: "Today's Tasks", value: todos.filter(t => !t.completed).length, icon: CheckSquare, color: "text-purple-500" },
  ];

  const recentActivity = [
    { action: "New customer added", client: "TechCorp Solutions", time: "2 hours ago", type: "customer" },
    { action: "Project completed", client: "StartupXYZ", time: "4 hours ago", type: "project" },
    { action: "Payment received", client: "DesignStudio", time: "6 hours ago", type: "payment" },
    { action: "Meeting scheduled", client: "E-commerce Plus", time: "1 day ago", type: "meeting" },
  ];

  const recentCustomers = [
    { name: "TechCorp Solutions", email: "contact@techcorp.com", projects: 3, status: "active" },
    { name: "StartupXYZ", email: "hello@startupxyz.com", projects: 1, status: "new" },
    { name: "DesignStudio", email: "info@designstudio.co", projects: 5, status: "active" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Sidebar />
      
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {greeting}, {'asof'} 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Let's make today productive and creative
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link to="/add-customer">
              <Button className="w-full h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 flex-col space-y-1">
                <Plus className="h-5 w-5" />
                <span className="text-sm">Add Customer</span>
              </Button>
            </Link>
            <Link to="/add-project">
              <Button className="w-full h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex-col space-y-1">
                <Briefcase className="h-5 w-5" />
                <span className="text-sm">Add Project</span>
              </Button>
            </Link>
            <Button 
              onClick={() => setShowScheduleMeetModal(true)}
              className="w-full h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex-col space-y-1"
            >
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Schedule Meet</span>
            </Button>
            <Button 
              onClick={() => setShowAddTodoModal(true)}
              className="w-full h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 flex-col space-y-1"
            >
              <CheckSquare className="h-5 w-5" />
              <span className="text-sm">Add To-Do</span>
            </Button>
          </div>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500 font-medium">{metric.trend}</span>
                      </div>
                    </div>
                    <div className={`${metric.color} p-3 rounded-full`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {secondaryMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="bg-white shadow-md border-0">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                    <div>
                      <p className="text-sm text-gray-600">{metric.title}</p>
                      <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Today's Timeline & Tasks */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Today's To-Dos */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckSquare className="h-5 w-5 text-purple-500" />
                  <span>Today's To-Dos</span>
                  <Badge variant="secondary" className="ml-auto">
                    {todos.filter(t => !t.completed).length} pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todos.map((todo) => (
                  <div key={todo.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    />
                    <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {todo.text}
                    </span>
                    <Badge 
                      variant={todo.priority === 'high' ? 'destructive' : todo.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {todo.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'customer' ? 'bg-green-500' :
                      activity.type === 'project' ? 'bg-blue-500' :
                      activity.type === 'payment' ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.client}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
            
            {/* Recent Customers */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <span>Recent Customers</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{customer.name}</p>
                      <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-600">{customer.projects} projects</span>
                        <Badge 
                          variant={customer.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {customer.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                <Link to="/customers">
                  <Button variant="outline" className="w-full mt-4 text-purple-600 border-purple-200 hover:bg-purple-50">
                    View All Customers
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Urgent Deadlines */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span>Urgent Deadlines</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <p className="text-sm font-medium text-red-800">TechCorp Website</p>
                  <p className="text-xs text-red-600">Due tomorrow</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-sm font-medium text-yellow-800">StartupXYZ Logo</p>
                  <p className="text-xs text-yellow-600">Due in 3 days</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <p className="text-sm font-medium text-orange-800">E-commerce Setup</p>
                  <p className="text-xs text-orange-600">Due in 5 days</p>
                </div>
              </CardContent>
            </Card>

            {/* Finance Summary */}
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>This Month</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-100">Revenue</span>
                  <span className="font-bold text-lg">$45,280</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-100">Pending</span>
                  <span className="font-bold text-lg">$24,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-100">New Clients</span>
                  <span className="font-bold text-lg">12</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ScheduleMeetModal 
        isOpen={showScheduleMeetModal} 
        onClose={() => setShowScheduleMeetModal(false)} 
      />
      <AddTodoModal 
        isOpen={showAddTodoModal} 
        onClose={() => setShowAddTodoModal(false)} 
      />
    </div>
  );
};

export default Dashboard;
