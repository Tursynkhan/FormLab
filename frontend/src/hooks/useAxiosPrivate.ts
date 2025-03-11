import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import Cookies from "js-cookie";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth,accessToken } = useAuth();

    useEffect(() => {

        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = accessToken || Cookies.get("accessToken");
                if (token) {
                    if (!config.headers) {
                        config.headers = {};
                    }
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );


        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    try {
                        const newAccessToken = await refresh();
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);
                    } catch (refreshError) {
                        console.error('Token refresh failed', refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestInterceptor);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh,accessToken])

    return axiosPrivate;
}

export default useAxiosPrivate;
