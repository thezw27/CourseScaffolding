//All concept API calls

const express = require('express');
const app = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

require('dotenv').config();
const DB_PASS = process.env.DB_PASS;
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

/*
============ 
/concepts
============
*/

app.get('/concepts', async (req, res) => {

  await mongoose.connect(`mongodb+srv://user:${DB_PASS}@coursescaffold.tgx9pev.mongodb.net/scaffold?retryWrites=true&w=majority&appName=CourseScaffold`);

  try {
    const data = await Concept.find({});
    console.log(data);
    res.send(data);
  } catch (err) {
    console.log(err);
  }
  
  mongoose.connection.close();
})

app.post('/concepts', urlencodedParser, async (req, res) => {

  const id = req.body.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const skills = req.body.skills;
  const courses = req.body.courses;
  const links = req.body.links;

  await mongoose.connect(`mongodb+srv://user:${DB_PASS}@coursescaffold.tgx9pev.mongodb.net/scaffold?retryWrites=true&w=majority&appName=CourseScaffold`);

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
    console.log(err);
  }

  mongoose.connection.close();
})

app.put('/concepts', urlencodedParser, async (req, res) => {
  
  const id = req.body.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const skills = req.body.skills;
  const courses = req.body.courses;
  const links = req.body.links;

  await mongoose.connect(MONGO);

  await Concept.updateMany({}, {
    
  })

  mongoose.connection.close();
})

app.delete('/concepts', async (req, res) => {

  await mongoose.connect(MONGO);

  try {
    await Concept.deleteMany();
    console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    console.log(err);
    res.send({"Message": "ERROR!" + err})
  }

  mongoose.connection.close();

})

/*
============ 
/concepts/:id
============
*/

app.get('/concepts/:id', async (req, res) => {
  
  const id = req.params.id;

  await mongoose.connect(`mongodb+srv://user:${DB_PASS}@coursescaffold.tgx9pev.mongodb.net/scaffold?retryWrites=true&w=majority&appName=CourseScaffold`);
  
  try {
    const data = await Concept.find({"id": id});
    console.log(data);
    res.send(data);
  } catch (err) {
    console.log(err);
  }
  
  mongoose.connection.close();
})

app.post('/concepts/:id', (req, res) => {
  res.set("Allow", "GET, PUT, DELETE");
  res.status(405);
  res.send({"Message":"Method Not Allowed"});
})

app.put('/concepts/:id', (req, res) => {

})

app.delete('/concepts/:id', async (req, res) => {
  
  const id = req.params.id;

  await mongoose.connect(MONGO);

  try {
    await Concept.deleteOne({"id": id});
    console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    console.log(err);
    res.send({"Message": "ERROR!" + err})
  }

  mongoose.connection.close();

})

/*
============ 
/courses
============
*/

app.get('/courses', async (req, res) => {

  await mongoose.connect(`mongodb+srv://user:${DB_PASS}@coursescaffold.tgx9pev.mongodb.net/scaffold?retryWrites=true&w=majority&appName=CourseScaffold`);
  
  try {
    const data = await Course.find({});
    console.log(data);
    res.send(data);
  } catch (err) {
    console.log(err);
  }
  
  mongoose.connection.close();
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

  await mongoose.connect(MONGO);

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
    console.log(err);
  }

  mongoose.connection.close();
})

app.put('/courses', (req, res) => {

})

app.delete('/courses', async (req, res) => {

  await mongoose.connect(MONGO);

  try {
    await Course.deleteMany();
    console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    console.log(err);
    res.send({"Message": "ERROR!" + err})
  }

  mongoose.connection.close();
})

/*
============ 
/courses/:id
============
*/

app.get('/courses/:id', async (req, res) => {

  const id = req.params.id;

  await mongoose.connect(`mongodb+srv://user:${DB_PASS}@coursescaffold.tgx9pev.mongodb.net/scaffold?retryWrites=true&w=majority&appName=CourseScaffold`);

  try {
    const data = await Course.find({"id": id});
    console.log(data);
    res.send(data);
  } catch (err) {
    console.log(err);
  }
  
  mongoose.connection.close();
})

app.post('/courses/:id', (req, res) => {
  res.set("Allow", "GET, PUT, DELETE");
  res.status(405);
  res.send({"Message":"Method Not Allowed"});  
})

app.put('/courses/:id', (req, res) => {

})

app.delete('/courses/:id', async (req, res) => {
  
  const id = req.params.id;

  await mongoose.connect(MONGO);

  try {
    await Course.deleteOne({"id": id});
    console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    console.log(err);
    res.send({"Message": "ERROR!" + err})
  }

  mongoose.connection.close();

})

/*
============ 
/skills
============
*/

app.get('/skills', async (req, res) => {

  await mongoose.connect(`mongodb+srv://user:${DB_PASS}@coursescaffold.tgx9pev.mongodb.net/scaffold?retryWrites=true&w=majority&appName=CourseScaffold`);
  
  try {
    const data = await Skill.find({});
    console.log(data);
    res.send(data);
  } catch (err) {
    console.log(err);
  }
  
  mongoose.connection.close();
})

app.post('/skills', async (req, res) => {
  
  const id = req.body.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const concepts = req.body.concepts;
  const courses = req.body.courses;
  const links = req.body.links;

  await mongoose.connect(`mongodb+srv://user:${DB_PASS}@coursescaffold.tgx9pev.mongodb.net/scaffold?retryWrites=true&w=majority&appName=CourseScaffold`);

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
    console.log(err);
  }

  mongoose.connection.close();
})

app.put('/skills', (req, res) => {

})

app.delete('/skills', async (req, res) => {

  await mongoose.connect(MONGO);

  try {
    await Skill.deleteMany();
    console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    console.log(err);
    res.send({"Message": "ERROR!" + err})
  }

  mongoose.connection.close();
})

/*
============ 
/skills/:id
============
*/

app.get('/skills/:id', async (req, res) => {

  const id = req.params.id;

  await mongoose.connect(`mongodb+srv://user:${DB_PASS}@coursescaffold.tgx9pev.mongodb.net/scaffold?retryWrites=true&w=majority&appName=CourseScaffold`);
  
  try {
    const data = await Skill.find({"id": id});
    console.log(data);
    res.send(data);
  } catch (err) {
    console.log(err);
  }
  
  mongoose.connection.close();
})

app.post('/skills/:id', (req, res) => {
  res.set("Allow", "GET, PUT, DELETE");
  res.status(405);
  res.send({"Message":"Method Not Allowed"});
})

app.put('/skills/:id', (req, res) => {a

})

app.delete('/skills/:id', async (req, res) => {
  
  const id = req.params.id;

  await mongoose.connect(MONGO);

  try {
    await Skill.deleteOne({"id": id});
    console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    console.log(err);
    res.send({"Message": "ERROR!" + err})
  }

  mongoose.connection.close();

})


module.exports = app;