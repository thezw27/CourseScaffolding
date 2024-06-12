import Menu from '../components/menu';
import Graph from '../components/graph';
import React from 'react';

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


export default async function Home() {

  const data: [Course[], Skill[], Concept[]] = await fetchData();
  
  return (
    <main className="flex min-h-screen items-center justify-between">
      <Menu />
      <Graph data={data} />
    </main>
  );
}

const fetchData = async (): Promise<[Course[], Skill[], Concept[]]> => {
  try {
    const cresp = await fetch('http://localhost:3000/db/courses');
    const sresp = await fetch('http://localhost:3000/db/skills');
    const coresp = await fetch('http://localhost:3000/db/concepts');

    const cdata = await cresp.json();
    const sdata = await sresp.json();
    const codata = await coresp.json();

    return [cdata, sdata, codata]
  } catch (err) {
    console.log(err);
  }
  return [[],[],[]]
}

