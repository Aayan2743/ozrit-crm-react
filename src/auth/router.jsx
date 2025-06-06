// import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
// export const router=createBrowserRouter([{
//     path:"/",
//     element : <Login />
// }]);



import { createBrowserRouter } from "react-router-dom";
// import Layout from "../Layouts/layout"; // Capitalized
// import About from "../pages/About";
// import Login from "../pages/Login";
// import Home from "../pages/Home";
import {ProtectedRoute} from "../Layouts/ProtectedRoute";
import {PublicRoute} from "../Layouts/PublicRoute";
import Dashboard from "../pages/Dashboard";
import Logout from "../pages/Logout";

import AddCustomer from "../pages/AddCustomer";
import AddProject from "../pages/AddProject";
import ProjectView from "../pages/ProjectView";
import AllProjects from "../pages/AllProjects";
import CustomerList from "../pages/CustomerList";
import CustomerProfile from "../pages/CustomerProfile";
import Calendar from "../pages/Calendar";
import Analytics from "../pages/Analytics";
import ExpenseManagement from "../pages/ExpenseManagement";
import StaffList from "../pages/StaffList";
import StaffProfile from "../pages/StaffProfile";
import InvoiceList from "../pages/InvoiceList";
import InvoiceView from "../pages/InvoiceView";
import AddInvoice from "../pages/AddInvoice";
import NotFound from "../pages/NotFound";
import EditCustomer from "../pages/EditCustomer";


import {list_customers} from '../api/api';



export const router = createBrowserRouter([

{
  element: <PublicRoute />,
  children: [
    {
      path: "/",
      element: <Login />
    }
  ]
},
{
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/customer-list",
        element: <CustomerList />,
          loader:list_customers
      },
      {
        path: "/add-customer",
        element: <AddCustomer />,
      
      },

       {
        path: "/customer/:id",
        element: <CustomerProfile />,
      
      },

      {
        path: "/edit-customer/:id",
        element: <EditCustomer />,
      
      },
       {
        path: "/add-project",
        element: <AddProject />,
      
      },

       {
        path: "/list-projects",
        element: <AllProjects />,
      
      },

       {
        path: "/project/:id",
        element: <ProjectView />,
      
      },


       {
        path: "/logout",
        element: <Logout />
      }
    ]
  }
  
]);
