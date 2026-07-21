import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';

const EditEmployee = () => {
  const { id } = useParams(); // Grab the employee ID from the URL
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching the employee
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const IMAGE_BASE_URL = 'http://localhost:5000/uploads/';

  const {
    register,
    handleSubmit,
    reset, // Used to prepopulate the form with fetched data
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Fetch both the departments list AND the specific employee's data in parallel
    const fetchData = async () => {
      try {
        const [deptRes, empRes] = await Promise.all([
          api.get('/departments'),
          api.get(`/employees/${id}`)
        ]);

        setDepartments(deptRes.data.data);

        const employee = empRes.data.data;
        
        // Save current image filename for the UI preview
        if (employee.image) {
          setCurrentImage(employee.image);
        }

        // Prepopulate the form. We must format dates for HTML <input type="date">
        reset({
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          gender: employee.gender,
          dob: employee.dob ? employee.dob.split('T')[0] : '', // Extract YYYY-MM-DD
          department: employee.department?._id || '', // Extract just the ID string
          designation: employee.designation,
          salary: employee.salary,
          joiningDate: employee.joiningDate ? employee.joiningDate.split('T')[0] : '',
          status: employee.status,
          address: employee.address,
        });

      } catch (error) {
        toast.error('Failed to load data for editing');
        navigate('/employees'); // If we can't load the employee, kick them back to the table
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
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

      // Only append the image if the user actually selected a new one
      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }

      await api.put(`/employees/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Employee updated successfully!');
      navigate('/employees');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/employees"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Employee</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Standard Text Fields */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={`w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={`w-full rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                {...register('phone', { required: 'Phone is required' })}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
              <select
                className={`w-full rounded-lg border ${errors.gender ? 'border-red-500' : 'border-gray-300'} bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                {...register('gender', { required: 'Gender is required' })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
              <input
                type="date"
                className={`w-full rounded-lg border ${errors.dob ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                {...register('dob', { required: 'Date of birth is required' })}
              />
              {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Department <span className="text-red-500">*</span></label>
              <select
                className={`w-full rounded-lg border ${errors.department ? 'border-red-500' : 'border-gray-300'} bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                {...register('department', { required: 'Department is required' })}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
                ))}
              </select>
              {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Designation <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={`w-full rounded-lg border ${errors.designation ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                {...register('designation', { required: 'Designation is required' })}
              />
              {errors.designation && <p className="mt-1 text-xs text-red-500">{errors.designation.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Salary (Annual) <span className="text-red-500">*</span></label>
              <input
                type="number"
                step="0.01"
                className={`w-full rounded-lg border ${errors.salary ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                {...register('salary', { required: 'Salary is required', min: { value: 0, message: 'Must be positive' } })}
              />
              {errors.salary && <p className="mt-1 text-xs text-red-500">{errors.salary.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Joining Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                className={`w-full rounded-lg border ${errors.joiningDate ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                {...register('joiningDate', { required: 'Joining date is required' })}
              />
              {errors.joiningDate && <p className="mt-1 text-xs text-red-500">{errors.joiningDate.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                {...register('status')}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
              <textarea
                rows="3"
                className={`w-full resize-none rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                {...register('address', { required: 'Address is required' })}
              ></textarea>
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
            </div>

            {/* Profile Image with Current Image Preview */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Update Profile Picture</label>
              <div className="flex items-center gap-6">
                {currentImage && (
                  <img 
                    src={`${IMAGE_BASE_URL}${currentImage}`} 
                    alt="Current Profile" 
                    className="h-16 w-16 rounded-full object-cover border border-gray-200 shadow-sm"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=User'; }}
                  />
                )}
                <div>
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/jpg, image/webp"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-brand-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
                    {...register('image')}
                  />
                  <p className="mt-1 text-xs text-gray-500">Leave blank to keep current picture. Supported: JPG, PNG, WEBP.</p>
                </div>
              </div>
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
                  Updating...
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  Update Employee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;