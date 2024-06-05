import React from 'react';
import Admin from '../../components/admin';

export default async function Page() {
  const data = await getData();
  console.log(data);
  return (
    <Admin data={data} />
  )
}

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

async function getObj(id: string) {
  const resp = await fetch('http://localhost:3000/db/courses/' + id);
  const data = await resp.json();
}