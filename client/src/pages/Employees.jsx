import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Define our image base URL (Backend runs on port 5000)
  const IMAGE_BASE_URL = 'http://localhost:5000/uploads/';

  // Fetch employees whenever page or debounced search changes
  useEffect(() => {
    // Debounce logic: wait 500ms after the user stops typing before making the API call
    const delayDebounceFn = setTimeout(() => {
      fetchEmployees();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      // Pass page and search query parameters to our backend
      const res = await api.get(`/employees?page=${page}&limit=10${searchTerm ? `&search=${searchTerm}` : ''}`);
      setEmployees(res.data.data);
      setTotalPages(res.data.pagination.pages);
      setTotalCount(res.data.pagination.total);
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  // Handle Search Input Change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to page 1 whenever a new search is initiated
  };

  // Open Delete Modal
  const handleOpenDelete = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/employees/${employeeToDelete._id}`);
      toast.success('Employee deleted successfully');
      setIsDeleteModalOpen(false);
      
      // If we deleted the last item on the current page, go back one page
      if (employees.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchEmployees();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete employee');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
          <p className="text-sm text-gray-500">Total: {totalCount} records found</p>
        </div>
        <Link
          to="/employees/add"
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <FiPlus size={16} />
          Add Employee
        </Link>
      </div>

      {/* Search and Filters Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Profile</th>
                <th className="px-6 py-4 font-medium">Employee Info</th>
                <th className="px-6 py-4 font-medium">Department & Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No employees found matching your criteria.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                    {/* Profile Picture */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <img 
                        src={`${IMAGE_BASE_URL}${emp.image}`} 
                        alt={emp.name} 
                        className="h-10 w-10 rounded-full object-cover border border-gray-200"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=User'; }} // Fallback if image breaks
                      />
                    </td>
                    
                    {/* Name & Email */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{emp.name}</div>
                      <div className="text-xs text-gray-500">{emp.email}</div>
                    </td>
                    
                    {/* Department & Designation */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{emp.department?.departmentName || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{emp.designation}</div>
                    </td>
                    
                    {/* Status Badge */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/employees/edit/${emp._id}`}
                          className="text-brand-600 hover:text-brand-900 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleOpenDelete(emp)}
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
        
        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <FiAlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">Delete Employee?</h3>
            <p className="mb-6 text-sm text-gray-500">
              Are you sure you want to delete <strong>{employeeToDelete?.name}</strong>? This action cannot be undone.
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
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;