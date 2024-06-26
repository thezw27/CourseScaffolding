'use client';
import React, { useState, useEffect } from 'react';
import Input from './input';
import SelectSearch, { SelectedOptionValue } from 'react-select-search';
import 'react-select-search/style.css';
import { Concept, Course, Skill } from '@/contexts/PageContext';

export default function Admin({data}:{data: [Course[], Skill[], Concept[]]}) {


  const courseData = data[0].map(({ id, course_name } : { id:string, course_name:string }) => ({ name: course_name, value: id }));
  courseData.unshift(({ name: "New Course",  value: data[0].length.toString(), }));

  const skillData = data[1].map(({ id, skill_name } : { id:string, skill_name:string }) => ({ name: skill_name, value: id }));
  skillData.unshift(({ name: "New Skill",  value: data[1].length.toString(), }));

  const conceptData = data[2].map(({ id, concept_name } : { id:string, concept_name:string }) => ({ name: concept_name, value: id }));
  conceptData.unshift(({ name: "New Concept",  value: data[2].length.toString(), }));

  const [type, setType] = useState('Courses');
  const [form, setForm] = useState(<form></form>)
  
  const [id, setId] = useState('Select a course, skill, or concept');
  
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
  const [buttonName, setButtonName] = useState('Edit');
  const [options, setOptions] = useState<{ name: string; value: string; }[]>([]);

  const handleSubmit = (event : React.ChangeEvent<HTMLSelectElement> | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (buttonName == "Create") {
      let postData;
      if (type == 'Concepts') {
        postData = {
          "id": id,
          "name": name,
          "desc": desc,
          "skills": [],
          "courses": [],
          "links": []
        }
      } else if (type == "Courses") {
        postData = {
          "id": id,
          "depcode": deptcode,
          "coursecode": coursecode,
          "name": name,
          "desc": desc,
          "prereq": [],
          "coreq": [],
          "followups": [],
          "skills": [],
          "concepts": []
        }
      } else {
        postData = {
          "id": id,
          "name": name,
          "desc": desc,
          "concepts": [],
          "courses": [],
          "links": []
        }
      }

      fetch('http://localhost:3000/db/' + type.toLowerCase(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      })
      .then(resp => {
        if (!resp.ok) {
          throw new Error("Creation Failed. " + resp.statusText);
        }
        
        alert("Success!");
        console.log("Success!");
      })
      .catch(err => {
        alert('ERROR!: ' + err)
        console.log(err);
      })
    } else {
      let putData = {};
      if (type == 'Concepts') {
        putData = {
          "id": id,
          "name": name,
          "desc": desc
        }
      } else if (type == "Courses") {
        putData = {
          "id": id,
          "depcode": deptcode,
          "coursecode": coursecode,
          "name": name,
          "desc": desc
        }
      } else {
        putData = {
          "id": id,
          "name": name,
          "desc": desc
        }
      }

      fetch('http://localhost:3000/db/' + type.toLowerCase() + '/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(putData)
      })
      .then(resp => {
        if (!resp.ok) {
          throw new Error("Update Failed. " + resp.statusText);
        }
        console.log("Success!");
      })
      .catch(err => {
        console.log(err);
        alert("Error! " + err);
      })
    }
  }

  useEffect(() => {
    switch (type) {
      case 'Courses':
        setOptions(courseData);
        setForm(
            <form className="flex flex-col m-1" onSubmit={(event) => handleSubmit(event)}>
              
              <Input status="locked" name="Course ID" id="id" setter={setId} value={id} />
              <Input name="Course Name" id="name" setter={setName} value={name} />
              <Input name="Department" id="dept" setter={setDeptcode} value={deptcode} />
              <Input name="Course Code" id="code" setter={setCoursecode} value={coursecode} />
              <Input name="Description" id="desc" setter={setDesc} value={desc} />   
              <button className="btn btn-primary" type="submit">{buttonName}</button>
            </form>
        )
        break;
      case 'Skills':
        setOptions(skillData);
        setForm(
            <form className="flex flex-col m-1" onSubmit={(event) => handleSubmit(event)}>
              
              <Input status="locked" name="Skill ID" id="id" setter={setId} value={id} />
              <Input name="Skill Name" id="name" setter={setName} value={name} />
              <Input name="Description" id="desc" setter={setDesc} value={desc} /> 
              <button className="btn btn-primary" type="submit">{buttonName}</button>  

            </form>
        )
        break; 
      case 'Concepts':
        setOptions(conceptData);
        setForm(
          
            <form className="flex flex-col m-1" onSubmit={(event) => handleSubmit(event)}>
              
              <Input status="locked" name="Course ID" id="id" setter={setId} value={id} />
              <Input name="Course Name" id="name" setter={setName} value={name} />
              <Input name="Description" id="desc" setter={setDesc} value={desc} />  
              <button className="btn btn-primary" type="submit">{buttonName}</button>   

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
    <div style={{width: 1200, height:800}} className="mx-auto w-1/2 flex flex-col justify-center">
      <label htmlFor="type">Type</label>
      <select name="type" className="custom-input" onChange={(event) => {setType(event.target.value)}}>
        <option>Courses</option>
        <option>Concepts</option>
        <option>Skills</option>
      </select>
      <SelectSearch options={options} search={true} autoComplete='on' onChange={(event) => 
        updateFields(data, event.toString(), type, setName, setDesc, setDeptcode, setCoursecode, setConcepts, setCourses, setSkills, setLinks, setPrereqs, setCoreqs, setFollowups, setId, setButtonName)
      } />
      {form}
    </div>
  )
}

const updateFields = (data: any[], event : string, type : string, setName : React.Dispatch<React.SetStateAction<string>>, setDesc : React.Dispatch<React.SetStateAction<string>>, setDeptcode : React.Dispatch<React.SetStateAction<string>>, setCoursecode : React.Dispatch<React.SetStateAction<string>>, setConcepts : React.Dispatch<React.SetStateAction<string>>, setCourses : React.Dispatch<React.SetStateAction<string>>, setSkills : React.Dispatch<React.SetStateAction<string>>, setLinks : React.Dispatch<React.SetStateAction<string>>, setPrereqs : React.Dispatch<React.SetStateAction<string>>, setCoreqs : React.Dispatch<React.SetStateAction<string>>, setFollowups : React.Dispatch<React.SetStateAction<string>>, setId : React.Dispatch<React.SetStateAction<string>>, setButtonName : React.Dispatch<React.SetStateAction<string>>) => {
  if (!event) event = '0';
  let i = 0;
  switch (type) {
    case 'Courses':
      i = 0;
      break;
    case 'Skills':
      i = 1;
      break;
    case 'Concepts':
      i = 2;
      break;
    default:
      i = -1;
      break;
  }

  //If event == new course
  if (event == data[i].length) {

    setId(data[i].length);
    setName("Add a name");
    setDesc("Add a description");
    setDeptcode("What department is this couse in?");
    setCoursecode("What is the 4 digit course code for this class?");
    setButtonName("Create");

  } else {

    setDesc(data[i][event].description);
    setId(data[i][event].id);
    setButtonName("Edit");

    if (i == 0) {
      setName(data[i][event].course_name);
      setDeptcode(data[i][event].department_code);
      setCoursecode(data[i][event].course_code);
      setConcepts(data[i][event].concepts);
      setSkills(data[i][event].skills);
      setPrereqs(data[i][event].prereqs);
      setCoreqs(data[i][event].coreqs);
      setFollowups(data[i][event].followups);
    } else if (i == 1) {
      setName(data[i][event].skill_name);
      setConcepts(data[i][event].concepts);
      setCourses(data[i][event].courses);
      setLinks(data[i][event].links);
    } else if (i == 2) {
      setName(data[i][event].concept_name);
      setSkills(data[i][event].skills);
      setCourses(data[i][event].courses);
      setLinks(data[i][event].links);
    }
  }
}