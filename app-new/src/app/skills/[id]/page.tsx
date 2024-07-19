import React from 'react';
import Header from "../../../components/header";

export default async function Page({params}) {
  const resp = await fetch("http://localhost:3000/db/skills/" + params.id);
  const temp = await resp.json();
  const data = temp[0];

  const skillRelationList = populateSkills(data);
  const relationships = populateRelationships(data);
  const links = populateLinks(data);

  return (
    <main>
      <Header/>
      <div className="flex flex-col justify-center" >
        <div>
          <h1 className="text-center text-3xl font-bold m-2">{data.skill_name}</h1>
          <p className="text-center m-2">{data.description}</p>
        </div>
        <div className="flex justify-center ">
          {skillRelationList}
          {relationships}
        </div>
        {links}
      </div>
    </main>
  )
}
  
const populateSkills = async (data) => {

  let prereqList = [];
  let coreqList = [];
  let followupList = [];

  for (let i = 0; i < data.prereqs.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/skills/" + data.prereqs[i]);
      const d = await resp.json();

      prereqList.push(<li className="link" key={d[0].id}><a href= {'/skills/' + d[0].id} > { d[0].skill_name } </a></li>);
    } catch (err) {
      console.log(err);
    }
  }

  for (let i = 0; i < data.coreqs.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/skills/" + data.coreqs[i]);
      const d = await resp.json();

      coreqList.push(<li className="link" key={d[0].id}><a href= {'/skills/' + d[0].id} > { d[0].skill_name } </a></li>);
    } catch (err) {
      console.log(err);
    }
  }
  console.log(data);
  for (let i = 0; i < data.followups.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/skills/" + data.followups[i]);
      const d = await resp.json();
      console.log(d);
      followupList.push(<li className="link" key={d[0].id}><a href= {'/skills/' + d[0].id} > { d[0].skill_name } </a></li>);
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

      <h3>Follow Up skills</h3>
      <ul className="mb-4">{followupList}</ul>

    </div>
  );
}

const populateRelationships = async (data) => {

  let coursesList = [];
  let conceptsList = [];

  for (let i = 0; i < data.courses.length; i++) {
    try {
      const resp = await fetch("http://localhost:3000/db/courses/" + data.courses[i]);
      const d = await resp.json();

      coursesList.push(<li className="link" key={d[0].id}><a href= {'/courses/' + d[0].id} > { d[0].course_name } </a></li>);
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

      <h3>Courses that use this skill</h3>
      <ul className="mb-4">{coursesList}</ul>

      <h3>Concepts related to this skill</h3>
      <ul className="mb-4">{conceptsList}</ul>

    </div>
  );
}

const populateLinks = async (data) => {
  let linkList = [];
  for (let i = 0; i < data.links.length; i++) {
    linkList.push(<li className="link"><a href={data.links[i].link}>{data.links[i].name}</a></li> )
  }
  return (
    <div>
      <h3>Resources</h3>
      <ul className="mb-4">{linkList}</ul>
    </div>
  )
}