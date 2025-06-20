import axios from "axios";
import Swal from "sweetalert2";

const api=axios.create({
    baseURL:'http://192.168.80.42:8000/api',
   //  baseURL:'https://apicrm.ozrit.com/public/api',
   //  baseURL:'http://192.168.31.56:8000/api',
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



export const list_project_by_customer_id=async(id)=>{
    const response= await api.get(`admin/list-project-by-customer-id/${id}`);
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

export function update_project(formData) {
   return api.post(`admin/project-update`, formData);
}


export function create_staff(payload){
   return api.post('admin/create-staff',payload);
}

export function get_all_staffs(){
   return api.get(`admin/all-staff`);
}

export function get_all_staff(id){
   return api.get(`admin/all-staff/${id}`);
}

export function update_staff(payload){
   return api.post('admin/update-staff',payload);
}

export function delete_staff(payload){
   return api.delete(`admin/delete-staff/${payload}`);
}

export function create_task(payload){
   return api.post('admin/create-task',payload);
}

export function list_all_calender(){
   return api.get('admin/list-all-calender');
}

export function create_meeting(payload){
   return api.post('admin/create-meeting',payload);
}

export function create_invoice(payload){
   return api.post('admin/create-invoice',payload);
}


export function list_invoice(){
   return api.get('admin/list-invoice');
}

export function list_invoice_id(id){
   return api.get(`admin/list-invoice/${id}`);
}


export function list_invoice_ids(id){
   return api.get(`admin/list-invoices/${id}`);
}


export function create_payment(formData) {

  return api.post('admin/create-payment', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function invoices_update(id,payload){
   return api.put(`admin/invoices-update/${id}`,payload);
}


export function create_expanses(payload){
   return api.post('admin/create-expanses',payload);
}

export function list_expanses(){
   return api.get('admin/list-expanses');
}

export function analyticss(){
   return api.get('admin/analytics');
}

export function getOverview(){
   return api.get('admin/getOverview');
}

export function project_status_update(payload){
   return api.post('admin/project-status-update',payload);
}



//project-status-update




//list-expanses

//create-expanses
//invoices-update
//create-invoice
//create-meeting
//list-all-calender
//create-task

//delete-staff

//update-staff
//update_project
// rojects-stage-update





    // Route::put('/projects-hosting-update/{id}',      [ProjectController::class, 'updateHosting']);
    // Route::put('/projects-design-update/{id}',      [ProjectController::class, 'updateDesign']);
    // Route::put('/projects-live-update/{id}',      [ProjectController::class, 'updateMadeLive']);
    // Route::put('/projects-balance-update/{id}',      [ProjectController::class, 'updateBalanceAsked']);




export default api;