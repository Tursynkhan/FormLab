import { log } from "console";
import { BASE_URL } from "../api/axios";

const userUrl=`${BASE_URL}/auth`;
const formUrl=`${BASE_URL}/form`;

const User={
  login: `${userUrl}/login`,
  register: `${userUrl}/register`,
  refresh: `${userUrl}/refresh`,
  logout: `${userUrl}/logout`,
}

export {  User, userUrl, formUrl} 
