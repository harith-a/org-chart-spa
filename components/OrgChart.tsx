'use client';

import React, { Suspense, lazy } from 'react';
import { Employee, useOrgChart } from '../context/OrgChartContext';
import { NodeComponent } from './NodeComponent';

const DynamicTree = lazy(() => import('react-organizational-chart').then(mod => ({ default: mod.Tree })));
const DynamicTreeNode = lazy(() => import('react-organizational-chart').then(mod => ({ default: mod.TreeNode })));

function renderTree(node: Employee) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTreeNode key={node.id} label={<NodeComponent node={node} />}>
        {node.children?.map(child => renderTree(child))}
      </DynamicTreeNode>
    </Suspense>
  );
}

export function OrgChart() {
  const { state } = useOrgChart();

  return (
    <div className="w-full overflow-auto">
      <Suspense fallback={<div>Loading Org Chart...</div>}>
        <DynamicTree
          lineWidth="2px"
          lineColor="#bbb"
          lineBorderRadius="10px"
          label={<NodeComponent node={state.data} />}
        >
          {state.data.children?.map(child => renderTree(child))}
        </DynamicTree>
      </Suspense>
    </div>
  );
}
