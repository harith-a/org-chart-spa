'use client';

import React from 'react';
import { Employee, useOrgChart } from '../context/OrgChartContext';
import { PlusCircle, Edit2, UserPlus } from 'lucide-react';

interface NodeComponentProps {
  node: Employee;
}

export function NodeComponent({ node }: NodeComponentProps) {
  const { dispatch } = useOrgChart();

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'SELECT_EMPLOYEE', payload: node });
  };

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'SELECT_EMPLOYEE', payload: null });
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: '',
      title: '',
    };
    dispatch({
      type: 'ADD_EMPLOYEE',
      payload: { parentId: node.id, newEmployee },
    });
  };

  return (
    <div
      className="group relative p-4 bg-white border border-gray-200 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
      onClick={handleSelect}
    >
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
        <button
          onClick={handleAddChild}
          className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          title="Add subordinate"
        >
          <UserPlus size={14} />
        </button>
        <button
          onClick={handleSelect}
          className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          title="Edit"
        >
          <Edit2 size={14} />
        </button>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">{node.name || 'New Employee'}</h3>
        <p className="text-sm text-gray-600">{node.title || 'Click to edit'}</p>
      </div>
    </div>
  );
}
