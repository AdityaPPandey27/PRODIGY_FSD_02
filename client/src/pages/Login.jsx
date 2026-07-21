import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Call the login function from our AuthContext
    const success = await login(data.email, data.password);
    
    if (success) {
      toast.success('Login successful! Welcome back.');
      navigate('/dashboard'); // Redirect to dashboard on success
    } else {
      // The error toast is handled inside the context, but we could add one here if needed
      toast.error('Invalid email or password.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-100 to-indigo-200 p-4 relative overflow-hidden">
      
      {/* Decorative background blobs for a modern look */}
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-brand-300 opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-indigo-300 opacity-50 blur-3xl"></div>

      {/* Glassmorphism Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-white/70 p-8 shadow-2xl backdrop-blur-xl border border-white/50">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Admin <span className="text-brand-600">Portal</span>
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage employees and departments
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Email Input Group */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiMail size={18} />
              </div>
              <input
                id="email"
                type="email"
                className={`w-full rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } bg-white/50 py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200`}
                placeholder="admin@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
            </div>
            {/* Validation Error Message */}
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input Group */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiLock size={18} />
              </div>
              <input
                id="password"
                type="password"
                className={`w-full rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } bg-white/50 py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200`}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
            </div>
            {/* Validation Error Message */}
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-brand-400"
          >
            {isSubmitting ? (
              // Loading Spinner
              <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;