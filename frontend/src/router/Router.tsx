import {  useRoutes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import AuthLayout from "../layouts/AuthLayout";
const Routes = () => {  
  const routes = useRoutes([
    {
      path: '/',
      element: <HomePage />
    },  
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
      ],
    },
    { path: '/register', element: <RegisterPage /> },
  ]);
  return routes;
}
export default Routes;