'use client';
import React, { useContext, useEffect, useCallback, useRef, useState, useLayoutEffect } from 'react';
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

import ELK, { ElkNode } from 'elkjs/lib/elk.bundled.js';


interface Course {
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

interface Concept {
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

interface Skill {
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

  const { graphType } = useContext(DataContext);

  const elk = new ELK();
  const elkOptions = {
    'elk.algorithm': 'mrtree',
    //'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    'elk.spacing.nodeNode': '160',
  };

  useEffect(() => {

    const [tempNodes, tempEdges] = setGraphCourses(graphType, data);
    setNodes(tempNodes); setEdges(tempEdges);
    const temp = getLayoutedElements(tempNodes, tempEdges)
    .then((resp) => {
      console.log(0, resp);
      if (resp.nodes)
      setNodes(resp.nodes);
      setEdges(resp.edges);
    });

  }, [data, graphType])

  const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {

    const graph = {
      id: 'root',
      layoutOptions: elkOptions,
      children: nodes.map((node) => ({
        ...node,
        'data': node.data
      })),
      edges: edges
    };

    return elk
    .layout(graph)
    .then((data) => ({
      nodes: data.children?.map((
        {
          id,
          x,
          y, 
          data
        }
      ) => (
        {
          id : id,
          data : data,
          width : nodeWidth,
          height : nodeHeight,
          position : { x: x, y: y },
          sourcePosition: "bottom",
          targetPosition: "top"          
        }
      )),
      edges: data.edges
    }))
    .catch(console.error);
  };

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
/*
  const onLayout = useCallback(
    () => {

      getLayoutedElements(nodes, edges).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        window.requestAnimationFrame(() => fitView());
      });
    },
    [nodes, edges]
  );

  useLayoutEffect(() => {
    onLayout();
  }, []);
*/
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