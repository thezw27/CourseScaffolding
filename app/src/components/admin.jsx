'use client';
import React, { useState, useEffect } from 'react';
import Input from './input';
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css';



export default function Admin({data}) {

  const selectFormattedData = data[0].map(({ id, course_name }) => ({ name: course_name, value: id }));

  const [type, setType] = useState('Courses');
  const [form, setForm] = useState(<form></form>)

  const [id, setId] = useState(0);
  
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [deptcode, setDeptcode] = useState('');
  const [coursecode, setCoursecode] = useState('');
  const [concepts, setConcepts] = useState('');
  const [skills, setSkills] = useState('');
  const [courses, setCourses] = useState('');
  const [links, setLinks] = useState('');
  const [prereqs, setPrereqs] = useState('');
  const [coreqs, setCoreqs] = useState('');
  const [followups, setFollowups] = useState('');

  useEffect(() => {
    console.log(type);
    switch (type) {
      case 'Courses':
        setForm(
          <form className="flex flex-col m-1" onSubmit={handleSubmit}>
            
            <Input status="locked" name="Course ID" id="id" setter={setId} value={id} />
            <Input name="Course Name" id="name" setter={setName} value={name} />
            <Input name="Department" id="dept" setter={setDeptcode} value={deptcode} />
            <Input name="Course Code" id="code" setter={setCoursecode} value={coursecode} />
            <Input name="Description" id="desc" setter={setDesc} value={desc} />   
            <button className="btn btn-primary" type="submit">Edit</button>
          </form>
        )
        break;
      case 'Skills':
        setForm(
          <form className="flex flex-col m-1">
            
            <Input name="Skill ID" id="id" setter={setId} value={id} />
            <Input name="Skill Name" id="name" setter={setName} value={name} />
            <Input name="Description" id="desc" setter={setDesc} value={desc} />   

          </form>
        )
        break;
      case 'Concepts':
        setForm(
          <form className="flex flex-col m-1">
            
            <Input name="Course ID" id="id" setter={setId} value={id} />
            <Input name="Course Name" id="name" setter={setName} value={name} />
            <Input name="Description" id="desc" setter={setDesc} value={desc} />   

          </form>
        )
        break;
      default:
        setForm(
          <p>Error!</p>
        )
        break;
    }

  }, [type, id, name, deptcode, coursecode, desc])

  return (
    <div className="mx-auto w-1/2 flex flex-col justify-center">
      <label htmlFor="type">Type</label>
      <select name="type" className="custom-input" onChange={(event) => {setType(event.target.value)}}>
        <option>Courses</option>
        <option>Concepts</option>
        <option>Skills</option>
      </select>
      <SelectSearch options={selectFormattedData} name="Course Name" search={true} autoComplete='on' onChange={(event) => 
        updateFields(data, event, type, setName, setDesc, setDeptcode, setCoursecode, setConcepts, setCourses, setSkills, setLinks, setPrereqs, setCoreqs, setFollowups, setId)
      } />

      {form}
    </div>
  )
}

const updateFields = (data, event, type, setName, setDesc, setDeptcode, setCoursecode, setConcepts, setCourses, setSkills, setLinks, setPrereqs, setCoreqs, setFollowups, setId) => {
  if (!event) event = 0;
  let i = 0;
  switch (type) {
    case 'courses':
      i = 0;
      break;
    case 'skills':
      i = 1;
      break;
    case 'concepts':
      i = 2;
      break;
    default:
      i = -1;
      break;
  }
  setName(data[i][event].course_name);
  setDesc(data[i][event].description);
  setId(data[i][event].id);

  if (i == 0) {
    setDeptcode(data[i][event].department_code);
    setCoursecode(data[i][event].course_code);
    setConcepts(data[i][event].concepts);
    setSkills(data[i][event].skills);
    setPrereqs(data[i][event].prereqs);
    setCoreqs(data[i][event].coreqs);
    setFollowups(data[i][event].followups);
  } else if (i == 1) {
    setConcepts(data[i][event].concepts);
    setCourses(data[i][event].courses);
    setLinks(data[i][event].links);
  } else if (i == 2) {
    setSkills(data[i][event].skills);
    setCourses(data[i][event].courses);
    setLinks(data[i][event].links);
  }
}

const handleSubmit = () => {

}