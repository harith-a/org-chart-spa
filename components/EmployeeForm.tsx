'use client';

import React, { useState, useEffect } from 'react';
import { Employee, useOrgChart } from '../context/OrgChartContext';
import { X } from 'lucide-react';

export function EmployeeForm() {
  const { state, dispatch } = useOrgChart();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [errors, setErrors] = useState({ name: '', title: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (state.selectedEmployee) {
      setName(state.selectedEmployee.name);
      setTitle(state.selectedEmployee.title);
      setErrors({ name: '', title: '' });
    } else {
      setName('');
      setTitle('');
    }
  }, [state.selectedEmployee]);

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
      if (state.selectedEmployee) {
        dispatch({
          type: 'EDIT_EMPLOYEE',
          payload: { ...state.selectedEmployee, name: name.trim(), title: title.trim() },
        });
      } else {
        const newEmployee: Employee = {
          id: Date.now().toString(),
          name: name.trim(),
          title: title.trim(),
        };
        dispatch({
          type: 'ADD_EMPLOYEE',
          payload: { parentId: state.data.id, newEmployee },
        });
      }
      setName('');
      setTitle('');
      dispatch({ type: 'SELECT_EMPLOYEE', payload: null });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setTitle('');
    setErrors({ name: '', title: '' });
    dispatch({ type: 'SELECT_EMPLOYEE', payload: null });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {state.selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        </h2>
        <button
          onClick={handleCancel}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
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
            {isSubmitting
              ? 'Saving...'
              : state.selectedEmployee
              ? 'Update Employee'
              : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
