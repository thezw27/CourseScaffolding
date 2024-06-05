import Menu from '../components/menu';
//import Graph from '../components/graph';
import TestGraph from '../components/testgraph';
import React from 'react';

export default async function Home() {

  const data  = await fetchAll();

  return (
    <main className="flex min-h-screen items-center justify-between p-24">
      <Menu />
      <TestGraph data={data} />
    </main>
  );
}

const fetchAll = async () => {
  const DB_URL = 'http://localhost:3000/db/courses';

  try {
    const resp = await fetch(DB_URL, {cache: 'no-cache'});
    if (!resp.ok) {
      console.log(resp);
      throw new Error('Fetch Failed.');
    }
    const data = await resp.json();

    const nodes = data.map((
      {
        id, 
        department_code, 
        course_code, 
        course_name
      } : {
        id : string,
        department_code : string,
        course_code : number,
        course_name : string
      }
    ) => (
      {
        id, 
        department_code, 
        course_code, 
        course_name,
        position: {x:0, y:0}
      }
    ));

    let links = [];
    for (const course of data ) {
      for (const prereqId of course.prereqs) {
        const link = {
          'source': prereqId, 
          'target': course.id
        }
        links.push(link);
      }
    }
    return [nodes, links];
  } catch (err) {
    console.log("An error occurred: ", err);
    return [[], []];
  }
}