import React from 'react';
import Admin from '../../components/admin';

export default async function Page() {
  const data = await getData();

  return (
    <Admin data={data} />
  )
}

async function getData() {

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

async function getObj(id) {
  const resp = await fetch('http://localhost:3000/db/courses/' + id);
  const data = await resp.json();
}