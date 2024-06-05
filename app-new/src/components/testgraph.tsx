'use client';
import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position
} from "reactflow";
import dagre from "dagre";



const TestGraph = ({data} : {data : any[]}) => {

  const width = 1200;
  const height = 800;
  const [initNodes, initEdges] = data;
      
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 150;
  const nodeHeight = 36;
  
  const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "TB") => {

    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? Position.Left : Position.Top;
      node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });

    return { nodes, edges };
  };

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initNodes, initEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
      ),
    []
  );
  
  return (
    <div className="flex" style={{ width: width, height: height}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={{hideAttribution: true}}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
      </ReactFlow>
    </div>
  )
}

export default TestGraph;