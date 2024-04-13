//All API calls

const express = require('express');
const app = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

require('dotenv').config();
const MONGO = process.env.MONGO;

const conceptSchema = new mongoose.Schema({
  id: Number,
  concept_name: String,
  description: String,
  skillss: [Number],
  courses: [Number],
  links: [String]
});
const Concept = mongoose.model('Concept', conceptSchema);

const coursesSchema = new mongoose.Schema({
  id: Number,
  department_code: String,
  course_code: String,
  course_name: String,
  description: String,
  prereqs: [Number],
  coreqs: [Number],
  followups: [Number],
  skills: [Number],
  concepts: [Number]
});
const Course = mongoose.model('Course', coursesSchema);

const skillsSchema = new mongoose.Schema({
  id: Number,
  skill_name: String,
  description: String,
  concepts: [Number],
  courses: [Number],
  links: [String]
});
const Skill = mongoose.model('Skill', skillsSchema);


mongoose.connect(MONGO);


/*
============ 
/concepts
============
*/

app.get('/concepts', async (req, res) => {

  

  try {
    const data = await Concept.find({});
    //console.log(data);
    res.send(data);
  } catch (err) {
    //console.log(err);
  }
  
  ;
})

app.post('/concepts', urlencodedParser, async (req, res) => {

  const id = req.body.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const skills = req.body.skills;
  const courses = req.body.courses;
  const links = req.body.links;

  

  try {
    const concept = new Concept({
      "id": id,
      "concept_name": name,
      "description": desc,
      "skills": skills,
      "courses": courses,
      "links": links
    })
    await concept.save();
    res.status("201");
    res.send({"Message": "Success!"});
  } catch (err) {
    //console.log(err);
  }

  ;
})

app.put('/concepts', urlencodedParser, async (req, res) => {
  
  const name = req.body.name;
  const desc = req.body.desc;
  const skills = req.body.skills;
  const courses = req.body.courses;
  const links = req.body.links;

  

  try {
    await Concept.updateMany({}, {
      "concept_name": name,
      "description": desc,
      "skills": skills,
      "courses": courses,
      "links": links
    })
    res.status(200);
    res.send({"Message": "Successfully updated!"});
  } catch (err) {
    //console.log(err);
    res.status(500);
    res.send({"Message": "Error: " + err})
  }

  ;
})

app.delete('/concepts', async (req, res) => {

  

  try {
    await Concept.deleteMany();
    //console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    //console.log(err);
    res.send({"Message": "ERROR!" + err})
  }

  ;

})

/*
============ 
/concepts/:id
============
*/

app.get('/concepts/:id', async (req, res) => {
  
  const id = req.params.id;

  
  
  try {
    const data = await Concept.find({"id": id});
    //console.log(data);
    res.send(data);
  } catch (err) {
    //console.log(err);
  }
  
  ;
})

app.post('/concepts/:id', (req, res) => {
  res.set("Allow", "GET, PUT, DELETE");
  res.status(405);
  res.send({"Message":"Method Not Allowed"});
})

app.put('/concepts/:id', urlencodedParser, async (req, res) => {

  const id = req.params.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const skills = req.body.skills;
  const courses = req.body.courses;
  const links = req.body.links;

  

  try {
    await Concept.updateOne({"id": id}, {
      "concept_name": name,
      "description": desc,
      "skills": skills,
      "courses": courses,
      "links": links
    })
    res.status(200);
    res.send({"Message": "Successfully updated!"});
  } catch (err) {
    //console.log(err);
    res.status(500);
    res.send({"Message": "Error: " + err})
  }

  ;
})

app.delete('/concepts/:id', async (req, res) => {
  
  const id = req.params.id;

  

  try {
    await Concept.deleteOne({"id": id});
    //console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    //console.log(err);
    res.send({"Message": "ERROR!" + err})
  }

  ;

})

/*
============ 
/courses
============
*/

app.get('/courses', async (req, res) => {

  
  
  try {
    const data = await Course.find({});
    //console.log(data);
    res.send(data);
  } catch (err) {
    //console.log(err);
  }
  
  ;
})

app.post('/courses', async (req, res) => {

  const id = req.body.id;
  const depcode = req.body.depcode;
  const coursecode = req.body.coursecode;
  const name = req.body.name;
  const desc = req.body.desc;
  const prereq = req.body.prereq;
  const coreq = req.body.coreqs;
  const followups = req.body.followups;
  const skills = req.body.skills;
  const concepts = req.body.courses;

  

  try {
    const course = new Course({
      "id": id,
      "department_code": depcode,
      "course_code": coursecode,
      "course_name": name,
      "description": desc,
      "prereqs": prereq,
      "coreqs": coreq,
      "followups": followups,
      "skills": skills,
      "concepts": concepts
    })
    await course.save();
    res.status("201");
    res.send({"Message": "Success!"});
  } catch (err) {
    //console.log(err);
  }

  ;
})

app.put('/courses', urlencodedParser, async (req, res) => {
  
  const depcode = req.body.depcode;
  const coursecode = req.body.coursecode;
  const name = req.body.name;
  const desc = req.body.desc;
  const prereq = req.body.prereq;
  const coreq = req.body.coreqs;
  const followups = req.body.followups;
  const skills = req.body.skills;
  const concepts = req.body.courses;

  

  try {
    await Course.updateMany({}, {
      "department_code": depcode,
      "course_code": coursecode,
      "course_name": name,
      "description": desc,
      "prereqs": prereq,
      "coreqs": coreq,
      "followups": followups,
      "skills": skills,
      "concepts": concepts
    })
    
    res.status(200);
    res.send({"Message": "Successfully updated!"});

  } catch (err) {
    //console.log(err);
    res.status(500);
    res.send({"Message": "Error: " + err})
  }

  ;
})

app.delete('/courses', async (req, res) => {

  

  try {
    await Course.deleteMany();
    //console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    //console.log(err);
    res.send({"Message": "ERROR!" + err})
  }

  ;
})

/*
============ 
/courses/:id
============
*/

app.get('/courses/:id', async (req, res) => {

  const id = req.params.id;

  

  try {
    const data = await Course.find({"id": id});
    //console.log(data);
    res.send(data);
  } catch (err) {
    //console.log(err);
  }
  
  ;
})

app.post('/courses/:id', (req, res) => {
  res.set("Allow", "GET, PUT, DELETE");
  res.status(405);
  res.send({"Message":"Method Not Allowed"});  
})

app.put('/courses/:id', urlencodedParser, async (req, res) => {
  
  const id = req.params.id;
  const depcode = req.body.depcode;
  const coursecode = req.body.coursecode;
  const name = req.body.name;
  const desc = req.body.desc;
  const prereq = req.body.prereq;
  const coreq = req.body.coreqs;
  const followups = req.body.followups;
  const skills = req.body.skills;
  const concepts = req.body.courses;

  

  try {
    await Course.updateOne({"id": id}, {
      "department_code": depcode,
      "course_code": coursecode,
      "course_name": name,
      "description": desc,
      "prereqs": prereq,
      "coreqs": coreq,
      "followups": followups,
      "skills": skills,
      "concepts": concepts
    })
    
    res.status(200);
    res.send({"Message": "Successfully updated!"});
    
  } catch (err) {
    //console.log(err);
    res.status(500);
    res.send({"Message": "Error: " + err})
  }

  ;
})

app.delete('/courses/:id', async (req, res) => {
  
  const id = req.params.id;

  

  try {
    await Course.deleteOne({"id": id});
    //console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    //console.log(err);
    res.send({"Message": "ERROR!" + err})
  }

  ;

})

/*
============ 
/skills
============
*/

app.get('/skills', async (req, res) => {

  
  
  try {
    const data = await Skill.find({});
    //console.log(data);
    res.send(data);
  } catch (err) {
    //console.log(err);
  }
  
  ;
})

app.post('/skills', async (req, res) => {
  
  const id = req.body.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const concepts = req.body.concepts;
  const courses = req.body.courses;
  const links = req.body.links;

  

  try {
    const skill = new Skill({
      "id": id,
      "skill_name": name,
      "description": desc,
      "concepts": concepts,
      "courses": courses,
      "links": links
    })
    await skill.save();
    res.status("201");
    res.send({"Message": "Success!"});
  } catch (err) {
    //console.log(err);
  }

  ;
})

app.put('/skills', urlencodedParser, async (req, res) => {
  
  const id = req.params.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const concepts = req.body.concepts;
  const courses = req.body.courses;
  const links = req.body.links;

  

  try {
    await Course.updateMany({}, {
      "id": id,
      "skill_name": name,
      "description": desc,
      "concepts": concepts,
      "courses": courses,
      "links": links
    })
    
    res.status(200);
    res.send({"Message": "Successfully updated!"});
    
  } catch (err) {
    //console.log(err);
    res.status(500);
    res.send({"Message": "Error: " + err})
  }

  ;
})

app.delete('/skills', async (req, res) => {

  

  try {
    await Skill.deleteMany();
    //console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    //console.log(err);
    res.send({"Message": "ERROR!" + err})
  }

  ;
})

/*
============ 
/skills/:id
============
*/

app.get('/skills/:id', async (req, res) => {

  const id = req.params.id;

  
  
  try {
    const data = await Skill.find({"id": id});
    //console.log(data);
    res.send(data);
  } catch (err) {
    //console.log(err);
  }
  
  ;
})

app.post('/skills/:id', (req, res) => {
  res.set("Allow", "GET, PUT, DELETE");
  res.status(405);
  res.send({"Message":"Method Not Allowed"});
})

app.put('/skills/:id', urlencodedParser, async (req, res) => {
  
  const id = req.params.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const concepts = req.body.concepts;
  const courses = req.body.courses;
  const links = req.body.links;

  

  try {
    await Skill.updateOne({"id": id}, {
      "id": id,
      "skill_name": name,
      "description": desc,
      "concepts": concepts,
      "courses": courses,
      "links": links
    })
    
    res.status(200);
    res.send({"Message": "Successfully updated!"});
    
  } catch (err) {
    //console.log(err);
    res.status(500);
    res.send({"Message": "Error: " + err})
  }

  ;
})

app.delete('/skills/:id', async (req, res) => {
  
  const id = req.params.id;

  

  try {
    await Skill.deleteOne({"id": id});
    //console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    //console.log(err);
    res.send({"Message": "ERROR!" + err})
  }

  ;

})
module.exports = app;