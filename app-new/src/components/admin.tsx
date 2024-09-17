'use client';
import React, { useState, useEffect } from 'react';
import Input from './input';
import Select, { MultiValue, SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import Header from "../components/header";
//import SelectSearch, { SelectedOptionValue } from 'react-select-search';
//import 'react-select-search/style.css';
import { Concept, Course, Skill, Group, Link, SelectOption } from '@/contexts/PageContext';

const DB = process.env.NEXT_PUBLIC_DB;

export default function Admin({data}:{data: [Course[], Skill[], Concept[], Group[]]}) {

  const animatedComponents = makeAnimated();
  const customStyles = {
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      transform: state.selectProps.menuPlacement === 'top' ? 'rotate(180deg)' : null,
    }),
  };

  const courseData: SelectOption[] = data[0]
    .map(({ id, course_name } : { id:number, course_name:string }) => ({ label: course_name, value: id }))
    .sort((a, b) => a.label.localeCompare(b.label));
  courseData.unshift(({ label: "New Course",  value: courseData.length > 0 ? Math.max(...courseData.map(item => item.value)) + 1 : 0 }));

  const skillData: SelectOption[] = data[1]
    .map(({ id, skill_name } : { id:number, skill_name:string }) => ({ label: skill_name, value: id }))
    .sort((a, b) => a.label.localeCompare(b.label));
  skillData.unshift(({ label: "New Skill",  value: skillData.length > 0 ? Math.max(...skillData.map(item => item.value)) + 1 : 0 }));

  const conceptData: SelectOption[] = data[2]
    .map(({ id, concept_name } : { id:number, concept_name:string }) => ({ label: concept_name, value: id }))
    .sort((a, b) => a.label.localeCompare(b.label));
  conceptData.unshift(({ label: "New Concept",  value: conceptData.length > 0 ? Math.max(...conceptData.map(item => item.value)) + 1 : 0 }));

  console.log(data);
  console.log("hi");
  const groupData: SelectOption[] = data[3]
    .map(({ id, group_name } : { id:number, group_name:string }) => ({ label: group_name, value: id}))
    .sort((a, b) => a.label.localeCompare(b.label));
  groupData.unshift(({ label: "New Group", value: groupData.length > 0 ? Math.max(...groupData.map(item => item.value)) + 1 : 0 }));
  

  const [type, setType] = useState<'Courses' | 'Concepts' | 'Skills' | 'Groups'>('Courses');
  const [form, setForm] = useState<React.JSX.Element>(<form></form>);
  const [resourceButton, setResourceButton] = useState<React.JSX.Element>(<div></div>);
  const [resourceMenuButton, setResourceMenuButton] = useState<React.JSX.Element>(<div></div>);
  
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
  const [resources, setResources] = useState<Link[]>([]);
  const [resourceOptions, setResourceOptions] = useState<SelectOption[]>([]);
  const [resourceId, setResourceId] = useState<number>(0);
  const [resourceName, setResourceName] = useState<string>('');
  const [resourceLink, setResourceLink] = useState<string>('');
  const [resourceType, setResourceType] = useState<'video' | 'article'>('video');
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [resourceEditToggle, setResourceEditToggle] = useState<'hidden' | 'block'>('hidden');
  const [children, setChildren] = useState<number[]>([]);

  //0 is none, 1 is create, 2 is edit/delete
  const [resourceButtonId, setResourceButtonId] = useState<number>(0);
  const [selectedResource, setSelectedResource] = useState<SingleValue<SelectOption>>();
  
  const [buttonType, setButtonType] = useState<'exists' | 'new'>('new');
  const [button, setButton] = useState<React.JSX.Element>();

  const [objVal, setObjVal] = useState<SingleValue<SelectOption>>(courseData[0]);

  //true to start, then false permenantly
  const [init, setInit] = useState<boolean>(true);

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
    },
    {
      label: "Groups",
      value: "Groups"
    }
  ]

  const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    const reqType: string = ((event.nativeEvent as SubmitEvent).submitter!.id);
    let reqData;

    if (reqType.startsWith('r')) {
      reqData = {
        'id': resourceId,
        'name': resourceName,
        'type': resourceType,
        'link': resourceLink
      }
    } else {

      if (type == 'Concepts') {
        reqData = {
          "id": id,
          "name": name,
          "desc": desc,
          "skills": skills.map(o => o.value),
          "courses": courses.map(o => o.value),
          "prereqs": prereqs.map(o => o.value),
          "followups": followups.map(o => o.value),
          "coreqs": coreqs.map(o => o.value),
          "links": resources
        }
      } else if (type == "Courses") {
        reqData = {
          "id": id,
          "name": name,
          "depcode": deptcode,
          "coursecode": coursecode,
          "desc": desc,
          "skills": skills.map(o => o.value),
          "concepts": concepts.map(o => o.value),
          "prereqs": prereqs.map(o => o.value),
          "followups": followups.map(o => o.value),
          "coreqs": coreqs.map(o => o.value)
        }
      } else if (type == "Skills") {
        reqData = {
          "id": id,
          "name": name,
          "desc": desc,
          "concepts": concepts.map(o => o.value),
          "courses": courses.map(o => o.value),
          "prereqs": prereqs.map(o => o.value),
          "followups": followups.map(o => o.value),
          "coreqs": coreqs.map(o => o.value),
          "links": resources
        }
      } else if (type == "Groups") {
        reqData = {
          "id": id,
          "name": name,
          "desc": desc,
          "children": children
        }
      }

    }

    if (reqType == "create") {
      fetch(DB + '/' + type.toLowerCase(), {
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
        
        alert("Created Successfully!");
        console.log("Success!");
        window.location.href = "/admin";
      })
      .catch(err => {
        alert('ERROR!: ' + err)
        console.log(err);
      })
    } else if (reqType == "edit") {
      fetch(DB + '/' + type.toLowerCase() + '/' + id, {
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
        alert("Edited Successfully!");
        console.log("Success!");
        window.location.href = "/admin";
      })
      .catch(err => {
        console.log(err);
        alert("Error! " + err);
      })
    } else if (reqType == "delete") {
     
      fetch(DB + '/' + type.toLowerCase() + '/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(resp => {
        if (!resp.ok) {
          throw new Error("Delete Failed. " + resp.statusText);
        }
        alert("Deleted Successfully!");
        console.log("Success!");
        window.location.href = "/admin";
      })
      .catch(err => {
        console.log(err);
        alert("Error! " + err);
      })
    } else if (reqType == 'rcreate') {
      fetch(DB + '/resources/' + type.toLowerCase() + '/' + id, {
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
        alert("Created Successfully!");
        console.log("Success!");
        window.location.href = "/admin";
      })
      .catch(err => {
        alert('ERROR!: ' + err)
        console.log(err);
      })
    } else if (reqType == 'redit') {
      fetch(DB + '/resources/' + type.toLowerCase() + '/' + id, {
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
        alert("Edited Successfully!");
        console.log("Success!");
        window.location.href = "/admin";
      })
      .catch(err => {
        alert('ERROR!: ' + err)
        console.log(err);
      })
    } else if (reqType == 'rdelete') {
      fetch(DB + '/resources/' + type.toLowerCase() + '/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqData)
      })
      .then(resp => {
        if (!resp.ok) {
          throw new Error("Deletion Failed. " + resp.statusText);
        }
        alert("Deleted Successfully!");
        console.log("Success!");
        window.location.href = "/admin";
      })
      .catch(err => {
        alert('ERROR!: ' + err)
        console.log(err);
      })
    }
  }

  const editResources = () => {
    setResourceEditToggle('block');
  };

  const closeResources = () => {
    setResourceEditToggle('hidden');
    setSelectedResource(undefined);
  };

  const updateFields = (event: number, setType = 'none') => {
    let i = 0;
    if (setType == 'none') {
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
        case 'Groups':
          i = 3;
          break;
        default:
          i = -1;
          break;
      }
    } else {
      switch (setType) {
        case 'Courses':
          i = 0;
          break;
        case 'Skills':
          i = 1;
          break;
        case 'Concepts':
          i = 2;
          break;
        case 'Groups':
          i = 3;
          break;
        default:
          i = -1;
          break;
      }
    };

    //If event == new course
    if (event == Math.max(...data[i].map(item => item.id)) + 1 || data[i].length == 0) {

      setId(data[i].length > 0 ? Math.max(...data[i].map(item => item.id)) + 1 : 0);
      setName("Add a name");
      setDesc("Add a description");
      setDeptcode("What department is this course in?");
      setCoursecode("What is the 4 digit course code for this class?");
      setButtonType("new");
      setCourses([]);
      setConcepts([]);
      setSkills([]);
      setPrereqs([]);
      setCoreqs([]);
      setFollowups([]);
      setResources([]);
      setResourceOptions([]);
      setResourceName('');
      setResourceLink('');
      setResourceType('video');
      setChildren([]);
      
      toggleResourceMenuButton(0);

    } else {

      setDesc(data[i].find(obj => obj.id === event)!.description);
      setId(data[i].find(obj => obj.id === event)!.id);
      setButtonType("exists");
      
      toggleResourceMenuButton(1);
      
      if (i == 0) {
        setName(data[i].find(obj => obj.id === event)!.course_name);
        setDeptcode(data[i].find(obj => obj.id === event)!.department_code);
        setCoursecode(data[i].find(obj => obj.id === event)!.course_code);
        setConcepts(data[i].find(obj => obj.id === event)!.concepts.map(id => conceptData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
        setSkills(data[i].find(obj => obj.id === event)!.skills.map(id => skillData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
        setPrereqs(data[i].find(obj => obj.id === event)!.prereqs.map(id => courseData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
        setCoreqs(data[i].find(obj => obj.id === event)!.coreqs.map(id => courseData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
        setFollowups(data[i].find(obj => obj.id === event)!.followups.map(id => courseData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
      } else if (i == 1) {
        setName(data[i].find(obj => obj.id === event)!.skill_name);
        setConcepts(data[i].find(obj => obj.id === event)!.concepts.map(id => conceptData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
        setCourses(data[i].find(obj => obj.id === event)!.courses.map(id => courseData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
        setPrereqs(data[i].find(obj => obj.id === event)!.prereqs.map(id => skillData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
        setCoreqs(data[i].find(obj => obj.id === event)!.coreqs.map(id => skillData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
        setFollowups(data[i].find(obj => obj.id === event)!.followups.map(id => skillData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
        setResources(data[i].find(obj => obj.id === event)!.links);
        let cntr = 0;
        setResourceOptions(data[i].find(obj => obj.id === event)!.links.map(({ name } : { name:string }) => ({ 
          label: name, 
          value: cntr++ 
        })));
      } else if (i == 2) {
        setName(data[i].find(obj => obj.id === event)!.concept_name);
        setSkills(data[i].find(obj => obj.id === event)!.skills.map(id => skillData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
        setCourses(data[i].find(obj => obj.id === event)!.courses.map(id => courseData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
        setPrereqs(data[i].find(obj => obj.id === event)!.prereqs.map(id => conceptData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
        setCoreqs(data[i].find(obj => obj.id === event)!.coreqs.map(id => conceptData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
        setFollowups(data[i].find(obj => obj.id === event)!.followups.map(id => conceptData.find(c => c.value === id)).filter((c): c is SelectOption => c !== undefined));
        setResources(data[i].find(obj => obj.id === event)!.links);
        let cntr = 0;
        setResourceOptions(data[i].find(obj => obj.id === event)!.links.map(({ name } : { name:string }) => ({ 
          label: name, 
          value: cntr++ 
        })));
      } else if (i == 3) {
        setChildren(data[i].find(obj => obj.id === event)!.children);
      }
      setResourceName('');
      setResourceLink('');
      setResourceType('video');
    }
  };

  const toggleResourceMenuButton = (e: number) => {
    if (e == 1) {
      setResourceMenuButton(
        <button className="btn btn-primary" type="button" onClick={editResources}>Edit Resources</button>
      )
    } else {
      setResourceMenuButton(
        <button className="btn btn-primary opacity-50 cursor-not-allowed" type="button">Create the {type.toLowerCase().slice(0, -1)} before adding resources!</button>
      )
    }
  };

  const updateResourceFields = (event:string) => {
    const resource =  resources.find(obj => obj.name === event);
    if (resource) {
      setResourceName(resource.name);
      setResourceLink(resource.link);
      setResourceType(resource.type);
      setResourceId(resource.id);
      setResourceButtonId(2);
    } else {
      setResourceName("Enter a name");
      setResourceLink("Enter a Link");
      setResourceType('video');
      setResourceId(resources.length > 0 ? Math.max(...resources.map(link => link.id)) + 1 : 0);
      setResourceButtonId(1);
    }
  };

  useEffect(() => {
    if (resourceButtonId == 1) {
      setResourceButton(
        <div>
          <button className="btn btn-primary" type="submit" id="rcreate">Create</button>  
        </div>
      )
    } else if (resourceButtonId == 2) {
      setResourceButton( 
        <div>
          <button className="btn btn-primary" type="submit" id="redit">Edit</button>  
          <button className="btn btn-danger" type="submit" id="rdelete">Delete</button>  
        </div>
      )
    }
  }, [resourceButtonId]);

  useEffect(() => {
    if (buttonType == "new") {
      setButton(
        <div>
          <button className="btn btn-primary" id="create" type="submit">Create</button>   
        </div>
      )
    } else {
      setButton(
        <div>
          <button className="btn btn-primary" id="edit" type="submit">Edit</button>
          <button className="btn btn-danger" id="delete" type="submit">Delete</button>
        </div>
      )
    }
  }, [buttonType]);

  useEffect(() => {
    switch (type) {
      case 'Courses':
        setOptions(courseData);
        setForm(
            <form className="flex flex-col m-1" onSubmit={handleSubmit}>
              
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
              
              <label htmlFor="skillSelect">Related Courses</label>
              <Select styles={customStyles} options={courseData.slice(1)} value={coreqs} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setCoreqs(event)}}/>
              
              <label htmlFor="conceptSelect">Follow up Courses</label>
              <Select styles={customStyles} options={courseData.slice(1)} value={followups} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setFollowups(event)}}/>
              
              {button}
            </form>
        )
        break;
      case 'Skills':
        setOptions(skillData);
        setForm(
            <form className="flex flex-col m-1" onSubmit={handleSubmit}>
              
              <Input name="Skill Name" id="name" setter={setName} value={name} />
              <Input name="Description" id="desc" setter={setDesc} value={desc} /> 

              <label htmlFor="conceptSelect">Connected Concepts</label>
              <Select styles={customStyles} options={conceptData.slice(1)} value={concepts} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setConcepts(event)}}/>
              
              <label htmlFor="skillSelect">Connected Courses</label>
              <Select styles={customStyles} options={courseData.slice(1)} value={courses} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setCourses(event)}}/>
              
              <label htmlFor="conceptSelect">Prerequisite Skills</label>
              <Select styles={customStyles} options={skillData.slice(1)} value={prereqs} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setPrereqs(event)}}/>
              
              <label htmlFor="skillSelect">Related Skills</label>
              <Select styles={customStyles} options={skillData.slice(1)} value={coreqs} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setCoreqs(event)}}/>
              
              <label htmlFor="conceptSelect">Follow up Skills</label>
              <Select styles={customStyles} options={skillData.slice(1)} value={followups} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setFollowups(event)}}/>
              
              {resourceMenuButton}
              <div className={resourceEditToggle + ' w-3/5 h-3/5 absolute z-50 bg-white border-2 border-black p-10'}>
              
                <Select 
                  id="resource"
                  options={[{label: "New Resource", value: resources.length > 0 ? Math.max(...resources.map(link => link.id)) + 1 : 0 }, ...resourceOptions]} 
                  defaultValue={resourceOptions[0]}
                  onChange={(event) => updateResourceFields((event as {label: string}).label)
                  }
                />
                <Input name="Resource Name" id="rname" setter={setResourceName} value={resourceName} />
                <Input name="Resource Link" id="rlink" setter={setResourceLink} value={resourceLink} />
                <label htmlFor="Resource Type">Resource Type</label>
                <Select name="Resource Type" id="rtype" options={[{label: "Video", value: "video"}, {label: "Article", value: "article"}]} value={{label: resourceType.charAt(0).toUpperCase() + resourceType.slice(1), value: resourceType}} onChange={(event) => {setResourceType((event as {value: string}).value as "article" | "video")}} />

                {resourceButton}
                <button className="btn btn-primary" type="button" onClick={closeResources}>Close</button>
              </div>

              {button}

            </form>
        )
        break; 
      case 'Concepts':
        setOptions(conceptData);
        setForm(
          
          <form className="flex flex-col m-1" onSubmit={handleSubmit}>
            
            <Input name="Concept Name" id="name" setter={setName} value={name} />
            <Input name="Description" id="desc" setter={setDesc} value={desc} />  

            <label htmlFor="conceptSelect">Connected Skills</label>
            <Select styles={customStyles} options={skillData.slice(1)} value={skills} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setSkills(event)}}/>
            
            <label htmlFor="skillSelect">Connected Courses</label>
            <Select styles={customStyles} options={courseData.slice(1)} value={courses} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setCourses(event)}}/>
            
            <label htmlFor="conceptSelect">Prerequisite Concepts</label>
            <Select styles={customStyles} options={conceptData.slice(1)} value={prereqs} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setPrereqs(event)}}/>
            
            <label htmlFor="skillSelect">Related Concepts</label>
            <Select styles={customStyles} options={conceptData.slice(1)} value={coreqs} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setCoreqs(event)}}/>
            
            <label htmlFor="conceptSelect">Follow up Concepts</label>
            <Select styles={customStyles} options={conceptData.slice(1)} value={followups} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setFollowups(event)}}/>

            {resourceMenuButton}
            <div className={resourceEditToggle + ' w-3/5 h-3/5 absolute z-50 bg-white border-2 border-black p-10'}>
            
              <Select 
                id="resource"
                options={[{label: "New Resource", value: resources.length > 0 ? Math.max(...resources.map(link => link.id)) + 1 : 0 }, ...resourceOptions]} 
                value={selectedResource}
                onChange={(event) => {updateResourceFields((event as {label: string}).label); setSelectedResource(event);}
                }
              />

              <Input name="Resource Name" id="rname" setter={setResourceName} value={resourceName} />
              <Input name="Resource Link" id="rlink" setter={setResourceLink} value={resourceLink} />
              <label htmlFor="Resource Type">Resource Type</label>
              <Select name="Resource Type" id="rtype" options={[{label: "Video", value: "video"}, {label: "Article", value: "article"}]} value={{label: resourceType.charAt(0).toUpperCase() + resourceType.slice(1), value: resourceType}} onChange={(event) => {setResourceType((event as {value: string}).value as "article" | "video")}} />

              {resourceButton}
              <button className="btn btn-primary" type="button" onClick={closeResources}>Close</button>
            </div>
            
            {button}

          </form>
        )
        break;
      case 'Groups':
        setOptions(groupData);
        setForm(
          
          <form className="flex flex-col m-1" onSubmit={handleSubmit}>
            
            <Input name="Concept Name" id="name" setter={setName} value={name} />
            <Input name="Description" id="desc" setter={setDesc} value={desc} />  

            <label htmlFor="conceptSelect">Courses in this group</label>
            <Select styles={customStyles} options={courseData.slice(1)} value={courseData.filter(obj => children.includes(obj.value))} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setChildren(event.map(obj => obj.value))}}/>
        
            {button}

          </form>
        )
        break;
        
        default:
        setForm(
          <p>Error!</p>
        )
        break;
    }
  }, [type, id, name, deptcode, coursecode, desc, concepts, courses, prereqs, coreqs, skills, followups, resourceEditToggle, resourceLink, resourceName, resourceType, resourceButton, selectedResource, resourceMenuButton, button, resourceId, children])

  useEffect(() => {
    if (options && init) {
      setObjVal(options[0]);
      if (options[0]) {
        updateFields(options[0].value);
        setInit(false);
    console.log('no');
      }
    }
  }, [type, form]);

  useEffect(() => {
    //setObjVal(options[0]);
    console.log('n1o');
  }, [options]);

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
            setType((event as { value: string }).value as "Courses" | "Concepts" | "Skills" | "Groups" );
            updateFields(0, (event as { value: string }).value as "Courses" | "Concepts" | "Skills" | "Groups");
          }}
        />
        <label htmlFor="objSelect">{type}</label>
        <Select
          id="objSelect" 
          options={options}
          value={objVal} 
          onChange={(event) => { updateFields((event as { value: number}).value); setObjVal(event); console.log(event); }}
          />
        {form}
      </div>
    </div>
  )
}