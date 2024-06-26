'use client';
import React, { useContext, useEffect, useCallback, useRef, useState, useLayoutEffect } from 'react';
import { DataContext, Concept, Course, Skill } from '@/contexts/PageContext';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
  Node,
  Edge,
  useNodesState,
  useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";
import ContextMenu from './contextmenu';
import dagre from "dagre";

import ELK from 'elkjs/lib/elk.bundled.js';

const Graph = ({data}:{data:[Course[], Skill[], Concept[]]}) => {

  const graphRef = useRef<HTMLDivElement | null>(null);

  const width = 1200;
  const height = 800;
  const nodeWidth = 300;
  const nodeHeight = 70;

  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [menu, setMenu] = useState<{label:string, top:number, left:number, courseData: {id:string, name:string}[], type: boolean}>({
    label: "",
    top: 0,
    left: 0,
    courseData: [],
    type: false
  });

  const [contextMenuHovered, setContextMenuHovered] = useState(false);
  const [nodeHovered, setNodeHovered] = useState(false);
  const [prevContextMenuState, setPrevContextMenuState] = useState<number>(0);
  const [hoveredNode, setHoveredNode] = useState<Node>();
  const [hoverEvent, setHoverEvent] = useState<React.MouseEvent>();

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

  useEffect(() => {

    //prevState
    //0 = false && false, aka no menu
    //1 == true && false, aka node hovered
    //2 == false && true, aka contextMenu hovered
    //3 == true && true, error state?

    if (!nodeHovered && !contextMenuHovered) {
      setMenu({
        label: "",
        top: 0,
        left: 0,
        courseData: [],
        type: false
      })
      setPrevContextMenuState(0);
    } else if (nodeHovered && !contextMenuHovered) {
      if (prevContextMenuState == 0) {
        if (hoveredNode && hoverEvent && graphRef.current) {
          
          const nodeElement = (hoverEvent.target as Element).closest('.react-flow__node');
          if (nodeElement) {
            setMenu({
              label: hoveredNode.data.label,
              top: nodeElement.getBoundingClientRect().top - 5,
              left: nodeElement.getBoundingClientRect().left - nodeWidth,
              courseData: hoveredNode.data.courses,
              type: !!hoveredNode.data.courses
            });
          }
        }
        setPrevContextMenuState(1);
      }
    }
  }, [nodeHovered, contextMenuHovered])
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
      {/*<ReactFlowProvider>*/}
        <ReactFlow
          ref={graphRef}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          connectionLineType={ConnectionLineType.SmoothStep}
          onNodeClick={handleClick}
          onNodeMouseEnter={(event, node) => {setNodeHovered(true); setHoveredNode(node); setHoverEvent(event)}}
          onNodeMouseLeave={(event, node) => {setNodeHovered(false); setHoveredNode(node); setHoverEvent(event)}}
          proOptions={{hideAttribution: true}}
          fitView
        >
        <Background />
        <Controls />
        <MiniMap />
        <ContextMenu {...menu} onHover={setContextMenuHovered} graphType={graphType}/>
        </ReactFlow>
      {/*</ReactFlowProvider>*/}
    </div>
  )
}

export default Graph;

const setGraphCourses = (graphType: string, data:[Course[], Skill[], Concept[]]): [Node[], Edge[]] => {
  if (graphType == "Concepts") {
    console.log(data[2][0]);
    const node:Node[] = data[2].map((
      {
        id,
        concept_name,
        courses
      } : Concept
    ) => (
      {
        id, 
        data : {
          label: concept_name,
          courses: courses.map(courseId => {
            return {
              id: courseId,
              name: data[0][parseInt(courseId)].course_name
            }              
          })
        },
        position: {x:0, y:0}
      }
    ));

    let links: Edge[] = [];
    let i = 0;
    for (const concept of data[2]) {
      for (const prereqId of concept.prereqs) {
        const link:Edge = {
          'type': 'smoothstep',
          'source': prereqId.toString(), 
          'target': concept.id,
          'id': i.toString()
        }
        links.push(link);
        i++;
      }
    }

    return [node, links]
  } else if (graphType == "Skills") {
        const node:Node[] = data[1].map((
      {
        id,
        skill_name,
        courses
      } : Skill
    ) => (
      {
        id, 
        data : {
          label: skill_name,
          courses: courses.map(courseId => {
            return {
              id: courseId,
              name: data[0][parseInt(courseId)].course_name
            } 
          })
        },
        position: {x:0, y:0}
      }
    ));
    console.log(node);
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