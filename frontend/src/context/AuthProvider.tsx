import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
interface AuthData {
    accessToken?: string | null;
    refreshToken?: string | null;
    user?: User | null;
}
const initialAuthState: AuthData = {
    accessToken: null,
    refreshToken: null,
    user: null,
  };
export interface User {
    username: string;
    role: string;
    id: string;
}

interface AuthContextType {
    auth: AuthData;
    setAuth: Dispatch<SetStateAction<AuthData>>;

}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthData>(initialAuthState);
    useEffect(() => {
        console.log('Auth state updated:', auth);
    }, [auth]);
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;