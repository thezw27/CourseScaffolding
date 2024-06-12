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

export interface DataType {
  currentNodes: Node[],
  setNodes: (nodes: Node[]) => void,
  currentEdges: Edge[],
  setEdges: (edges: Edge[]) => void,
  onNodesChange: OnNodesChange,
  onEdgesChange: OnEdgesChange,
  courses: Course[], setCourses: (courses: Course[]) => void,
  concepts: Concept[], setConcepts: (courses: Concept[]) => void,
  skills: Skill[], setSkills: (courses: Skill[]) => void,
  graphType: string, setGraphType: (val: string) => void
}

export const DataContext = createContext<DataType>({
  currentNodes: [],
  setNodes: (nodes: Node[]) => {},
  currentEdges: [],
  setEdges: (edges: Edge[]) => {},
  onNodesChange: (changes: NodeChange[]) => {},
  onEdgesChange: (changes: EdgeChange[]) => {},
  courses: [], setCourses: (courses: Course[]) => {},
  concepts: [], setConcepts: (courses: Concept[]) => {},
  skills: [], setSkills: (courses: Skill[]) => {},
  graphType: "Courses", setGraphType: (val: string) => {}
})

export default function PageContext({
  children
}: {
  children: React.ReactNode;
}) {  
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  
  const [graphType, setGraphType] = useState<string>("Courses");

  const [currentNodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [currentEdges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  return (
    <DataContext.Provider
      value={{
        currentNodes, setNodes,
        currentEdges, setEdges,
        onNodesChange,
        onEdgesChange,
        courses, setCourses,
        skills, setSkills,
        concepts, setConcepts,
        graphType, setGraphType
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
