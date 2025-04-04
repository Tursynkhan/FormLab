import { axiosPrivate } from "../api/axios";
import { User } from "./config";

const loginUser = (data: { email: string; password: string }) => {
  return axiosPrivate({ method: "POST", url: User.login, data });
};

const registerUser=(data:{username:string; email:string; password:string})=>{
  return axiosPrivate({method:"POST",url:User.register,data});
};

const refreshUser=(data:{refreshToken:string})=>{
  return axiosPrivate({method:"POST",url:User.refresh,data});
}
const logoutUser=()=>{
  return axiosPrivate({method:"POST",url:User.logout});
};


export { loginUser, registerUser, refreshUser, logoutUser };