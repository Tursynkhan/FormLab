import axios from '../api/axios';
import useAuth from './useAuth';

const API_URL = import.meta.env.VITE_API_URL;

interface RefreshResponse {
    accessToken: string;
}

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async (): Promise<string> => {
        try{
            const response = await axios.post<RefreshResponse>(`${API_URL}/auth/refresh`, {},{
                withCredentials: true
            });
            console.log('Refreshed token:', response.data.accessToken);
            setAuth(prev => ({
                ...prev,
                accessToken: response.data.accessToken
            }));
            
            return response.data.accessToken;
        }catch (error) {
            console.error('Error refreshing token:', error);
            throw new Error('Unable to refresh token');
        }
    }
    
    return refresh;
};

export default useRefreshToken;