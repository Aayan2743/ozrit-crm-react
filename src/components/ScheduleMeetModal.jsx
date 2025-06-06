
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Users, Link as LinkIcon, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

const ScheduleMeetModal = ({ isOpen, onClose }) => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [meetTitle, setMeetTitle] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [meetingLink, setMeetingLink] = useState("");

  const customers = [
    { id: 1, name: "TechCorp Solutions" },
    { id: 2, name: "StartupXYZ" },
    { id: 3, name: "DesignStudio" },
    { id: 4, name: "E-commerce Plus" },
  ];

  const teamMembers = [
    { id: 1, name: "John Doe", avatar: "JD" },
    { id: 2, name: "Sarah Smith", avatar: "SS" },
    { id: 3, name: "Mike Johnson", avatar: "MJ" },
    { id: 4, name: "Emily Davis", avatar: "ED" },
  ];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
  ];

  const toggleMember = (member) => {
    setSelectedMembers(prev => 
      prev.find(m => m.id === member.id)
        ? prev.filter(m => m.id !== member.id)
        : [...prev, member]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomer || !date || !time || !meetTitle) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const customerName = customers.find(c => c.id === parseInt(selectedCustomer))?.name;
    const formattedDate = format(date, "MMM dd, yyyy");
    
    toast.success(`Meeting Scheduled with ${customerName} on ${formattedDate} at ${time} 📆`);
    
    // Reset form
    setSelectedCustomer("");
    setDate();
    setTime("");
    setMeetTitle("");
    setSelectedMembers([]);
    setMeetingLink("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-2xl border-0 p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-xl font-bold">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                📅
              </div>
              <span>Let's Schedule a Meet!</span>
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span>Select Customer *</span>
            </label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger className="h-12 rounded-xl border-purple-200 focus:ring-purple-500 focus:border-purple-500">
                <SelectValue placeholder="Choose a customer..." />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-purple-500" />
                <span>Date *</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-12 w-full rounded-xl border-purple-200 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span>Time *</span>
              </label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="h-12 rounded-xl border-purple-200">
                  <SelectValue placeholder="Select time..." />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Meet Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Meet Title / Subject *</label>
            <Input
              value={meetTitle}
              onChange={(e) => setMeetTitle(e.target.value)}
              placeholder="e.g., Project Discussion, Design Review..."
              className="h-12 rounded-xl border-purple-200 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Team Members */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Add Team Members to Attend</label>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleMember(member)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-xl border-2 transition-all duration-200",
                    selectedMembers.find(m => m.id === member.id)
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 hover:border-purple-300"
                  )}
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {member.avatar}
                  </div>
                  <span className="text-sm">{member.name}</span>
                </button>
              ))}
            </div>
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedMembers.map((member) => (
                  <Badge key={member.id} variant="secondary" className="bg-purple-100 text-purple-700">
                    {member.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Meeting Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <LinkIcon className="h-4 w-4 text-purple-500" />
              <span>Meeting Link (Optional)</span>
            </label>
            <Input
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://zoom.us/j/123456789 or Google Meet link..."
              className="h-12 rounded-xl border-purple-200 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium shadow-lg"
            >
              Save Meet 📅
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeetModal;
