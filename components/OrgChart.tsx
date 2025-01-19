'use client';

import React from 'react';
import { Employee, useOrgChart } from '../context/OrgChartContext';
import { NodeComponent } from './NodeComponent';
import { Tree as OrgTree, TreeNode } from 'react-organizational-chart';

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

  return (
    <div className="w-full overflow-auto py-8 org-chart-container">
      <style jsx>{`
        .org-chart-container ul {
          padding-top: 20px;
          position: relative;
          transition: all 0.5s;
        }
        
        .org-chart-container li {
          float: left;
          text-align: center;
          list-style-type: none;
          position: relative;
          padding: 20px 5px 0 5px;
          transition: all 0.5s;
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
  );
}
