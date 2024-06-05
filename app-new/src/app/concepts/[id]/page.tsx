import React from 'react';
export default async function Page({params}) {
  const resp = await fetch("http://localhost:3000/db/concepts/" + params.id);
  const temp = await resp.json();
  const data = temp[0];

  const links = populateLinks(data);
  const relationships = populateRelationships(data);

  return (
    <main className="flex flex-col justify-center m-10">
      <div>
        <h1 className="text-center text-3xl font-bold m-2">{data.concept_name}</h1>
        <p className="text-center m-2">{data.description}</p>
      </div>
      <div className="flex justify-center ">
        {links}
        {relationships}
      </div>
    </main>
  )
}
  
const populateLinks = (data) => {

  let linksList = [];

  for (let i = 0; i < data.links.length; i++) {
    linksList.push(<li key={i}><a href= { data.links[i].link } > { data.links[i].name } </a></li>);
  }

  return (
    <div className="w-1/3 text-center">

      <h3>Resources to learn more</h3>
      <ul className="mb-4">{linksList}</ul>

    </div>
  );
}

const populateRelationships = async (data) => {

  let skillsList = [];
  let coursesList = [];

  for (let i = 0; i < data.skills.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/skills/" + data.skills[i]);
      const d = await resp.json();

      skillsList.push(<li key={d[0].id}><a href= {'/courses/' + d[0].id} > { d[0].skill_name } </a></li>);
    } catch (err) {
      console.log(err);
    }
  }

  for (let i = 0; i < data.courses.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/courses/" + data.courses[i]);
      const d = await resp.json();

      coursesList.push(<li key={d[0].id}><a href= {'/courses/' + d[0].id} > { d[0].course_name } </a></li>);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-1/3 text-center">

      <h3>Skills related to this concept</h3>
      <ul className="mb-4">{skillsList}</ul>

      <h3>Courses that teach about this concept</h3>
      <ul className="mb-4">{coursesList}</ul>

    </div>
  );
}