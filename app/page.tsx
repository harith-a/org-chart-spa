'use client';

import React from "react";
import { OrgChartProvider } from '../context/OrgChartContext';
import { OrgChart } from '../components/OrgChart';
import { EmployeeForm } from '../components/EmployeeForm';
import "./globals.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <OrgChartProvider>
            <OrgChart />
            <EmployeeForm />
        </OrgChartProvider>
    </div>
  );
}
