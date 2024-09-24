import Menu from '../components/menu';
import Graph from '../components/graph';
import Header from "../components/header";
import React from 'react';
import { Concept, Course, Skill, Group } from '@/contexts/PageContext';

const DB = process.env.DB;

export default async function Home() {

  const data: [Course[], Skill[], Concept[], Group[]] = await fetchData();
  
  return (
    <main>
      <Header />
      <div className="flex items-center justify-center">
        <Menu data = {data[3]} />
        <Graph data={[data[0], data[1], data[2]]} />
      </div>
    </main>
  );
}

const fetchData = async (): Promise<[Course[], Skill[], Concept[], Group[]]> => {
  try {
    const cresp = await fetch(DB + '/courses', {cache: 'no-cache'});
    const sresp = await fetch(DB + '/skills', {cache: 'no-cache'});
    const coresp = await fetch(DB + '/concepts', {cache: 'no-cache'});
    const gresp = await fetch(DB  + '/groups', {cache: 'no-cache'});

    const cdata = await cresp.json();
    const sdata = await sresp.json();
    const codata = await coresp.json();
    const gdata = await gresp.json();

    return [cdata, sdata, codata, gdata]
  } catch (err) {
    console.log(err);
  }
  return [[],[],[],[]]
}
