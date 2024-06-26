import React from 'react';
import { Concept, Course, Skill } from '@/contexts/PageContext';


export default async function Page({params} : {params:{id:string}}) {
  const resp = await fetch("http://localhost:3000/db/skills/" + params.id);
  const temp = await resp.json();
  const data:Skill = temp[0];
  console.log(data);

  //const links = populateLinks(data);
  const relationships = populateRelationships(data);

  return (
    <main className="flex flex-col justify-center m-10">
      <div>
        <h1 className="text-center text-3xl font-bold m-2">{data.skill_name}</h1>
        <p className="text-center m-2">{data.description}</p>
      </div>
      <div className="flex justify-center">
        {/*links*/}
        {relationships}
      </div>
    </main>
  )
}
  /*
const populateLinks = (data: Skill) => {

  let linksList = [];
  console.log(data);
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
*/
const populateRelationships = async (data: Skill) => {

  let conceptsList = [];
  let coursesList = [];
  let preReqList = [];
  let followUpList = [];

  for (let i = 0; i < data.concepts.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/concepts/" + data.concepts[i]);
      const d = await resp.json();

      conceptsList.push(<li style={{color: 'blue'}} key={d[0].id}><a href= {'/concepts/' + d[0].id} > { d[0].concept_name } </a></li>);
    } catch (err) {
      console.log(err);
    }
  }

  for (let i = 0; i < data.courses.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/courses/" + data.courses[i]);
      const d = await resp.json();

      coursesList.push(<li style={{color: 'blue'}} key={d[0].id}><a href= {'/courses/' + d[0].id} > { d[0].course_name } </a></li>);
    } catch (err) {
      console.log(err);
    }
  }

  for (let i = 0; i < data.prereqs.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/skills/" + data.prereqs[i]);
      const d = await resp.json(); 

      preReqList.push(<li style={{color: 'blue'}} key={d[0].id}><a href= {'/skills/' + d[0].id} > { d[0].skill_name } </a></li>);
    } catch (err) {
      console.log(err);
    }
  }

  for (let i = 0; i < data.followups.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/skills/" + data.followups[i]);
      const d = await resp.json();

      followUpList.push(<li style={{color: 'blue'}} key={d[0].id}><a href= {'/skills/' + d[0].id} > { d[0].skill_name } </a></li>);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-1/3 text-center">

      <h3>Fundamental concepts</h3>
      <ul className="mb-4">{conceptsList}</ul>

      <h3>Courses that teach about this concept</h3>
      <ul className="mb-4">{coursesList}</ul>

      <h3>Prerequisite Skills</h3>
      <ul className="mb-4">{preReqList}</ul>

      <h3>Follow Up Skills</h3>
      <ul className="mb-4">{followUpList}</ul>

    </div>
  );
}