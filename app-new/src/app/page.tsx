import Menu from '../components/menu';
import Graph from '../components/graph';
import Header from "../components/header";
import React from 'react';
import { Concept, Course, Skill } from '@/contexts/PageContext';


export default async function Home() {

  const data: [Course[], Skill[], Concept[]] = await fetchData();
  
  return (
    <main>
      <Header />
      <div className="flex items-center justify-center">
        <Menu />
        <Graph data={data} />
      </div>
    </main>
  );
}

const fetchData = async (): Promise<[Course[], Skill[], Concept[]]> => {
  try {
    const cresp = await fetch('http://67.242.77.142:8000/db/courses');
    const sresp = await fetch('http://67.242.77.142:8000/db/skills');
    const coresp = await fetch('http://67.242.77.142:8000/db/concepts');

    const cdata = await cresp.json();
    const sdata = await sresp.json();
    const codata = await coresp.json();

    return [cdata, sdata, codata]
  } catch (err) {
    console.log(err);
  }
  return [[],[],[]]
}

