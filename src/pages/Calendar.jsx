import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Phone,
  Video,
  Users,
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter,
  Target
} from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [selectedFilters, setSelectedFilters] = useState({
    all: true,
    meetings: true,
    deadlines: true,
    overdue: true,
    tasks: true
  });
  const [events, setEvents] = useState([]);

  // Enhanced mock data for calendar events
  useEffect(() => {
    const today = new Date();
    const mockEvents = [
      // Client Meetings
      {
        id: 1,
        type: "meeting",
        title: "Design Review with TechStart",
        customer: "TechStart Inc",
        date: new Date(today.getFullYear(), today.getMonth(), 15, 14, 0),
        meetingType: "zoom",
        status: "scheduled",
        staff: ["John", "Sarah"],
        notes: "Review wireframes and discuss revisions",
        zoomLink: "https://zoom.us/j/123456789"
      },
      {
        id: 2,
        type: "meeting",
        title: "Client Onboarding Call",
        customer: "StartUp X",
        date: new Date(today.getFullYear(), today.getMonth(), 20, 10, 30),
        meetingType: "phone",
        status: "scheduled",
        staff: ["Lisa"],
        notes: "Initial project discussion and requirements gathering"
      },
      {
        id: 3,
        type: "meeting",
        title: "Final Presentation",
        customer: "Fashion Co",
        date: new Date(today.getFullYear(), today.getMonth(), 25, 15, 0),
        meetingType: "zoom",
        status: "scheduled",
        staff: ["Mike", "John"],
        notes: "Present final website design and go live",
        zoomLink: "https://zoom.us/j/987654321"
      },
      {
        id: 4,
        type: "meeting",
        title: "Project Kickoff",
        customer: "Local Restaurant",
        date: new Date(today.getFullYear(), today.getMonth(), 12, 11, 0),
        meetingType: "in-person",
        status: "completed",
        staff: ["Sarah", "Tom"],
        notes: "Successful kickoff meeting - client very excited!"
      },

      // Project Deadlines
      {
        id: 5,
        type: "deadline",
        title: "E-commerce Website - Design Phase",
        project: "E-commerce Website",
        customer: "Fashion Co",
        date: new Date(today.getFullYear(), today.getMonth(), 18),
        urgency: "upcoming",
        stage: "Design"
      },
      {
        id: 6,
        type: "deadline",
        title: "Corporate Website - Development",
        project: "Corporate Website",
        customer: "Business Corp",
        date: new Date(today.getFullYear(), today.getMonth(), 22),
        urgency: "upcoming",
        stage: "Development"
      },
      {
        id: 7,
        type: "deadline",
        title: "Portfolio Website - Testing",
        project: "Portfolio Website",
        customer: "Creative Studio",
        date: new Date(today.getFullYear(), today.getMonth(), 28),
        urgency: "upcoming",
        stage: "Testing"
      },
      {
        id: 8,
        type: "deadline",
        title: "Restaurant Website - Go Live",
        project: "Restaurant Website",
        customer: "Local Restaurant",
        date: new Date(today.getFullYear(), today.getMonth(), 30),
        urgency: "near",
        stage: "Launch"
      },

      // Overdue Projects
      {
        id: 9,
        type: "overdue",
        title: "Corporate Website - Hosting Setup",
        project: "Corporate Website",
        customer: "Business Corp",
        date: new Date(today.getFullYear(), today.getMonth(), 10),
        delayedStage: "Hosting not assigned",
        daysOverdue: 5
      },
      {
        id: 10,
        type: "overdue",
        title: "Blog Website - Content Upload",
        project: "Blog Website",
        customer: "Content Creator",
        date: new Date(today.getFullYear(), today.getMonth(), 8),
        delayedStage: "Client content not provided",
        daysOverdue: 7
      },
      {
        id: 11,
        type: "overdue",
        title: "Startup Website - Payment Pending",
        project: "Startup Website",
        customer: "Tech Startup",
        date: new Date(today.getFullYear(), today.getMonth(), 5),
        delayedStage: "Payment not received",
        daysOverdue: 10
      },

      // Tasks
      {
        id: 12,
        type: "task",
        title: "Upload client content",
        assignedTo: "Mike",
        date: new Date(today.getFullYear(), today.getMonth(), 16),
        status: "pending",
        project: "Portfolio Website"
      },
      {
        id: 13,
        type: "task",
        title: "Setup SSL certificate",
        assignedTo: "Tom",
        date: new Date(today.getFullYear(), today.getMonth(), 19),
        status: "pending",
        project: "E-commerce Website"
      },
      {
        id: 14,
        type: "task",
        title: "Client feedback review",
        assignedTo: "Sarah",
        date: new Date(today.getFullYear(), today.getMonth(), 17),
        status: "completed",
        project: "Corporate Website"
      },
      {
        id: 15,
        type: "task",
        title: "SEO optimization",
        assignedTo: "Lisa",
        date: new Date(today.getFullYear(), today.getMonth(), 24),
        status: "pending",
        project: "Restaurant Website"
      },
      {
        id: 16,
        type: "task",
        title: "Mobile responsive testing",
        assignedTo: "John",
        date: new Date(today.getFullYear(), today.getMonth(), 21),
        status: "pending",
        project: "Fashion Co Website"
      },

      // Additional events for different days
      {
        id: 17,
        type: "meeting",
        title: "Strategy Meeting",
        customer: "Tech Startup",
        date: new Date(today.getFullYear(), today.getMonth(), 14, 9, 0),
        meetingType: "zoom",
        status: "scheduled",
        staff: ["Mike", "Lisa"],
        notes: "Discuss project roadmap and timeline",
        zoomLink: "https://zoom.us/j/555666777"
      },
      {
        id: 18,
        type: "task",
        title: "Domain setup",
        assignedTo: "Tom",
        date: new Date(today.getFullYear(), today.getMonth(), 13),
        status: "completed",
        project: "Blog Website"
      },
      {
        id: 19,
        type: "deadline",
        title: "Logo Design - First Draft",
        project: "Branding Package",
        customer: "New Client",
        date: new Date(today.getFullYear(), today.getMonth(), 26),
        urgency: "upcoming",
        stage: "Design"
      },
      {
        id: 20,
        type: "meeting",
        title: "Weekly Team Standup",
        customer: "Internal",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        meetingType: "in-person",
        status: "scheduled",
        staff: ["All Team"],
        notes: "Weekly progress update and planning"
      }
    ];
    setEvents(mockEvents);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    }).filter(event => selectedFilters[event.type] || selectedFilters.all);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventColor = (event) => {
    switch (event.type) {
      case "meeting":
        return "bg-blue-500";
      case "deadline":
        if (event.urgency === "overdue") return "bg-red-500";
        if (event.urgency === "near") return "bg-orange-500";
        return "bg-green-500";
      case "overdue":
        return "bg-red-500";
      case "task":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEventIcon = (event) => {
    switch (event.type) {
      case "meeting":
        if (event.meetingType === "zoom") return <Video className="h-3 w-3" />;
        if (event.meetingType === "phone") return <Phone className="h-3 w-3" />;
        return <Users className="h-3 w-3" />;
      case "deadline":
        return <Target className="h-3 w-3" />;
      case "overdue":
        return <AlertTriangle className="h-3 w-3" />;
      case "task":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <CalendarIcon className="h-3 w-3" />;
    }
  };

  const EventCard = ({ event }) => (
    <Card className="p-3 shadow-lg border-l-4" style={{ borderLeftColor: getEventColor(event).replace('bg-', '#') }}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded-full text-white ${getEventColor(event)}`}>
              {getEventIcon(event)}
            </div>
            <div>
              <h4 className="font-semibold text-sm">{event.title}</h4>
              {event.customer && (
                <p className="text-xs text-gray-600">{event.customer}</p>
              )}
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {event.type}
          </Badge>
        </div>

        {event.type === "meeting" && (
          <div className="space-y-1 text-xs text-gray-600">
            <p>📅 {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p>👥 Staff: {event.staff.join(", ")}</p>
            {event.notes && <p>📝 {event.notes}</p>}
            {event.zoomLink && (
              <Button size="sm" className="mt-2 h-6 text-xs">
                Join Meeting
              </Button>
            )}
          </div>
        )}

        {event.type === "deadline" && (
          <div className="space-y-1 text-xs text-gray-600">
            <p>🎯 Project: {event.project}</p>
            <p>📊 Stage: {event.stage}</p>
            <Badge variant={event.urgency === "upcoming" ? "default" : "destructive"} className="text-xs">
              {event.urgency}
            </Badge>
          </div>
        )}

        {event.type === "overdue" && (
          <div className="space-y-1 text-xs text-gray-600">
            <p>⚠️ {event.delayedStage}</p>
            <p>📅 {event.daysOverdue} days overdue</p>
            <div className="flex space-x-2 mt-2">
              <Button size="sm" variant="outline" className="h-6 text-xs">
                Escalate
              </Button>
              <Button size="sm" variant="outline" className="h-6 text-xs">
                Follow-up
              </Button>
            </div>
          </div>
        )}

        {event.type === "task" && (
          <div className="space-y-1 text-xs text-gray-600">
            <p>👤 Assigned: {event.assignedTo}</p>
            <p>📁 Project: {event.project}</p>
            <div className="flex space-x-2 mt-2">
              <Button size="sm" variant="outline" className="h-6 text-xs">
                Complete
              </Button>
              <Button size="sm" variant="outline" className="h-6 text-xs">
                Reassign
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const totalEvents = events.filter(e => selectedFilters[e.type] || selectedFilters.all).length;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
              <p className="text-gray-600 mt-1">
                {totalEvents} events {selectedFilters.all ? "total" : "filtered"}
              </p>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={goToToday}
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0"
              >
                Today
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => navigateMonth(-1)}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-lg min-w-[200px] text-center">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <Button
                  onClick={() => navigateMonth(1)}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            {Object.entries(selectedFilters).map(([key, value]) => (
              <Button
                key={key}
                onClick={() => setSelectedFilters(prev => ({ ...prev, [key]: !value }))}
                variant={value ? "default" : "outline"}
                size="sm"
                className={value ? "bg-gradient-to-r from-purple-500 to-purple-600" : ""}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="p-4 text-center font-semibold text-gray-700 border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7" style={{ minHeight: "600px" }}>
              {days.map((day, index) => {
                const dayEvents = day ? getEventsForDate(day) : [];
                const isToday = day && day.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={index}
                    className={`border-r border-b last:border-r-0 p-2 min-h-[120px] ${
                      day ? "bg-white hover:bg-gray-50" : "bg-gray-50"
                    } ${isToday ? "bg-blue-50 border-blue-200" : ""}`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium mb-2 ${isToday ? "text-blue-600 font-bold" : "text-gray-900"}`}>
                          {day.getDate()}
                          {isToday && <span className="ml-1 text-xs">(Today)</span>}
                        </div>
                        
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <Popover key={event.id}>
                              <PopoverTrigger asChild>
                                <div
                                  className={`${getEventColor(event)} text-white text-xs p-1 rounded cursor-pointer hover:opacity-80 flex items-center space-x-1`}
                                >
                                  {getEventIcon(event)}
                                  <span className="truncate">{event.title}</span>
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="w-80" align="start">
                                <EventCard event={event} />
                              </PopoverContent>
                            </Popover>
                          ))}
                          
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500 text-center py-1">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                          
                          {dayEvents.length === 0 && day.toDateString() === new Date().toDateString() && (
                            <div className="text-xs text-gray-400 text-center py-2">
                              No events today! 🎨
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="lg"
                className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Video className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Target className="mr-2 h-4 w-4" />
                  Add Deadline
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Assign Task
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  Add Reminder
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
