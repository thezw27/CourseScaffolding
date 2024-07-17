import React from 'react';
import Header from "../../../components/header";

export default async function Page({params}) {
  const resp = await fetch("http://localhost:3000/db/courses/" + params.id);
  const temp = await resp.json();
  const data = temp[0];

  const courseRelationList = populateCourses(data);
  const relationships = populateRelationships(data);

  return (
    <main>
      <Header/>
      <div className="flex flex-col justify-center" style={{paddingTop: '15vh'}}>
        <div>
          <h1 className="text-center text-3xl font-bold m-2">{data.course_name}</h1>
          <h2 className="text-center text-xl font-semibold m-2">{data.department_code} {data.course_code}</h2>
          <p className="text-center m-2">{data.description}</p>
        </div>
        <div className="flex justify-center ">
          {courseRelationList}
          {relationships}
        </div>
        </div>
    </main>
  )
}
  
const populateCourses = async (data) => {

  let prereqList = [];
  let coreqList = [];
  let followupList = [];

  for (let i = 0; i < data.prereqs.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/courses/" + data.prereqs[i]);
      const d = await resp.json();

      prereqList.push(<li className="link" key={d[0].id}><a href= {'/courses/' + d[0].id} > { d[0].course_name } </a></li>);
    } catch (err) {
      console.log(err);
    }
  }

  for (let i = 0; i < data.coreqs.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/courses/" + data.coreqs[i]);
      const d = await resp.json();

      coreqList.push(<li className="link" key={d[0].id}><a href= {'/courses/' + d[0].id} > { d[0].course_name } </a></li>);
    } catch (err) {
      console.log(err);
    }
  }

  for (let i = 0; i < data.followups.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/courses/" + data.followups[i]);
      const d = await resp.json();

      followupList.push(<li className="link" key={d[0].id}><a href= {'/courses/' + d[0].id} > { d[0].course_name } </a></li>);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-1/3 text-center">

      <h3>Prerequisites</h3>
      <ul className="mb-4">{prereqList}</ul>

      <h3>Corequisities</h3>
      <ul className="mb-4">{coreqList}</ul>

      <h3>Follow Up Courses</h3>
      <ul className="mb-4">{followupList}</ul>

    </div>
  );
}

const populateRelationships = async (data) => {

  let skillsList = [];
  let conceptsList = [];

  for (let i = 0; i < data.skills.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/skills/" + data.skills[i]);
      const d = await resp.json();
      console.log(d);
      skillsList.push(<li className="link" key={d[0].id}><a href= {'/skills/' + d[0].id} > { d[0].skill_name } </a></li>);
    } catch (err) {
      console.log(err);
    }
  }

  for (let i = 0; i < data.concepts.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/concepts/" + data.concepts[i]);
      const d = await resp.json();

      conceptsList.push(<li className="link" key={d[0].id}><a href= {'/concepts/' + d[0].id} > { d[0].concept_name } </a></li>);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-1/3 text-center">

      <h3>Skills used in this course</h3>
      <ul className="mb-4">{skillsList}</ul>

      <h3>Concepts learned in this course</h3>
      <ul className="mb-4">{conceptsList}</ul>

    </div>
  );
}