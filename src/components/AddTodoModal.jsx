
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Target, AlertCircle, User, Briefcase, Brain } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

import {list_customers,list_projects,get_all_staffs,create_task} from '../api/api';

const AddTodoModal = ({ isOpen, onClose }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState();
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedToName, setAssignedToName] = useState("");
  const [linkedProject, setLinkedProject] = useState("");
  const [linkedProjectName, setLinkedProjectName] = useState("");
  const [linkedCustomer, setLinkedCustomer] = useState("");
  const [description, setDescription] = useState("");
  const [staff, setstaff] = useState([]);
  const [projects, setprojects] = useState([]);


  const get_staff=async()=>{
     const staff=await get_all_staffs()
  
     setstaff(staff.data.data);
     
  }

   const get_projects=async()=>{
     const projects=await list_projects()
     console.log("my projects",projects.data.data);

      const projectsSummary = projects.data.data.map(({ id, projectTitle }) => ({ id, projectTitle }));

      setprojects(projectsSummary);  
     console.log("my projects (id & title):", projects1);
  }


  useEffect(()=>{
    get_staff();
    get_projects();

  },[])


  const priorities = [
    { value: "low", label: "Low Priority", color: "bg-green-100 text-green-700", emoji: "🟢" },
    { value: "medium", label: "Medium Priority", color: "bg-yellow-100 text-yellow-700", emoji: "🟡" },
    { value: "high", label: "High Priority", color: "bg-red-100 text-red-700", emoji: "🔴" },
  ];

  const staff1 = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Sarah Smith" },
    { id: 3, name: "Mike Johnson" },
    { id: 4, name: "Emily Davis" },
  ];

  const customers = [
    { id: 1, name: "TechCorp Solutions" },
    { id: 2, name: "StartupXYZ" },
    { id: 3, name: "DesignStudio" },
    { id: 4, name: "E-commerce Plus" },
  ];

  const projects1 = [
    { id: 1, name: "TechCorp Website Redesign" },
    { id: 2, name: "StartupXYZ Mobile App" },
    { id: 3, name: "DesignStudio Portfolio" },
    { id: 4, name: "E-commerce Store Setup" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();


     const payload = {
          type:"task",
          title:       taskTitle,
          
         dueDate : dueDate.replace("T", " ").split(".")[0],
          priority,    // e.g. "High"
          assignedTo,  // optional
          assignedToName,
          linkedProject,
          linkedProjectName,
          linkedCustomer,
          description,
     };

     console.log("payload",payload);

     const add_task=async()=>{
         const add_task=await create_task(payload);
        console.log("api log",add_task);
     }

     try{
      add_task()

     }catch(err){

     }finally{

     } 


    if (!taskTitle || !dueDate || !priority) {
      toast.error("Please fill in all required fields!");
      return;
    }



    toast.success("Task added to your list – Don't miss it 💪");
    
    // Reset form
    // setTaskTitle("");
    // setDueDate();
    // setPriority("");
    // setAssignedTo("");
    // setLinkedProject("");
    // setLinkedCustomer("");
    // setDescription("");
    // onClose();
  };

  const selectedPriority = priorities.find(p => p.value === priority);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-2xl border-0 p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-xl font-bold">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                ✅
              </div>
              <span>New Task To Conquer</span>
              <Brain className="h-5 w-5 text-yellow-300" />
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Task Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Target className="h-4 w-4 text-green-500" />
              <span>Task Title *</span>
            </label>
            <Input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="h-12 rounded-xl border-green-200 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Due Date and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-green-500" />
                <span>Due Date *</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-12 w-full rounded-xl border-green-200 justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    {dueDate ? format(dueDate, "PPP") : <span>Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    // selected={dueDate}
                    selected={dueDate ? new Date(dueDate) : undefined}
                    onSelect={(date) => {
                      // date is a JS Date object; to SQL-date:
                      const sqlDate = date.toISOString().split("T")[0]; // "YYYY-MM-DD"
                      setDueDate(sqlDate);
                    }}



                    // onSelect={setDueDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-green-500" />
                <span>Priority *</span>
              </label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="h-12 rounded-xl border-green-200">
                  <SelectValue placeholder="Set priority..." />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <div className="flex items-center space-x-2">
                        <span>{p.emoji}</span>
                        <span>{p.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPriority && (
                <Badge className={cn("text-xs", selectedPriority.color)}>
                  {selectedPriority.emoji} {selectedPriority.label}
                </Badge>
              )}
            </div>
          </div>

          {/* Assign To */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <User className="h-4 w-4 text-green-500" />
              <span>Assign To</span>
            </label>
            {/* <Select value={assignedTo} onValueChange={setAssignedTo}> */}
            <Select value={assignedTo} onValueChange={(val)=>{
                setAssignedTo(val);
                const memberName=staff.find(m=>m.id.toString()===val);

               setAssignedToName(memberName?.name || "dfsdf");
            }}>
              <SelectTrigger className="h-12 rounded-xl border-green-200">
                <SelectValue placeholder="Choose team member..." />
              </SelectTrigger>
              <SelectContent>
                {staff.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Link to Customer or Project */}
          <div className="grid grid-cols-1 gap-4">
          
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-green-500" />
                <span>Link to Project</span>
              </label>
        

         <Select
            value={linkedProject}
            onValueChange={(val) => {
              setLinkedProject(val);
              const proj = projects.find(p => p.id.toString() === val);
              setLinkedProjectName(proj?.projectTitle || "");
            }}
>
                <SelectTrigger className="h-10 rounded-lg border-green-200">
                  <SelectValue placeholder="Select project..." />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.projectTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>



              {/* <Select value={linkedProject} onValueChange={setLinkedProject}>
                <SelectTrigger className="h-10 rounded-lg border-green-200">
                  <SelectValue placeholder="Select project..." />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.projectTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional details..."
              className="rounded-xl border-green-200 focus:ring-green-500 focus:border-green-500 resize-none"
              rows={3}
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
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium shadow-lg"
            >
              Add To-Do ✅
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodoModal;
