'use client';

import React, { createContext, useState, useEffect } from 'react';
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  useNodesState,
  useEdgesState,
  NodeChange,
  EdgeChange
} from 'reactflow';

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

export interface DataType {
  currentNodes: Node[],
  setNodes: (nodes: Node[]) => void,
  currentEdges: Edge[],
  setEdges: (edges: Edge[]) => void,
  onNodesChange: OnNodesChange,
  onEdgesChange: OnEdgesChange,
  courses: Course[],
  concepts: Concept[],
  skills: Skill[]
}

export const DataContext = createContext<DataType>({
  currentNodes: [],
  setNodes: (nodes: Node[]) => {},
  currentEdges: [],
  setEdges: (edges: Edge[]) => {},
  onNodesChange: (changes: NodeChange[]) => {},
  onEdgesChange: (changes: EdgeChange[]) => {},
  courses: [],
  concepts: [],
  skills: []
})

async function getData() {

  try {
    const cresp = await fetch('http://localhost:3000/db/courses', {cache: "no-cache"});
    const sresp = await fetch('http://localhost:3000/db/skills', {cache: "no-cache"});
    const coresp = await fetch('http://localhost:3000/db/concepts', {cache: "no-cache"});
    
    const cdata = await cresp.json();
    const sdata = await sresp.json();
    const codata = await coresp.json();

    console.log(sresp);
    return [cdata, sdata, codata]
  } catch (err) {
    console.log(err);
  }
  return [[],[],[]]
}

export default async function PageContext({
  children
}: {
  children: React.ReactNode;
}) {

  const [contextData, setContextData] = useState<{
    courses: any[];
    skills: any[];
    concepts: any[];
  }>({
    courses: [],
    skills: [],
    concepts: []
  });
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courses, skills, concepts] = await getData();
        setContextData({ courses, skills, concepts });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const [currentNodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [currentEdges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  return (
    <DataContext.Provider
      value={{
        currentNodes,
        setNodes,
        currentEdges,
        setEdges,
        onNodesChange,
        onEdgesChange,
        ...contextData
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
