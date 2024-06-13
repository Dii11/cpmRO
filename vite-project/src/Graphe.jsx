import React, { useEffect, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import { determineCheminCritique, generateNodesAndEdges } from './Fonction';

function PertCpmDiagram({ tasks }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const { nodes: initialNodes, edges: initialEdges } = generateNodesAndEdges(tasks);
    setNodes(initialNodes);
    setEdges(initialEdges);
    // Calculate the critical path
    const criticalPath = determineCheminCritique(tasks);
    highlightCriticalPath(initialNodes, initialEdges, criticalPath);
  }, [tasks]);

  const onNodesChange = (changes) => {
    const updatedNodes = applyNodeChanges(changes, nodes);
    setNodes(updatedNodes);

    // Sauvegarder les positions récentes dans le localStorage
    const nodePositions = updatedNodes.reduce((acc, node) => {
      acc[node.id] = { x: node.position.x, y: node.position.y, taskName: node.data.task.taskName };
      return acc;
    }, {});
    localStorage.setItem('nodePositions', JSON.stringify(nodePositions));
  };

  const onEdgesChange = (changes) => setEdges((eds) => applyEdgeChanges(changes, eds));
  const onConnect = (params) => setEdges((eds) => addEdge({ ...params, label: 'New Task' }, eds));

  const highlightCriticalPath = (nodes, edges, criticalPath) => {
    const updatedNodes = nodes.map(node => ({
      ...node,
      style: {
        ...node.style,
        background: criticalPath.includes(node.data.task.taskName) ? 'yellow' : 'white'
      }
    }));
    const updatedEdges = edges.map(edge => ({
      ...edge,
      style: {
        ...edge.style,
        stroke: criticalPath.includes(edge.label.split(' ')[0]) ? 'yellow' : 'black'
      }
    }));

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  return (
    <ReactFlowProvider>
      <div style={{ width: '90vw', height: '70vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

export default PertCpmDiagram;
