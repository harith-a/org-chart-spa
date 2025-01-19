'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Employee, useOrgChart } from '../context/OrgChartContext';
import { NodeComponent } from './NodeComponent';
import { EmployeeForm } from './EmployeeForm';
import { Tree as OrgTree, TreeNode } from 'react-organizational-chart';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

function renderTree(node: Employee) {
  return (
    <TreeNode 
      key={node.id} 
      label={
        <div className="p-2.5 inline-block">
          <NodeComponent node={node} />
        </div>
      }
    >
      {node.children?.map(child => renderTree(child))}
    </TreeNode>
  );
}

export function OrgChart() {
  const { state } = useOrgChart();
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Check if ctrl key is pressed for zooming
      if (e.ctrlKey) {
        e.preventDefault();
        
        // Adjust zoom level
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.min(Math.max(0.5, scale + delta), 3);
        
        setScale(newScale);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [scale]);

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setScale(1);
  };

  return (
    <div className="relative w-full min-h-screen overflow-auto">
      <div 
        ref={containerRef}
        className="w-full min-h-screen py-8 org-chart-container"
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease',
          width: 'max-content',
          minWidth: '100%',
        }}
      >
        <style jsx>{`
          .org-chart-container ul {
            padding-top: 20px;
            position: relative;
            transition: all 0.5s;
            display: flex;
            flex-wrap: nowrap;
            justify-content: center;
          }
          
          .org-chart-container li {
            text-align: center;
            list-style-type: none;
            position: relative;
            padding: 20px 5px 0 5px;
            transition: all 0.5s;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .org-chart-container li::before,
          .org-chart-container li::after {
            content: "";
            position: absolute;
            top: 0;
            right: 50%;
            border-top: 2px solid #ccc;
            width: 50%;
            height: 20px;
          }
          
          .org-chart-container li::after {
            right: auto;
            left: 50%;
            border-left: 2px solid #ccc;
          }
          
          .org-chart-container li:only-child::after,
          .org-chart-container li:only-child::before {
            display: none;
          }
          
          .org-chart-container li:first-child::before,
          .org-chart-container li:last-child::after {
            border: 0 none;
          }
          
          .org-chart-container li:last-child::before {
            border-right: 2px solid #ccc;
            border-radius: 0 5px 0 0;
          }
          
          .org-chart-container li:first-child::after {
            border-radius: 5px 0 0 0;
          }
          
          .org-chart-container li > div {
            position: relative;
          }
          
          .org-chart-container li > div::before {
            content: "";
            position: absolute;
            top: -20px;
            left: 50%;
            border-left: 2px solid #ccc;
            width: 0;
            height: 20px;
          }
        `}</style>
        
        <OrgTree
          label={
            <div className="p-2.5 inline-block">
              <NodeComponent node={state.data} />
            </div>
          }
        >
          {state.data.children?.map(child => renderTree(child))}
        </OrgTree>
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex gap-2 bg-white shadow-lg rounded-lg p-2">
        <button 
          onClick={zoomIn}
          className="p-2 hover:bg-gray-100 rounded-md"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button 
          onClick={zoomOut}
          className="p-2 hover:bg-gray-100 rounded-md"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <button 
          onClick={resetZoom}
          className="p-2 hover:bg-gray-100 rounded-md"
          title="Reset Zoom"
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  );
}
