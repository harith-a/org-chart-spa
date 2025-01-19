'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Employee, useOrgChart } from '../context/OrgChartContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, User, Briefcase } from 'lucide-react';

// Reusable input component with enhanced styling and animations
const FormInput = React.memo(({
  label,
  id,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  icon: Icon
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <div className="relative group">
    <label 
      htmlFor={id} 
      className="block text-sm font-medium text-gray-700 mb-1 transition-colors duration-300 
        group-focus-within:text-blue-600"
    >
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 
          text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-3 ${Icon ? 'pl-10' : ''} py-2 
          border rounded-lg shadow-sm 
          transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 
          ${error 
            ? 'border-red-300 focus:ring-red-500 text-red-900' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900'
          }
          hover:border-blue-400
          placeholder-gray-400
        `}
        placeholder={placeholder}
      />
    </div>
    {error && (
      <div className="mt-1 text-sm text-red-600 animate-shake">
        {error}
      </div>
    )}
  </div>
));

// Delete confirmation modal with improved styling
const DeleteConfirmation = React.memo(({
  onCancel,
  onConfirm
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 
    animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 
      transform transition-all duration-300 scale-100 hover:scale-105">
      <div className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full 
          flex items-center justify-center">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Confirm Deletion
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this employee? 
          This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 bg-gray-100 
              rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white 
              rounded-lg hover:bg-red-700 transition-colors 
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
));

export function EmployeeForm() {
  const { state, dispatch } = useOrgChart();
  const [formState, setFormState] = useState({
    name: state.selectedEmployee?.name || '',
  });
  const [errors, setErrors] = useState({ name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

  const validate = useCallback(() => {
    const newErrors = { 
      name: formState.name.trim() ? '' : 'Name is required',
    };
    setErrors(newErrors);
    return !newErrors.name;
  }, [formState]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const employeeData = {
        id: state.selectedEmployee?.id || Date.now().toString(),
        name: formState.name.trim(),
      };

      if (state.isAddingEmployee && state.parentForNewEmployee) {
        dispatch({
          type: 'ADD_EMPLOYEE',
          payload: { 
            parentId: state.parentForNewEmployee.id, 
            newEmployee: employeeData 
          },
        });
      } else if (state.selectedEmployee) {
        dispatch({
          type: 'EDIT_EMPLOYEE',
          payload: employeeData,
        });
      }
      
      handleClose();
    } catch (error) {
      console.error('Error submitting employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [state, formState, dispatch, validate]);

  const handleDelete = useCallback(() => {
    if (!state.selectedEmployee || state.selectedEmployee.id === state.data.id) return;

    dispatch({
      type: 'DELETE_EMPLOYEE',
      payload: { employeeId: state.selectedEmployee.id },
    });
    handleClose();
  }, [state, dispatch]);

  const handleClose = useCallback(() => {
    setFormState({ name: '' });
    setErrors({ name: '' });
    setIsDeleteConfirming(false);
    dispatch({ type: 'CLOSE_ADD_EMPLOYEE_FORM' });
  }, [dispatch]);

  const canDelete = useMemo(() => 
    state.selectedEmployee && 
    state.selectedEmployee.id !== state.data.id && 
    !state.isAddingEmployee, 
    [state]
  );

  const dialogTitle = useMemo(() => 
    state.isAddingEmployee 
      ? `Add New Employee to ${state.parentForNewEmployee?.name || 'Root'}` 
      : 'Edit Employee', 
    [state]
  );

  return (
    <Dialog 
      open={!!state.selectedEmployee || state.isAddingEmployee} 
      onOpenChange={handleClose}
    >
      <DialogContent 
        className="sm:max-w-[500px] rounded-2xl shadow-2xl 
        bg-gradient-to-br from-white to-blue-50/50 
        border-none overflow-hidden"
      >
        <DialogHeader className="relative pb-4 border-b border-gray-200">
          <DialogTitle className="text-2xl font-bold text-gray-800 text-center">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>
        
        <form 
          onSubmit={handleSubmit} 
          className="space-y-6 p-2 animate-subtle-enter"
        >
          <FormInput
            label="Name"
            id="name"
            value={formState.name}
            onChange={(value) => setFormState(prev => ({ ...prev, name: value }))}
            error={errors.name}
            placeholder="Enter employee name"
            icon={User}
          />
          
          <div className="flex justify-between items-center pt-4">
            {canDelete && (
              <button
                type="button"
                onClick={() => setIsDeleteConfirming(true)}
                className="text-red-500 hover:text-red-600 
                  flex items-center gap-2 
                  transition-colors duration-300 
                  hover:scale-105 active:scale-95"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}

            <div className="flex gap-4 ml-auto">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-gray-600 bg-gray-100 
                  rounded-lg hover:bg-gray-200 
                  transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  px-6 py-2 text-white bg-blue-600 rounded-lg 
                  hover:bg-blue-700 focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition-all duration-300
                  ${isSubmitting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105 active:scale-95'}
                `}
              >
                {isSubmitting 
                  ? 'Saving...' 
                  : (state.isAddingEmployee ? 'Add Employee' : 'Update Employee')
                }
              </button>
            </div>
          </div>
        </form>

        {isDeleteConfirming && canDelete && (
          <DeleteConfirmation
            onCancel={() => setIsDeleteConfirming(false)}
            onConfirm={handleDelete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
