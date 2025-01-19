'use client';

import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { saveOrgChartToFile } from '../lib/saveOrgChart';

export interface Employee {
  id: string;
  name: string;
  title: string;
  children?: Employee[];
}

interface OrgChartState {
  data: Employee;
  selectedEmployee: Employee | null;
}

type Action =
  | { type: 'ADD_EMPLOYEE'; payload: { parentId: string; newEmployee: Employee } }
  | { type: 'EDIT_EMPLOYEE'; payload: Employee }
  | { type: 'SELECT_EMPLOYEE'; payload: Employee | null }
  | { type: 'SAVE_ORG_CHART' };

const initialState: OrgChartState = {
  data: {
    id: '1',
    name: 'John Doe',
    title: 'CEO',
    children: [],
  },
  selectedEmployee: null,
};

function orgChartReducer(state: OrgChartState, action: Action): OrgChartState {
  let newState;
  switch (action.type) {
    case 'ADD_EMPLOYEE':
      newState = {
        ...state,
        data: addEmployee(state.data, action.payload.parentId, action.payload.newEmployee),
      };
      saveOrgChartToFile(newState.data).catch(console.error);
      return newState;
    case 'EDIT_EMPLOYEE':
      newState = {
        ...state,
        data: editEmployee(state.data, action.payload),
      };
      saveOrgChartToFile(newState.data).catch(console.error);
      return newState;
    case 'SELECT_EMPLOYEE':
      newState = {
        ...state,
        selectedEmployee: action.payload,
      };
      // Don't save on selection change
      return newState;
    case 'SAVE_ORG_CHART':
      // Trigger save asynchronously without blocking state update
      saveOrgChartToFile(state.data).catch(console.error);
      return state;
    default:
      return state;
  }
}

function addEmployee(root: Employee, parentId: string, newEmployee: Employee): Employee {
  if (root.id === parentId) {
    return {
      ...root,
      children: [...(root.children || []), newEmployee],
    };
  }

  if (root.children) {
    return {
      ...root,
      children: root.children.map(child => addEmployee(child, parentId, newEmployee)),
    };
  }

  return root;
}

function editEmployee(root: Employee, updatedEmployee: Employee): Employee {
  if (root.id === updatedEmployee.id) {
    return { ...root, ...updatedEmployee };
  }

  if (root.children) {
    return {
      ...root,
      children: root.children.map(child => editEmployee(child, updatedEmployee)),
    };
  }

  return root;
}

const OrgChartContext = createContext<{
  state: OrgChartState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function OrgChartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orgChartReducer, initialState);

  // Optional: Initial save when provider mounts
  useEffect(() => {
    saveOrgChartToFile(state.data).catch(console.error);
  }, []);

  return (
    <OrgChartContext.Provider value={{ state, dispatch }}>
      {children}
    </OrgChartContext.Provider>
  );
}

export function useOrgChart() {
  const context = useContext(OrgChartContext);
  if (context === undefined) {
    throw new Error('useOrgChart must be used within an OrgChartProvider');
  }
  return context;
}
