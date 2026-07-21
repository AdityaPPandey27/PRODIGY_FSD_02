import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';

const AddEmployee = () => {
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Fetch departments for the dropdown menu when the component loads
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data.data);
      } catch (error) {
        toast.error('Failed to load departments');
      } finally {
        setLoadingDepts(false);
      }
    };
    fetchDepartments();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Create a new FormData object to handle the file upload
      const formData = new FormData();
      
      // Append standard text/number fields to formData
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('gender', data.gender);
      formData.append('dob', data.dob);
      formData.append('department', data.department);
      formData.append('designation', data.designation);
      formData.append('salary', data.salary);
      formData.append('joiningDate', data.joiningDate);
      formData.append('address', data.address);
      formData.append('status', data.status);

      // Append the image file if one was selected
      // React Hook Form stores files in a FileList array, so we grab the first item [0]
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      // Send POST request with multipart/form-data header
      await api.post('/employees', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Employee added successfully!');
      navigate('/employees'); // Redirect back to the table

    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Link
          to="/employees"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add New Employee</h1>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
          
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={`w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                placeholder="John Doe"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                placeholder="john@example.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={`w-full rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                placeholder="+1 234 567 8900"
                {...register('phone', { required: 'Phone number is required' })}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
              <select
                className={`w-full rounded-lg border ${errors.gender ? 'border-red-500' : 'border-gray-300'} bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                {...register('gender', { required: 'Gender is required' })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
            </div>

            {/* DOB */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
              <input
                type="date"
                className={`w-full rounded-lg border ${errors.dob ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                {...register('dob', { required: 'Date of birth is required' })}
              />
              {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob.message}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Department <span className="text-red-500">*</span></label>
              <select
                className={`w-full rounded-lg border ${errors.department ? 'border-red-500' : 'border-gray-300'} bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                {...register('department', { required: 'Department is required' })}
                disabled={loadingDepts}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
              {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
            </div>

            {/* Designation */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Designation <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={`w-full rounded-lg border ${errors.designation ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                placeholder="Software Engineer"
                {...register('designation', { required: 'Designation is required' })}
              />
              {errors.designation && <p className="mt-1 text-xs text-red-500">{errors.designation.message}</p>}
            </div>

            {/* Salary */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Salary (Annual) <span className="text-red-500">*</span></label>
              <input
                type="number"
                step="0.01"
                className={`w-full rounded-lg border ${errors.salary ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                placeholder="75000"
                {...register('salary', { 
                  required: 'Salary is required',
                  min: { value: 0, message: 'Salary must be positive' }
                })}
              />
              {errors.salary && <p className="mt-1 text-xs text-red-500">{errors.salary.message}</p>}
            </div>

            {/* Joining Date */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Joining Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                className={`w-full rounded-lg border ${errors.joiningDate ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                {...register('joiningDate', { required: 'Joining date is required' })}
              />
              {errors.joiningDate && <p className="mt-1 text-xs text-red-500">{errors.joiningDate.message}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                {...register('status')}
                defaultValue="Active"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Address (Full Width) */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
              <textarea
                rows="3"
                className={`w-full resize-none rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                placeholder="123 Main St, City, Country"
                {...register('address', { required: 'Address is required' })}
              ></textarea>
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
            </div>

            {/* Profile Image (Full Width) */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Profile Picture (Optional)</label>
              <input
                type="file"
                accept="image/jpeg, image/png, image/jpg, image/webp"
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-brand-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
                {...register('image')}
              />
              <p className="mt-1 text-xs text-gray-500">Supported formats: JPG, PNG, WEBP. Max size: 2MB.</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4 border-t border-gray-100 pt-6">
            <Link
              to="/employees"
              className="rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  Save Employee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;