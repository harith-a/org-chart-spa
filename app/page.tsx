'use client';

import React from "react";
import { OrgChartProvider } from '../context/OrgChartContext';
import { OrgChart } from '../components/OrgChart';
import { EmployeeForm } from '../components/EmployeeForm';
import { Users } from 'lucide-react';
import "./globals.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Organization Chart</h1>
            </div>
            <p className="mt-2 text-gray-600">Manage your organization structure with ease</p>
          </div>
          
          <OrgChartProvider>
            <div className="p-6 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Chart View</h2>
                  <div className="relative min-h-[500px] bg-gray-50 rounded-lg p-6 overflow-auto">
                    <OrgChart />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg">
                <EmployeeForm />
              </div>
            </div>
          </OrgChartProvider>
        </div>
      </div>
    </div>
  );
}
