'use client';

import React from 'react';
import { Employee, useOrgChart } from '../context/OrgChartContext';
import { Plus } from 'lucide-react';

interface NodeComponentProps {
  node: Employee;
}

export function NodeComponent({ node }: NodeComponentProps) {
  const { state, dispatch } = useOrgChart();

  const handleClick = () => {
    dispatch({ type: 'SELECT_EMPLOYEE', payload: node });
  };

  const handleAddClick = () => {
    dispatch({ 
      type: 'OPEN_ADD_EMPLOYEE_FORM', 
      payload: { parent: node } 
    });
  };

  return (
    <div
      onClick={handleClick}
      className="min-w-[200px] bg-white rounded-lg shadow-md cursor-pointer transition-shadow hover:shadow-lg border border-slate-200 relative group"
    >
      <div className="flex items-center gap-3 p-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">
              {node.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-slate-900 truncate">
            {node.name}
          </h3>
          <p className="text-xs text-slate-500 truncate">{node.title}</p>
        </div>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleAddClick();
        }}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-green-500 hover:text-green-600 focus:outline-none"
        title="Add Employee"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
