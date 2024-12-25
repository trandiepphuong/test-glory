import { getUserInformation, refreshToken, signIn } from '@/services/auth.service';
import type { SignIn } from '@/types/auth';
import { User } from '@/types/user';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignIn>({
        defaultValues: {
            phone: '',
            password: ''
        }
    });
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null)
    const [refreshTokenState, setRefreshTokenState] = useState<string | null>(null);
    const formOnSubmit = handleSubmit((formData) => {
        handleSignIn(formData);
    });
    const [user, setUser] = useState<User | null>(null)
    const handleSignIn = useCallback(
        async (data: SignIn) => {
            setLoading(true);
            try {
                const result = await signIn(data);
                localStorage.setItem("token", result.accessToken);
                localStorage.setItem("refreshToken", result.refreshToken); // Store refresh token
                setToken(result.accessToken);
                setRefreshTokenState(result.refreshToken);
            } catch (error) {
                console.error("Error during sign in:", error);
            } finally {
                setLoading(false);
            }
        },
        [],
    );
    const getUser = useCallback(
        async () => {
            try {
                const result = await getUserInformation();
                setUser(result)
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        },
        [],
    );

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        setToken(storedToken);
        setRefreshTokenState(storedRefreshToken);
    }, [])

    useEffect(() => {
        if (token) {
            getUser();
        } else if (refreshTokenState) {
            refreshAuthToken();
        }
    }, [token, refreshTokenState]);

    const refreshAuthToken = useCallback(async () => {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (storedRefreshToken) {
            try {
                const result = await refreshToken(storedRefreshToken);
                localStorage.setItem("token", result.accessToken);
                setToken(result.accessToken);
                setRefreshTokenState(result.refreshToken);
            } catch (error) {
                console.error("Error refreshing token:", error);
                // Handle case where refresh token is invalid or expired
                setToken(null);
                setRefreshTokenState(null);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
            }
        }
    }, []);

    return (
        user && token
            ? <div className='flex flex-col'>
                Hello {user.firstName} {user.lastName}
                <button
                    className="text-blue-500 underline"
                    onClick={() => { setToken(null); setUser(null); localStorage.removeItem('token'); localStorage.removeItem('refreshToken'); }}
                >
                    Log out
                </button>
            </div>
            :
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6">Sign In</h2>
                <form onSubmit={formOnSubmit}>
                    <div className="mb-4">
                        <input
                            className="border border-gray-300 rounded p-2 w-full"
                            type="text"
                            placeholder="Phone"
                            {...register('phone', { required: 'Phone is required' })}
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>
                    <div className="mb-4">
                        <input
                            className="border border-gray-300 rounded p-2 w-full"
                            type="password"
                            placeholder="Password"
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>
                    <button
                        className="bg-blue-500 text-white p-2 rounded w-full mb-4 disabled:opacity-50"
                        type="submit"
                        disabled={loading}
                    >
                        Sign In
                    </button>
                </form>
                <button
                    className="text-blue-500 underline"
                    onClick={() => navigate('/sign-up')}
                >
                    Go to Sign Up
                </button>
            </div>
    );
}

export default SignIn;