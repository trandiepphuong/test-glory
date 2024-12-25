import { axiosInstance } from "@/config/axiosInstance";
import { SignIn, SignUp } from "@/types/auth";
import { User } from "@/types/user";

const AUTH_API_PREFIX = "/auth";


export const signIn = (data: SignIn): Promise<{ accessToken: string, refreshToken: string }> => {
    return axiosInstance.post(`${AUTH_API_PREFIX}/sign-in`, data);
}

export const signUp = (data: SignUp): Promise<string> => {
    return axiosInstance.post(`${AUTH_API_PREFIX}/sign-up`, data);
}

export const getUserInformation = (): Promise<User> => {
    return axiosInstance.get(`${AUTH_API_PREFIX}/user-information`);
}

export const refreshToken = (refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> => {
    return axiosInstance.put(`${AUTH_API_PREFIX}/refresh-token`, { refreshToken });
}