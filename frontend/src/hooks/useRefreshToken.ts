import axios from '../api/axios';
import useAuth from './useAuth';
import { AuthState } from '../context/AuthProvider';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get<{ accessToken: string }>('/refresh', {
            withCredentials: true
        });
        setAuth((prev:AuthState | null) => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return { ...prev, accessToken: response.data.accessToken }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;