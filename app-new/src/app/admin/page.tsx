import React from 'react';
import { Concept, Course, Skill, Group, User } from '@/contexts/PageContext';
import AuthCheck from '@/components/authcheck';

const DB = process.env.DB;

export default async function Page() {
  
  const data: [Course[], Skill[], Concept[], Group[], User] = await fetchData();

  return (
    <main>
      <AuthCheck data={data} />
    </main>
  )
}

const fetchData = async (): Promise<[Course[], Skill[], Concept[], Group[], User[]]> => {
  try {
    const cresp = await fetch(DB + '/courses', {cache: 'no-cache'});
    const sresp = await fetch(DB + '/skills', {cache: 'no-cache'});
    const coresp = await fetch(DB + '/concepts', {cache: 'no-cache'});
    const gresp = await fetch(DB  + '/groups', {cache: 'no-cache'});
    const uresp = await fetch(DB + '/users', {cache: 'no-cache'});

    const cdata = await cresp.json();
    const sdata = await sresp.json();
    const codata = await coresp.json();
    const gdata = await gresp.json();
    const udata = await uresp.json()

    return [cdata, sdata, codata, gdata, udata]
  } catch (err) {
    console.log(err);
  }
  return [[],[],[],[],[]]
}
