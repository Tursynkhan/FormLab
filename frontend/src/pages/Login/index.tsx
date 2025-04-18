import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from "./Login.module.scss"
import Input from "../../components/Input"
import ApiClient from '../../api/axios';
interface ILoginForm {
  email: string;
  password: string;
}



function isAxiosError(error: unknown): error is { response?: { data?: unknown } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}


const LoginPage: React.FC = () => {
  
  const { register, handleSubmit, formState: { errors } } = useForm<ILoginForm>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
    console.log("Submitting data:", data);
    try {
       ApiClient.loginUser(data);
      navigate('/');
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        console.error('Axios error:', err.response?.data || err);
      } else if (err instanceof Error) {
        console.error('Unexpected error:', err.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.header}>
        <span>Sign In</span>
      </div>
      <div className={styles.container}>
        <div>
          <div className={styles.field}>
            <label>Email</label>
            <Input
              placeholder="Enter email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Please enter email",
                },
                pattern: {
                  value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: "Invalid Email",
                },
              })}
            />
          </div>
          {errors?.email && (
            <span className={styles.error_msg}>{errors.email.message}</span>
          )}
        </div>
        <div>
          <div className={styles.field}>
            <label>Password</label>
            <Input
              type="password"
              placeholder="Enter password"
              {...register("password", {
                required: { value: true, message: "Please enter password" },
              })}
            />
          </div>
          {errors?.password && (
            <span className={styles.error_msg}>{errors.password.message}</span>
          )}
        </div>
        <div className={styles.cta}>
          <button type='submit'>Login</button>
          <span>
            Dont't have an account ? &nbsp;
            <span onClick={() => navigate("/auth/register")}>Sign Up Here</span>
          </span>
        </div>
      </div>
    </form>
  );
};

export default LoginPage;

