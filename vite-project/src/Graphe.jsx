import React, { useCallback, useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'reactflow';
 
import 'reactflow/dist/style.css';
 
export default function App({ initialEdges, initialNodes }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const nodeTypes = {
    annotation: AnnotationNode,
    tools: ToolbarNode,
    resizer: ResizerNode,
    circle: CircleNode,
    textinput: TextNode,
  };
  const onConnect = useCallback(
    (params) => {
      // Vérifier s'il y a une source et une cible
      if (params.source && params.target) {
        // Ajouter un nouveau bord avec la source et la cible
        const newEdge = {
          id: `${params.source}-${params.target}`, // Utilisez une identifiant unique pour chaque bord
          source: params.source,
          target: params.target,
        };
        // Mettre à jour les bords
        setEdges((edges) => [...edges, newEdge]);
      }
    },
    [setEdges],
  );
 
  return (
    <div style={{ width: '90vw', height: '70vh', backgroundColor: 'green' }}>
      <ReactFlow
      
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      />
    </div> 
  );
}
