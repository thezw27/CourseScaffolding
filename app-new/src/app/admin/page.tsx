import React from 'react';
import Admin from '../../components/admin';
import { Concept, Course, Skill } from '@/contexts/PageContext';

export default async function Page() {
  
  const data: [Course[], Skill[], Concept[]] = await fetchData();

  return (
    <main className="flex min-h-screen items-center justify-between">
      <Admin data={data} />
    </main>
  )
}

const fetchData = async (): Promise<[Course[], Skill[], Concept[]]> => {
  try {
    const cresp = await fetch('http://localhost:3000/db/courses', {cache: 'no-cache'});
    const sresp = await fetch('http://localhost:3000/db/skills', {cache: 'no-cache'});
    const coresp = await fetch('http://localhost:3000/db/concepts', {cache: 'no-cache'});

    const cdata = await cresp.json();
    const sdata = await sresp.json();
    const codata = await coresp.json();

    return [cdata, sdata, codata]
  } catch (err) {
    console.log(err);
  }
  return [[],[],[]]
}
