import axios from "axios";
import Swal from "sweetalert2";

const api=axios.create({
   //  baseURL:'http://192.168.80.42:8000/api',
    baseURL:'http://192.168.31.56:8000/api',
     headers: {
        //  "Content-Type": "application/json",
   
        },
})


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // check key name
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);




api.interceptors.response.use(
  (response) => response,
  (error) => {
  
    if (error.response?.status == 401) {
  
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_details");

    
      window.location.href = "/";

    }

    return Promise.reject(error);
  }
);




export const loginWeb= async (payload)=>{
     const response= await api.post('web-login',payload);
     return response;
}

export const customer_store= async (payload)=>{
     const response= await api.post('admin/add-customer',payload);
     return response;
}


export const list_customers= async ()=>{
     const response= await api.get('admin/list-customer');
     return response;
}


export const delete_customer= async (id)=>{
     const response= await api.delete(`admin/delete-customer/${id}`);
     return response;
}

export const list_customer= async (id)=>{
     const response= await api.get(`admin/list-customer/${id}`);
     return response;
} 

export function customer_update(payload) {


   return api.put(`admin/customer-update/${payload.id}`, payload);
}

export function add_project(payload) {

   return api.post('admin/add-project', payload);
}
export const list_projects= async ()=>{
     const response= await api.get('admin/list-project');
     return response;
}

export const list_project= async (id)=>{
 
     const response= await api.get(`admin/list-project/${id}`);
     return response;
}

export function update_stage(payload) {
   return api.put(`admin/projects-domain-update/${payload.id}`, payload);
}


export function update_hosting_stage(payload) {
   return api.put(`admin/projects-hosting-update/${payload.id}`, payload);
}

export function update_design_stage(payload) {
   return api.put(`admin/projects-design-update/${payload.id}`, payload);
}

export function update_live_stage(payload) {
   return api.put(`admin/projects-live-update/${payload.id}`, payload);
}

export function update_balance_stage(payload) {
   return api.put(`admin/projects-balance-update/${payload.id}`, payload);
}


export function update_stage_update(payload) {
   return api.put(`admin/projects-stage-update/${payload.id}`, payload);
}


export function update_document(payload) {
   return api.post(`admin/project-document`, payload);
}

export const delete_document= async (id)=>{
     const response= await api.delete(`admin/project-document-delete/${id}`);
     return response;
}

export const get_all_salesTeam= async (id)=>{
     const response= await api.get('admin/list-staff');
     return response;
}

export function update_project(payload,id) {
   return api.put(`admin/update-project/${id}`, payload);
}
//update_project
// rojects-stage-update





    // Route::put('/projects-hosting-update/{id}',      [ProjectController::class, 'updateHosting']);
    // Route::put('/projects-design-update/{id}',      [ProjectController::class, 'updateDesign']);
    // Route::put('/projects-live-update/{id}',      [ProjectController::class, 'updateMadeLive']);
    // Route::put('/projects-balance-update/{id}',      [ProjectController::class, 'updateBalanceAsked']);




export default api;