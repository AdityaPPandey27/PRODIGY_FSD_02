import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Data States
  const [selectedDept, setSelectedDept] = useState(null);
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/departments');
      setDepartments(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  // Open form modal for ADD
  const handleOpenAdd = () => {
    setSelectedDept(null);
    reset({ departmentName: '', description: '' });
    setIsFormModalOpen(true);
  };

  // Open form modal for EDIT
  const handleOpenEdit = (dept) => {
    setSelectedDept(dept);
    reset({ departmentName: dept.departmentName, description: dept.description });
    setIsFormModalOpen(true);
  };

  // Open delete confirmation modal
  const handleOpenDelete = (dept) => {
    setDeptToDelete(dept);
    setIsDeleteModalOpen(true);
  };

  // Form Submit Handler (Create or Update)
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      if (selectedDept) {
        // Update existing
        await api.put(`/departments/${selectedDept._id}`, data);
        toast.success('Department updated successfully');
      } else {
        // Create new
        await api.post('/departments', data);
        toast.success('Department created successfully');
      }
      setIsFormModalOpen(false);
      fetchDepartments(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const confirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await api.delete(`/departments/${deptToDelete._id}`);
      toast.success('Department deleted successfully');
      setIsDeleteModalOpen(false);
      fetchDepartments();
    } catch (error) {
      // This will catch our backend validation if employees are still assigned
      toast.error(error.response?.data?.error || 'Failed to delete department');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <FiPlus size={16} />
          Add Department
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Department Name</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
                    </div>
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No departments found. Click "Add Department" to create one.
                  </td>
                </tr>
              ) : (
                departments.map((dept) => (
                  <tr key={dept._id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                      {dept.departmentName}
                    </td>
                    <td className="px-6 py-4 max-w-md truncate">
                      {dept.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleOpenEdit(dept)}
                          className="text-brand-600 hover:text-brand-900 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(dept)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedDept ? 'Edit Department' : 'Add Department'}
              </h2>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full rounded-lg border ${errors.departmentName ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500`}
                  placeholder="e.g. Engineering"
                  {...register('departmentName', { 
                    required: 'Department name is required',
                    maxLength: { value: 50, message: 'Max 50 characters allowed' }
                  })}
                />
                {errors.departmentName && <p className="mt-1 text-xs text-red-500">{errors.departmentName.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows="3"
                  className={`w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none`}
                  placeholder="Brief description of the department"
                  {...register('description', {
                    maxLength: { value: 200, message: 'Max 200 characters allowed' }
                  })}
                ></textarea>
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <FiAlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">Delete Department?</h3>
            <p className="mb-6 text-sm text-gray-500">
              Are you sure you want to delete the <strong>{deptToDelete?.departmentName}</strong> department? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;