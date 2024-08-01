'use client';
import React, { useState, useEffect } from 'react';
import Input from './input';
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import Header from "../components/header";
//import SelectSearch, { SelectedOptionValue } from 'react-select-search';
//import 'react-select-search/style.css';
import { Concept, Course, Skill, Link, SelectOption } from '@/contexts/PageContext';

export default function Admin({data}:{data: [Course[], Skill[], Concept[]]}) {

  const animatedComponents = makeAnimated();
  const customStyles = {
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      transform: state.selectProps.menuPlacement === 'top' ? 'rotate(180deg)' : null,
    }),
  };

  const courseData: SelectOption[] = data[0].map(({ id, course_name } : { id:number, course_name:string }) => ({ label: course_name, value: id }));
  courseData.unshift(({ label: "New Course",  value: data[0].length, }));

  const skillData: SelectOption[] = data[1].map(({ id, skill_name } : { id:number, skill_name:string }) => ({ label: skill_name, value: id }));
  skillData.unshift(({ label: "New Skill",  value: data[1].length, }));

  const conceptData: SelectOption[] = data[2].map(({ id, concept_name } : { id:number, concept_name:string }) => ({ label: concept_name, value: id }));
  conceptData.unshift(({ label: "New Concept",  value: data[2].length, }));

  const [type, setType] = useState<'Courses' | 'Concepts' | 'Skills'>('Courses');
  const [form, setForm] = useState(<form></form>);
  
  const [id, setId] = useState<number>(0);
  
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [deptcode, setDeptcode] = useState<string>('');
  const [coursecode, setCoursecode] = useState<string>('');
  const [concepts, setConcepts] = useState<MultiValue<SelectOption>>([]);
  const [skills, setSkills] = useState<MultiValue<SelectOption>>([]);
  const [courses, setCourses] = useState<MultiValue<SelectOption>>([]);
  const [prereqs, setPrereqs] = useState<MultiValue<SelectOption>>([]);
  const [coreqs, setCoreqs] = useState<MultiValue<SelectOption>>([]);
  const [followups, setFollowups] = useState<MultiValue<SelectOption>>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [buttonName, setButtonName] = useState<'Edit' | 'Create'>('Edit');
  const [options, setOptions] = useState<SelectOption[]>([]);

  const menuOptions = [
    {
      label: "Courses",
      value: "Courses"
    },
    {
      label: "Concepts",
      value: "Concepts"
    },
    {
      label: "Skills",
      value: "Skills"
    }
  ]

  const handleSubmit = (event : React.ChangeEvent<HTMLSelectElement> | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    let reqData: Concept | Skill | Course;
    if (type == 'Concepts') {
      reqData = {
        "id": id,
        "concept_name": name,
        "description": desc,
        "skills": skills.map(o => o.value),
        "courses": courses.map(o => o.value),
        "prereqs": prereqs.map(o => o.value),
        "followups": followups.map(o => o.value),
        "coreqs": coreqs.map(o => o.value),
        "links": []
      }
    } else if (type == "Courses") {
      reqData = {
        "id": id,
        "department_code": deptcode,
        "course_code": coursecode,
        "course_name": name,
        "description": desc,
        "skills": skills.map(o => o.value),
        "concepts": concepts.map(o => o.value),
        "prereqs": prereqs.map(o => o.value),
        "followups": followups.map(o => o.value),
        "coreqs": coreqs.map(o => o.value)
      }
    } else {
      reqData = {
        "id": id,
        "skill_name": name,
        "description": desc,
        "concepts": concepts.map(o => o.value),
        "courses": courses.map(o => o.value),
        "prereqs": prereqs.map(o => o.value),
        "followups": followups.map(o => o.value),
        "coreqs": coreqs.map(o => o.value),
        "links": []
      }
    }
    console.log(reqData);
    if (buttonName == "Create") {
      fetch('http://67.242.77.142:8000/db/' + type.toLowerCase(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqData)
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
      
      fetch('http://67.242.77.142:8000/db/' + type.toLowerCase() + '/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqData)
      })
      .then(resp => {
        if (!resp.ok) {
          throw new Error("Update Failed. " + resp.statusText);
        }
        alert("Success!");
        console.log("Success!");
      })
      .catch(err => {
        console.log(err);
        alert("Error! " + err);
      })
    }
  }

  const updateFields = (event: number) => {
  if (!event) event = 0;
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
      setConcepts(data[i][event].concepts.map(k => conceptData.slice(1)[k]));
      setSkills(data[i][event].skills.map(k => skillData.slice(1)[k]));
      setPrereqs(data[i][event].prereqs.map(k => courseData.slice(1)[k]));
      setCoreqs(data[i][event].coreqs.map(k => courseData.slice(1)[k]));
      setFollowups(data[i][event].followups.map(k => courseData.slice(1)[k]));
    } else if (i == 1) {
      setName(data[i][event].skill_name);
      setConcepts(data[i][event].concepts.map(k => conceptData.slice(1)[k]));
      setCourses(data[i][event].courses.map(k => courseData.slice(1)[k]));
      setPrereqs(data[i][event].prereqs.map(k => skillData.slice(1)[k]));
      setCoreqs(data[i][event].coreqs.map(k => skillData.slice(1)[k]));
      setFollowups(data[i][event].followups.map(k => skillData.slice(1)[k]));
      setLinks(data[i][event].links);
    } else if (i == 2) {
      setName(data[i][event].concept_name);
      setSkills(data[i][event].skills.map(k => skillData.slice(1)[k]));
      setCourses(data[i][event].courses.map(k => courseData.slice(1)[k]));
      setPrereqs(data[i][event].prereqs.map(k => conceptData.slice(1)[k]));
      setCoreqs(data[i][event].coreqs.map(k => conceptData.slice(1)[k]));
      setFollowups(data[i][event].followups.map(k => conceptData.slice(1)[k]));
      setLinks(data[i][event].links);
    }
  }
} 

  useEffect(() => {
    switch (type) {
      case 'Courses':
        setOptions(courseData);
        setForm(
            <form className="flex flex-col m-1" onSubmit={(event) => handleSubmit(event)}>
              
              <Input status="locked" name="Course ID" id="id" setter={setId} value={id?.toString()} />
              <Input name="Course Name" id="name" setter={setName} value={name} />
              <Input name="Department" id="dept" setter={setDeptcode} value={deptcode} />
              <Input name="Course Code" id="code" setter={setCoursecode} value={coursecode} />
              <Input name="Description" id="desc" setter={setDesc} value={desc} />

              <label htmlFor="conceptSelect">Connected Concepts</label>
              <Select styles={customStyles} options={conceptData.slice(1)} value={concepts} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setConcepts(event)}}/>
              
              <label htmlFor="skillSelect">Connected Skills</label>
              <Select styles={customStyles} options={skillData.slice(1)} value={skills} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setSkills(event)}}/>
              
              <label htmlFor="conceptSelect">Prerequisite Courses</label>
              <Select styles={customStyles} options={courseData.slice(1)} value={prereqs} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setPrereqs(event)}}/>
              
              <label htmlFor="skillSelect">Corequisite Courses</label>
              <Select styles={customStyles} options={courseData.slice(1)} value={coreqs} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setCoreqs(event)}}/>
              
              <label htmlFor="conceptSelect">Follow up Courses</label>
              <Select styles={customStyles} options={courseData.slice(1)} value={followups} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setFollowups(event)}}/>
              
              <button className="btn btn-primary" type="submit">{buttonName}</button>
            </form>
        )
        break;
      case 'Skills':
        setOptions(skillData);
        setForm(
            <form className="flex flex-col m-1" onSubmit={(event) => handleSubmit(event)}>
              
              <Input status="locked" name="Skill ID" id="id" setter={setId} value={id?.toString()} />
              <Input name="Skill Name" id="name" setter={setName} value={name} />
              <Input name="Description" id="desc" setter={setDesc} value={desc} /> 

              <label htmlFor="conceptSelect">Connected Concepts</label>
              <Select styles={customStyles} options={conceptData.slice(1)} value={concepts} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setConcepts(event)}}/>
              
              <label htmlFor="skillSelect">Connected Courses</label>
              <Select styles={customStyles} options={courseData.slice(1)} value={courses} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setCourses(event)}}/>
              
              <label htmlFor="conceptSelect">Prerequisite Skills</label>
              <Select styles={customStyles} options={skillData.slice(1)} value={prereqs} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setPrereqs(event)}}/>
              
              <label htmlFor="skillSelect">Corequisite Skills</label>
              <Select styles={customStyles} options={skillData.slice(1)} value={coreqs} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setCoreqs(event)}}/>
              
              <label htmlFor="conceptSelect">Follow up Skills</label>
              <Select styles={customStyles} options={skillData.slice(1)} value={followups} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setFollowups(event)}}/>
              
              
              <button className="btn btn-primary" type="submit">{buttonName}</button>  

            </form>
        )
        break; 
      case 'Concepts':
        setOptions(conceptData);
        setForm(
          
            <form className="flex flex-col m-1" onSubmit={(event) => handleSubmit(event)}>
              
              <Input status="locked" name="Course ID" id="id" setter={setId} value={id?.toString()} />
              <Input name="Course Name" id="name" setter={setName} value={name} />
              <Input name="Description" id="desc" setter={setDesc} value={desc} />  

              <label htmlFor="conceptSelect">Connected Skills</label>
              <Select styles={customStyles} options={skillData.slice(1)} value={skills} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setSkills(event)}}/>
              
              <label htmlFor="skillSelect">Connected Courses</label>
              <Select styles={customStyles} options={courseData.slice(1)} value={courses} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setCourses(event)}}/>
              
              <label htmlFor="conceptSelect">Prerequisite Concepts</label>
              <Select styles={customStyles} options={conceptData.slice(1)} value={prereqs} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setPrereqs(event)}}/>
              
              <label htmlFor="skillSelect">Corequisite Concepts</label>
              <Select styles={customStyles} options={conceptData.slice(1)} value={coreqs} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setCoreqs(event)}}/>
              
              <label htmlFor="conceptSelect">Follow up Concepts</label>
              <Select styles={customStyles} options={conceptData.slice(1)} value={followups} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setFollowups(event)}}/>
              
              
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
  }, [type, id, name, deptcode, coursecode, desc, concepts, courses, prereqs, coreqs, skills, followups])

  return (
    <div>
      <Header />
      <div style={{ width: 1200, height:800 }} className="mx-auto w-1/2 flex flex-col">
        <label htmlFor="type">Type</label>
        <Select 
          id="type"
          options={menuOptions} 
          defaultValue={menuOptions[0]}
          isSearchable={false}
          onChange={(event) => {
            setType((event as { value: string }).value as "Courses" | "Concepts" | "Skills" );
            updateFields(0);
          }}
        />
        <label htmlFor="objSelect">{type}</label>
        <Select
          id="objSelect" 
          options={options} 
          onChange={(event) => updateFields((event as { value: number}).value)} 
          value={options[id+1]}
          />
        {form}
      </div>
    </div>
  )
}