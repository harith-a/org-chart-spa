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
      className="relative min-w-[220px] group cursor-pointer"
    >
      {/* Floating Add Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleAddClick();
        }}
        className="absolute z-20 -top-2 -right-2 bg-green-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-green-600 focus:outline-none"
        title="Add Employee"
      >
        <Plus size={16} strokeWidth={3} />
      </button>

      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
      
      <div className="relative bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 group-hover:shadow-md">
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100 opacity-50 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none"></div>
        
        {/* Content Container */}
        <div className="relative z-10 p-4">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shadow-sm overflow-hidden border-2 border-white">
                <span className="text-blue-800 font-bold text-2xl tracking-tight">
                  {node.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            
            {/* Employee Details */}
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-lg font-bold text-slate-900 truncate transition-colors duration-200 group-hover:text-blue-700">
                {node.name}
              </h3>
              {node.jobTitle && (
                <p className="text-sm text-slate-600 truncate opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                  🏢 {node.jobTitle}
                </p>
              )}
              {node.hobby && (
                <p className="text-xs text-slate-500 truncate italic opacity-70 group-hover:opacity-90 transition-opacity duration-200">
                  ⭐ {node.hobby}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
