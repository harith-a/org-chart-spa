'use client';

import React, { useState, useEffect } from 'react';
import { Employee, useOrgChart } from '../context/OrgChartContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2 } from 'lucide-react';

export function EmployeeForm() {
  const { state, dispatch } = useOrgChart();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [errors, setErrors] = useState({ name: '', title: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

  useEffect(() => {
    if (state.selectedEmployee) {
      setName(state.selectedEmployee.name);
      setTitle(state.selectedEmployee.title);
      setErrors({ name: '', title: '' });
    } else if (state.isAddingEmployee) {
      // Reset form when adding a new employee
      setName('');
      setTitle('');
      setErrors({ name: '', title: '' });
    }
  }, [state.selectedEmployee, state.isAddingEmployee]);

  const validate = () => {
    const newErrors = { name: '', title: '' };
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!title.trim()) newErrors.title = 'Title is required';
    setErrors(newErrors);
    return !newErrors.name && !newErrors.title;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (state.isAddingEmployee && state.parentForNewEmployee) {
        // Adding a new employee
        const newEmployee: Employee = {
          id: Date.now().toString(),
          name: name.trim(),
          title: title.trim(),
        };
        dispatch({
          type: 'ADD_EMPLOYEE',
          payload: { parentId: state.parentForNewEmployee.id, newEmployee },
        });
      } else if (state.selectedEmployee) {
        // Editing an existing employee
        dispatch({
          type: 'EDIT_EMPLOYEE',
          payload: { ...state.selectedEmployee, name: name.trim(), title: title.trim() },
        });
      }
      
      handleClose();
    } catch (error) {
      console.error('Error submitting employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!state.selectedEmployee || state.selectedEmployee.id === state.data.id) return;

    dispatch({
      type: 'DELETE_EMPLOYEE',
      payload: { employeeId: state.selectedEmployee.id },
    });
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setTitle('');
    setErrors({ name: '', title: '' });
    setIsDeleteConfirming(false);
    dispatch({ type: 'CLOSE_ADD_EMPLOYEE_FORM' });
  };

  // Only show delete for existing employees, not the root/CEO
  const canDelete = state.selectedEmployee && 
    state.selectedEmployee.id !== state.data.id && 
    !state.isAddingEmployee;

  return (
    <Dialog 
      open={!!state.selectedEmployee || state.isAddingEmployee} 
      onOpenChange={() => handleClose()}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {state.isAddingEmployee 
              ? `Add New Employee to ${state.parentForNewEmployee?.name || 'Root'}` 
              : 'Edit Employee'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.name
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Enter employee name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.title
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Enter job title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>
          
          <div className="flex justify-between items-center gap-3 pt-4">
            {canDelete && (
              <button
                type="button"
                onClick={() => setIsDeleteConfirming(true)}
                className="text-red-500 hover:text-red-600 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}

            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Saving...' : state.isAddingEmployee ? 'Add Employee' : 'Update Employee'}
              </button>
            </div>
          </div>

          {isDeleteConfirming && canDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p className="mb-4">Are you sure you want to delete this employee?</p>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirming(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
