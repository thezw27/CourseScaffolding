'use client';
import React, { useContext, useEffect, useCallback, useRef, useState } from 'react';
import { DataContext } from '@/contexts/PageContext';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Position
} from "reactflow";
import "reactflow/dist/style.css";
import ContextMenu from './contextmenu';
import dagre from "dagre";

//import { DataContext } from "@/contexts/PageContext";

export interface Course {
  id: string,
  department_code: string,
  course_code: string,
  course_name: string,
  description: string,
  prereqs: string[],
  followups: string[],
  coreqs: string[],
  skills: string[],
  concepts: string[]
}

export interface Concept {
  id: string,
  concept_name: string,
  description: string,
  skills: string[],
  courses: string[],
  links: {
    name: string,
    description: string,
    link: string
  }[]
}

export interface Skill {
  id: string,
  skill_name: string,
  description: string,
  concepts: string[],
  courses: string[],
  links: {
    name: string,
    description: string,
    link: string
  }[]
}

const Graph = ({data}:{data:[Course[], Skill[], Concept[]]}) => {

  const ref = useRef<HTMLDivElement | null>(null);

  const width = 1200;
  const height = 800;
  const nodeWidth = 212;
  const nodeHeight = 36;

  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [menu, setMenu] = useState<{label:string, top:number, left:number}>({
    label: "",
    top: 0,
    left: 0
  });

  const { graphType } = useContext(DataContext)

  useEffect(() => {

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const [tempNodes, tempEdges] = setGraphCourses(graphType, data);
    const [tempNodes2, tempEdges2] = getLayoutedElements(dagreGraph, tempNodes, tempEdges, nodeWidth, nodeHeight);
    setNodes(tempNodes2); setEdges(tempEdges2);

  }, [data, graphType])

  
  const handleClick = (event: React.MouseEvent, node: Node) => {
    window.location.href = '/' + graphType.toLowerCase() + '/' + node.id;
  }

  const handleRightClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Prevent native context menu from showing
      event.preventDefault();
      if (ref.current) {
        setMenu({
        label: node.data.label,
        top: event.clientY - ref.current.getBoundingClientRect().y,
        left: event.clientX - ref.current.getBoundingClientRect().x
      });
      }
    },
    [setMenu],
  );
  const onPaneClick = useCallback((event:React.MouseEvent) => setMenu({
    label: "",
    top: 0,
    left: 0
  }), [setMenu]);

  return (
    <div className="flex" style={{ width: width, height: height}}>
      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        proOptions={{hideAttribution: true}}
        connectionLineType={ConnectionLineType.SmoothStep}
        onNodeClick={handleClick}
        onPaneClick={onPaneClick}
        onNodeContextMenu={handleRightClick}
        fitView
      >
      <Background />
      <Controls />
      <MiniMap />
      <ContextMenu {...menu}/>
      </ReactFlow>
    </div>
  )
}

export default Graph;

const getLayoutedElements = (dagreGraph: any, nodes: Node[], edges: Edge[], nodeWidth: number, nodeHeight: number): [Node[], Edge[]] => {

  dagreGraph.setGraph({ rankdir: "TB", ranker: "longest-path" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });
  return [nodes, edges]
};

const setGraphCourses = (graphType: string, data:[Course[], Skill[], Concept[]]): [Node[], Edge[]] => {
  if (graphType == "Concepts") {
    const node:Node[] = data[2].map((
      {
        id,
        concept_name
      } : {
        id : string,
        concept_name : string
      }
    ) => (
      {
        id, 
        data : {
          label: concept_name
        },
        position: {x:0, y:0}
      }
    ));

    let links: Edge[] = [];
    let i = 0;
    /*
    for (const course of data[2]) {
      for (const prereqId of course.prereqs) {
        const link:Edge = {
          'type': 'smoothstep',
          'source': prereqId.toString(), 
          'target': course.id,
          'id': i.toString()
        }
        links.push(link);
        i++;
      }
    }
    */
    return [node, links]
  } else if (graphType == "Skills") {
        const node:Node[] = data[1].map((
      {
        id,
        skill_name
      } : {
        id : string,
        skill_name : string
      }
    ) => (
      {
        id, 
        data : {
          label: skill_name
        },
        position: {x:0, y:0}
      }
    ));

    let links: Edge[] = [];
    let i = 0;
    /*
    for (const course of data[1]) {
      for (const prereqId of course.prereqs) {
        const link:Edge = {
          'type': 'smoothstep',
          'source': prereqId.toString(), 
          'target': course.id,
          'id': i.toString()
        }
        links.push(link);
        i++;
      }
    }
    */
    return [node, links]
  } else {
        const node:Node[] = data[0].map((
      {
        id,
        course_name
      } : {
        id : string,
        department_code : string,
        course_code : string,
        course_name : string
      }
    ) => (
      {
        id, 
        data : {
          label: course_name
        },
        position: {x:0, y:0}
      }
    ));

    let links: Edge[] = [];
    let i = 0;
    for (const course of data[0]) {
      for (const prereqId of course.prereqs) {
        const link:Edge = {
          'type': 'smoothstep',
          'source': prereqId.toString(), 
          'target': course.id,
          'id': i.toString()
        }
        links.push(link);
        i++;
      }
    }
    return [node, links]
  }
};