'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

export interface Employee {
  id: string;
  name: string;
  title: string;
  children?: Employee[];
}

interface OrgChartState {
  data: Employee;
  selectedEmployee: Employee | null;
  parentForNewEmployee: Employee | null;
  isAddingEmployee: boolean;
}

type Action =
  | { type: 'ADD_EMPLOYEE'; payload: { parentId: string; newEmployee: Employee } }
  | { type: 'EDIT_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: { employeeId: string } }
  | { type: 'SELECT_EMPLOYEE'; payload: Employee | null }
  | { type: 'SET_PARENT_FOR_NEW_EMPLOYEE'; payload: Employee }
  | { type: 'OPEN_ADD_EMPLOYEE_FORM'; payload: { parent: Employee } }
  | { type: 'CLOSE_ADD_EMPLOYEE_FORM' }
  | { type: 'LOAD_FROM_COOKIE'; payload: Employee };

const initialState: OrgChartState = {
  data: {
    id: '1',
    name: 'John Doe',
    title: 'CEO',
    children: [],
  },
  selectedEmployee: null,
  parentForNewEmployee: null,
  isAddingEmployee: false,
};

function findEmployeeById(root: Employee, id: string): Employee | null {
  if (root.id === id) return root;
  
  if (root.children) {
    for (const child of root.children) {
      const found = findEmployeeById(child, id);
      if (found) return found;
    }
  }
  
  return null;
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

function deleteEmployee(root: Employee, employeeId: string): Employee {
  if (!root.children) return root;

  // Remove the employee if found in direct children
  const updatedChildren = root.children.filter(child => child.id !== employeeId);

  // If not found in direct children, recursively search
  if (updatedChildren.length === root.children.length) {
    return {
      ...root,
      children: root.children.map(child => deleteEmployee(child, employeeId)),
    };
  }

  return {
    ...root,
    children: updatedChildren,
  };
}

function orgChartReducer(state: OrgChartState, action: Action): OrgChartState {
  switch (action.type) {
    case 'ADD_EMPLOYEE':
      const newStateAdd = {
        ...state,
        data: addEmployee(state.data, action.payload.parentId, action.payload.newEmployee),
        selectedEmployee: null,
        parentForNewEmployee: null,
        isAddingEmployee: false,
      };
      Cookies.set('orgChartData', JSON.stringify(newStateAdd.data), { expires: 365 });
      return newStateAdd;
    case 'EDIT_EMPLOYEE':
      const newStateEdit = {
        ...state,
        data: editEmployee(state.data, action.payload),
        selectedEmployee: null,
      };
      Cookies.set('orgChartData', JSON.stringify(newStateEdit.data), { expires: 365 });
      return newStateEdit;
    case 'DELETE_EMPLOYEE':
      const newStateDelete = {
        ...state,
        data: deleteEmployee(state.data, action.payload.employeeId),
        selectedEmployee: null,
        parentForNewEmployee: null,
        isAddingEmployee: false,
      };
      Cookies.set('orgChartData', JSON.stringify(newStateDelete.data), { expires: 365 });
      return newStateDelete;
    case 'SELECT_EMPLOYEE':
      return {
        ...state,
        selectedEmployee: action.payload,
        isAddingEmployee: false,
      };
    case 'SET_PARENT_FOR_NEW_EMPLOYEE':
      return {
        ...state,
        parentForNewEmployee: action.payload,
        isAddingEmployee: true,
      };
    case 'OPEN_ADD_EMPLOYEE_FORM':
      return {
        ...state,
        parentForNewEmployee: action.payload.parent,
        selectedEmployee: null,
        isAddingEmployee: true,
      };
    case 'CLOSE_ADD_EMPLOYEE_FORM':
      return {
        ...state,
        selectedEmployee: null,
        parentForNewEmployee: null,
        isAddingEmployee: false,
      };
    case 'LOAD_FROM_COOKIE':
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
}

const OrgChartContext = createContext<{
  state: OrgChartState;
  dispatch: React.Dispatch<Action>;
  findEmployeeById: (id: string) => Employee | null;
} | undefined>(undefined);

export function OrgChartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orgChartReducer, initialState);

  useEffect(() => {
    // Load from cookie on initial render
    const savedData = Cookies.get('orgChartData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_FROM_COOKIE', payload: parsedData });
      } catch (error) {
        console.error('Error parsing saved org chart data:', error);
      }
    }
  }, []);

  const contextValue = {
    state, 
    dispatch,
    findEmployeeById: (id: string) => findEmployeeById(state.data, id),
  };

  return (
    <OrgChartContext.Provider value={contextValue}>
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
