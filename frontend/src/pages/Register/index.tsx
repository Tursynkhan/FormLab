import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from "./Register.module.scss"
import Input from "../../components/Input"

interface IRegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface IRegisterResponse {
  message: string;
}

function isAxiosError(error: unknown): error is { response?: { data?: unknown } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}
const API_URL = import.meta.env.VITE_API_URL;

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<IRegisterForm>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IRegisterForm> = async (data) => {
    try {
      const payload = {
        username: data.username,
        email: data.email,
        passwordHash: data.password,
      };
      const response = await axios.post<IRegisterResponse>(`${API_URL}/auth/register`, payload);
      console.log('Registration successful:', response.data);
      navigate('/login');
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
        <span>Sign Up</span>
      </div>
      <div className={styles.container}>
        <div>
          <div className={styles.field}>
            <label>Username</label>
            <Input
              placeholder="Enter username"
              {...register("username", {
                required: {
                  value: true,
                  message: "Please enter username",
                },
                pattern: {
                  value: /^[A-Za-z ]+$/,
                  message: "Username should contain alphabets only",
                },
                minLength: {
                  value: 3,
                  message: "Username should contain atleast 3 characters",
                },
              })}
            />
          </div>
          {errors?.username && (
            <span className={styles.error_msg}>{errors.username.message}</span>
          )}
        </div>
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
                pattern: {
                  value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
                  message:
                    "Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters",
                },
              })}
            />
          </div>
          {errors?.password && (
            <span className={styles.error_msg}>{errors.password.message}</span>
          )}
        </div>
        <div>
          <div className={styles.field}>
            <label>Confirm Password</label>
            <Input
              type="password"
              placeholder="Repeat password"
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "Please enter confirm password",
                },
                validate: (val) => val === getValues("password") || "Confirm password should match with password",
              })}
            />
          </div>
          {errors?.confirmPassword && (
            <span className={styles.error_msg}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        <div className={styles.cta}>
          <button type='submit'>Register</button>
        </div>
      </div>
    </form>
  );
};

export default RegisterPage;
