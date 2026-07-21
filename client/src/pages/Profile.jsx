import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiShield, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // Watch the newPassword field so we can compare it with confirmNewPassword
  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      await api.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success('Password updated successfully!');
      
      // Clear the form fields after a successful update
      reset();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left Column: Admin Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-4xl font-bold text-brand-700">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">System Administrator</p>
            
            <div className="mt-6 flex flex-col gap-3 text-left">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FiUser className="text-gray-400" size={18} />
                <span>{user?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FiMail className="text-gray-400" size={18} />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FiShield className="text-gray-400" size={18} />
                <span>Full Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Change Password Form */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
              <FiLock className="text-brand-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              
              {/* Current Password */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className={`w-full rounded-lg border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                  placeholder="Enter current password"
                  {...register('currentPassword', { required: 'Current password is required' })}
                />
                {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>}
              </div>

              {/* New Password */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className={`w-full rounded-lg border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                  placeholder="Enter new password (min 6 characters)"
                  {...register('newPassword', { 
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
                {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className={`w-full rounded-lg border ${errors.confirmNewPassword ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                  placeholder="Confirm your new password"
                  {...register('confirmNewPassword', { 
                    required: 'Please confirm your new password',
                    validate: value => value === newPassword || 'Passwords do not match'
                  })}
                />
                {errors.confirmNewPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmNewPassword.message}</p>}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;