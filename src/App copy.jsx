
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddCustomer from "./pages/AddCustomer";
import AddProject from "./pages/AddProject";
import ProjectView from "./pages/ProjectView";
import AllProjects from "./pages/AllProjects";
import CustomerList from "./pages/CustomerList";
import CustomerProfile from "./pages/CustomerProfile";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import ExpenseManagement from "./pages/ExpenseManagement";
import StaffList from "./pages/StaffList";
import StaffProfile from "./pages/StaffProfile";
import InvoiceList from "./pages/InvoiceList";
import InvoiceView from "./pages/InvoiceView";
import AddInvoice from "./pages/AddInvoice";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/project/:id" element={<ProjectView />} />
          <Route path="/all-projects" element={<AllProjects />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customer/:id" element={<CustomerProfile />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/invoice/:id" element={<InvoiceView />} />
          <Route path="/add-invoice" element={<AddInvoice />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/staff" element={<StaffList />} />
          <Route path="/staff/:id" element={<StaffProfile />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/expenses" element={<ExpenseManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
