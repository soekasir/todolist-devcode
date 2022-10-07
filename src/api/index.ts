import axios from "axios";
import { EMAIL_ACCOUNT_API, URL_API } from "../references/constants/env";

export enum Priority{
  VeryHigh="very-high",
  High="high",
  Medium="medium",
  Low="low",
  VeryLow="very-low",
}

export interface ActivityDto {
  id: number,
  title: string,
  created_at: string,
}

export interface CreateTodoDto{
  activity_group_id : number,
  title : string,
  priority : Priority,
}

export interface TodoDto extends CreateTodoDto{
  id : number,
  is_active : number,
  created_at : string,
}
/** Activity */
export function apiGetAllActivity(){
  return axios.get(URL_API+'activity-groups/?email='+EMAIL_ACCOUNT_API).then((res)=>res.data.data as ActivityDto[]) 
}

export function apiGetActivity(id:number|string){
  return axios.get(URL_API+'activity-groups/'+id).then((res)=>res.data as ActivityDto) 
}

export function apiDeleteActivity(id:number){
  return axios.delete(URL_API+'activity-groups/'+id)
}

export function apiCreateActivity(data:any){
  const addedEmail={...data,email:EMAIL_ACCOUNT_API}
  return axios.post(URL_API+'activity-groups',addedEmail).then((res)=>res.data.data as ActivityDto) 
}

/** Item Todo */
export function apiGetAllToDo(id:number|string){
  return axios.get(URL_API+'todo-items?activity_group_id='+id).then((res)=>res.data.data as TodoDto[]) 
}


export function apiDeleteItem(id:number,){
  return axios.delete(URL_API+'todo-items/'+id)
}

export function apiCreateItem(data:CreateTodoDto){
  return axios.post(URL_API+'todo-items/',data)
}

export function apiUpdateItem(id:number,data:any){
  return axios.patch(URL_API+'todo-items/'+id,data)
}