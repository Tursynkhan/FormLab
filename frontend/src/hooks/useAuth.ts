import { useContext,useState,useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { User } from "../context/AuthProvider";

const useAuth = () => {
    const context = useContext(AuthContext);
    const { setAuth } = context;
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const token = Cookies.get("accessToken"); 
    
        if (token) {
            setAccessToken(token);
            setAuth(prev => ({
                ...prev,
                accessToken: token,
            }));

            try {
                const decoded = jwtDecode<User>(token); 
                setAuth(prev => ({
                    ...prev,
                    user: decoded, 
                }));
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, [setAuth]);

    return { ...context, accessToken };

};

export default useAuth;
