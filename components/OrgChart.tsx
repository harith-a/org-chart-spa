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

function renderTree(node: Employee): React.ReactNode {
  return (
    <TreeNode 
      key={node.id} 
      label={
        <div className="p-2.5 inline-block">
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
    <div className="fixed bottom-4 right-4 z-50 flex gap-2 bg-white shadow-lg rounded-lg p-2">
      <button onClick={() => zoomIn(0.5)} className="p-2 hover:bg-gray-100 rounded-md" title="Zoom In">
        <ZoomIn size={20} />
      </button>
      <button onClick={() => zoomOut(0.5)} className="p-2 hover:bg-gray-100 rounded-md" title="Zoom Out">
        <ZoomOut size={20} />
      </button>
      <button onClick={() => resetTransform()} className="p-2 hover:bg-gray-100 rounded-md" title="Reset Zoom">
        <RefreshCw size={20} />
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
                alignItems: 'center' 
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
