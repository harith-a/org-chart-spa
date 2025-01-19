'use client';

import React, { useMemo } from 'react';
import { 
  TransformWrapper, 
  TransformComponent, 
  useControls 
} from 'react-zoom-pan-pinch';
import { Employee, useOrgChart } from '../context/OrgChartContext';
import { NodeComponent } from './NodeComponent';
import { Tree as OrgTree, TreeNode } from 'react-organizational-chart';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

// Extend TreeNode props to include lineClassName
declare module 'react-organizational-chart' {
  interface TreeProps {
    lineClassName?: string;
  }
}

// Custom styles for improved line rendering
const customStyles = `
  .org-chart-line {
    stroke: rgba(59, 130, 246, 0.5); /* Soft blue lines */
    stroke-width: 2px;
    transition: all 0.3s ease;
  }
  .org-chart-line:hover {
    stroke: rgba(59, 130, 246, 0.8);
    stroke-width: 3px;
  }
`;

function renderTree(node: Employee): React.ReactNode {
  return (
    <TreeNode 
      key={node.id} 
      label={
        <div className={`p-2.5 inline-block ${node.children ? 'org-chart-line' : ''}`}>
          <NodeComponent node={node} />
        </div>
      }
    >
      {node.children?.map(renderTree)}
    </TreeNode>
  );
}

function OrgChartControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2 bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-2">
      <button 
        onClick={() => zoomIn(0.5)} 
        className="p-2 hover:bg-blue-100 rounded-md transition-colors" 
        title="Zoom In"
      >
        <ZoomIn size={20} className="text-blue-600" />
      </button>
      <button 
        onClick={() => zoomOut(0.5)} 
        className="p-2 hover:bg-blue-100 rounded-md transition-colors" 
        title="Zoom Out"
      >
        <ZoomOut size={20} className="text-blue-600" />
      </button>
      <button 
        onClick={() => resetTransform()} 
        className="p-2 hover:bg-blue-100 rounded-md transition-colors" 
        title="Reset Zoom"
      >
        <RefreshCw size={20} className="text-blue-600" />
      </button>
    </div>
  );
}

export function OrgChart() {
  const { state } = useOrgChart();

  const orgTree = useMemo(() => (
    <OrgTree
      label={
        <div className="p-2.5 inline-block">
          <NodeComponent node={state.data} />
        </div>
      }
    >
      {state.data.children?.map(renderTree)}
    </OrgTree>
  ), [state.data]);

  return (
    <div>
      {/* Add custom styles */}
      <style>{customStyles}</style>
      
      <TransformWrapper
        maxScale={3}
        minScale={0.5}
        initialScale={1}
        wheel={{ step: 0.5 }}
        panning={{ disabled: false }}
        pinch={{ disabled: false }}
        limitToBounds={false}
        centerZoomedOut={true}
      >
        {() => (
          <>
            <OrgChartControls />
            <TransformComponent>
              <div style={{ 
                width: '100vw', 
                height: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                perspective: '1000px', // Add 3D perspective
                transformStyle: 'preserve-3d'
              }}>
                {orgTree}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
