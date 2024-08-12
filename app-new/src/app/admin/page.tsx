import React from 'react';
import Admin from '../../components/admin';
import { Concept, Course, Skill } from '@/contexts/PageContext';

const DB = process.env.DB;

export default async function Page() {
  
  const data: [Course[], Skill[], Concept[]] = await fetchData();

  return (
    <main>
      <Admin data={data} />
    </main>
  )
}

const fetchData = async (): Promise<[Course[], Skill[], Concept[]]> => {
  try {
    const cresp = await fetch(DB + '/courses', {cache: 'no-cache'});
    const sresp = await fetch(DB + '/skills', {cache: 'no-cache'});
    const coresp = await fetch(DB + '/concepts', {cache: 'no-cache'});

    const cdata = await cresp.json();
    const sdata = await sresp.json();
    const codata = await coresp.json();

    return [cdata, sdata, codata]
  } catch (err) {
    console.log(err);
  }
  return [[],[],[]]
}
