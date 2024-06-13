import React, { useState } from 'react';
import ReactFlow, { removeElements, addEdge } from 'reactflow';

const App = () => {
  const [elements, setElements] = useState([
    { id: '1', type: 'input', data: { label: 'Node 1', ports: { output: [{ id: 'out1', type: 'output' }, { id: 'out2', type: 'output' }, { id: 'out3', type: 'output' }] } }, position: { x: 100, y: 100 } },
    { id: '2', type: 'output', data: { label: 'Node 2' }, position: { x: 300, y: 100 } },
    { id: '3', type: 'output', data: { label: 'Node 3' }, position: { x: 300, y: 200 } },
  ]);

  const handleEdgeConnect = (params) => {
    setElements((els) => addEdge(params, els));
  };

  const handleEdgeDelete = (edgeId) => {
    setElements((els) => removeElements([{ id: edgeId }], els));
  };

  return (
    <div style={{ height: 500 }}>
      <ReactFlow
        elements={elements}
        onConnect={handleEdgeConnect}
        onEdgeDelete={handleEdgeDelete}
        snapToGrid={true}
        snapGrid={[15, 15]}
      />
    </div>
  );
};

export default App;
