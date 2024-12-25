import { signUp } from '@/services/auth.service';
import type { SignUp } from '@/types/auth';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUp>({
        defaultValues: {
            firstName: '',
            lastName: '',
            password: '',
            phone: '',
            confirmPassword: ''
        }
    });

    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate();

    const formOnSubmit = handleSubmit((formData) => {
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        handleSignUp(formData);
    });

    const handleSignUp = useCallback(
        async (data: SignUp) => {
            setLoading(true);
            try {
                await signUp(data);
                navigate('/sign-in')
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
            <form onSubmit={formOnSubmit}>
                <div className="mb-4">
                    <input
                        className="border border-gray-300 rounded p-2 w-full"
                        type="text"
                        placeholder="First Name"
                        {...register('firstName', { required: 'First name is required' })}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                </div>
                <div className="mb-4">
                    <input
                        className="border border-gray-300 rounded p-2 w-full"
                        type="text"
                        placeholder="Last Name"
                        {...register('lastName', { required: 'Last name is required' })}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                </div>
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
                <div className="mb-4">
                    <input
                        className="border border-gray-300 rounded p-2 w-full"
                        type="password"
                        placeholder="Confirm Password"
                        {...register('confirmPassword', { required: 'Confirm password is required' })}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                </div>
                <button
                    className="bg-blue-500 text-white p-2 rounded w-full mb-4"
                    type="submit"
                    disabled={loading}
                >
                    Sign Up
                </button>
            </form>
            <button
                className="text-blue-500 underline"
                onClick={() => navigate('/sign-in')}
            >
                Already have an account? Sign In
            </button>
        </div>
    );
}

export default SignUp;