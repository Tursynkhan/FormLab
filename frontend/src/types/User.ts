export interface User {
  username: string;
  role: string;
  id: string;
}

export interface AuthData {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null ;
}

export interface ILoginResponse {
  accessToken: string;
  username: string;
}