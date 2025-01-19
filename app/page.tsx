'use client';

import React from "react";
import { OrgChartProvider } from '../context/OrgChartContext';
import { OrgChart } from '../components/OrgChart';
import { EmployeeForm } from '../components/EmployeeForm';
import "./globals.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <OrgChartProvider>
          <div className="relative min-h-[600px] bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-xl">
            <OrgChart />
            <EmployeeForm />
          </div>
        </OrgChartProvider>
      </div>
    </div>
  );
}
