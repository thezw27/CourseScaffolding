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

export interface Params {
  id: string
}

export interface SelectOption {
  label: string,
  value: number
}

export interface Course {
  id: number,
  department_code: string,
  course_code: string,
  course_name: string,
  description: string,
  prereqs: number[],
  followups: number[],
  coreqs: number[],
  skills: number[],
  requiredSkills: number[],
  concepts: number[],
  requiredConcepts: number[],
  groups: number[]
}

export interface Concept {
  id: number,
  concept_name: string,
  description: string,
  skills: number[],
  courses: number[],
  prereqs: number[],
  followups: number[],
  coreqs: number[],
  links: Link[]
}

export interface Skill {
  id: number,
  skill_name: string,
  description: string,
  concepts: number[],
  courses: number[],
  prereqs: number[],
  followups: number[],
  coreqs: number[],
  links: Link[]
}

export interface Group {
  id: number,
  group_name: string,
  description: string,
  children: number[]
}

export interface User {
  id: number,
  rcsid: string,
  //0 no perms (equivalent to no account), with no access to admin page
  //1 admin (can modify all data except users)
  //2 superadmin (can modify users)
  perms: 0 | 1 | 2
}

export interface Link {
  id: number,
  link: string,
  name: string,
  type: "video" | "article"
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
  graphType: string, setGraphType: (val: string) => void,
  filteredNodes: number[], setFilteredNodes: (arr: number[]) => void
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
  graphType: "Courses", setGraphType: (val: string) => {},
  filteredNodes: [], setFilteredNodes: (arr: number[]) => {}
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

  const [filteredNodes, setFilteredNodes] = useState<number[]>([]);

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
        graphType, setGraphType,
        filteredNodes, setFilteredNodes
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
