//All API calls

const express = require('express');
const app = express.Router();
const mongoose = require('mongoose');

app.use(express.json());

require('dotenv').config();
const MONGO = process.env.MONGO;

const linkSchema = new mongoose.Schema({
  id: Number,
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ["video", "article"] },
  link: { type: String, required: true }
});

const conceptSchema = new mongoose.Schema({
  id: Number,
  concept_name: String,
  description: String,
  skills: [Number],
  courses: [Number],
  links:  [linkSchema],
  prereqs: [Number],
  coreqs: [Number],
  followups: [Number],
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
  requiredSkills: [Number],
  concepts: [Number],
  requiredConcepts: [Number],
  groups: [Number]
});
const Course = mongoose.model('Course', coursesSchema);

const skillsSchema = new mongoose.Schema({
  id: Number,
  skill_name: String,
  description: String,
  concepts: [Number],
  courses:[Number],
  links: [linkSchema],
  prereqs: [Number],
  coreqs: [Number],
  followups: [Number],
});
const Skill = mongoose.model('Skill', skillsSchema);


const groupsSchema = new mongoose.Schema({
  id: Number,
  group_name: String,
  description: String,
  children: [Number]
});
const Group = mongoose.model('Group', groupsSchema);

const usersSchema = new mongoose.Schema({
  rcsid: String,
  id: Number,
  perms: {
    type: [Number],    
    enum: [0, 1, 2]
  }
});
const User = mongoose.model('User', usersSchema)

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
  };
  
})

app.post('/concepts', async (req, res) => {

  const id = req.body.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const skills = req.body.skills;
  const courses = req.body.courses;
  const prereqs = req.body.prereqs;
  const coreqs = req.body.coreqs;
  const followups = req.body.followups;  


  try {

    const concept = new Concept({
      "id": id,
      "concept_name": name,
      "description": desc,
      "skills": skills,
      "courses": courses,
      "prereqs": prereqs,
      "coreqs": coreqs,
      "followups": followups
    })
    await concept.save();

    await Promise.all(
      skills.map(skill => Skill.updateOne({ 'id': skill }, { $push: { concepts: id } }))
    );

    await Promise.all(
      courses.map(course => Course.updateOne({ 'id': course }, { $push: { concepts: id } }))
    );

    await Promise.all(
      prereqs.map(prereq => Concept.updateOne({ 'id': prereq }, { $push: { followups: id } }))
    );

    await Promise.all(
      coreqs.map(coreq => Concept.updateOne({ 'id': coreq }, { $push: { coreqs: id } }))
    );

    await Promise.all(
      followups.map(followup => Concept.updateOne({ 'id': followup }, { $push: { prereqs: id } }))
    );

    res.status(201);
    res.send({"Message": "Success!"});
  } catch (err) {
    //console.log(err);
  }

  ;
})
/*
app.put('/concepts',  async (req, res) => {
  
  const name = req.body.name;
  const desc = req.body.desc;
  const skills = req.body.skills;
  const courses = req.body.courses;
  const links = req.body.links;
  const prereq = req.body.prereq;
  const coreq = req.body.coreqs;
  const followups = req.body.followups;
  

  try {
    await Concept.updateMany({}, {
      "concept_name": name,
      "description": desc,
      "prereqs": prereq,
      "coreqs": coreq,
      "followups": followups,
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
*/
/*
============ 
/concepts/:id
============
*/

app.get('/concepts/:id', async (req, res) => {
  
  const id = req.params.id;

  
  
  try {
    const data = await Concept.findOne({"id": id});
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

app.put('/concepts/:id',  async (req, res) => {

  const id = req.params.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const skills = req.body.skills;
  const courses = req.body.courses;
  const links = req.body.links
  const prereqs = req.body.prereqs;
  const coreqs = req.body.coreqs;
  const followups = req.body.followups;

  try {

    const originalConcept = await Concept.findOne({ "id": id });
    
    if (!originalConcept) {
      return res.status(404).send({"Message": "Concept not found"});
    }

    await Concept.updateOne({"id": id}, {
      "concept_name": name,
      "description": desc,
      "prereqs": prereqs,
      "coreqs": coreqs,
      "followups": followups,
      "skills": skills,
      "courses": courses,
      "links": links
    });

    const addedSkills = skills.filter(skill => !originalConcept.skills.includes(skill));
    const removedSkills = originalConcept.skills.filter(skill => !skills.includes(skill));
    
    const addedCourses = courses.filter(course => !originalConcept.courses.includes(course));
    const removedCourses = originalConcept.courses.filter(course => !courses.includes(course));

    const addedPrereqs = prereqs.filter(prereq => !originalConcept.prereqs.includes(prereq));
    const removedPrereqs = originalConcept.prereqs.filter(prereq => !prereqs.includes(prereq));

    const addedCoreqs = coreqs.filter(coreq => !originalConcept.coreqs.includes(coreq));
    const removedCoreqs = originalConcept.coreqs.filter(coreq => !coreqs.includes(coreq));

    const addedFollowups = followups.filter(followup => !originalConcept.followups.includes(followup));
    const removedFollowups = originalConcept.followups.filter(followup => !followups.includes(followup));

    //add
    await Promise.all([
      ...addedSkills.map(skill => Skill.updateOne({ 'id': skill }, { $push: { concepts: id } })),
      ...addedCourses.map(course => Course.updateOne({ 'id': course }, { $push: { concepts: id } })),
      ...addedPrereqs.map(prereq => Concept.updateOne({ 'id': prereq }, { $push: { followups: id } })),
      ...addedCoreqs.map(coreq => Concept.updateOne({ 'id': coreq }, { $push: { coreqs: id } })),
      ...addedFollowups.map(followup => Concept.updateOne({ 'id': followup }, { $push: { prereqs: id } }))
    ]);

    //remove
    await Promise.all([
      ...removedSkills.map(skill => Skill.updateOne({ 'id': skill }, { $pull: { concepts: id } })),
      ...removedCourses.map(course => Course.updateOne({ 'id': course }, { $pull: { concepts: id } })),
      ...removedPrereqs.map(prereq => Concept.updateOne({ 'id': prereq }, { $pull: { followups: id } })),
      ...removedCoreqs.map(coreq => Concept.updateOne({ 'id': coreq }, { $pull: { coreqs: id } })),
      ...removedFollowups.map(followup => Concept.updateOne({ 'id': followup }, { $pull: { prereqs: id } }))
    ]);

    res.status(200);
    res.send({"Message": "Successfully updated!"});
  } catch (err) {
    //console.log(err);
    res.status(500);
    console.error(err);
    res.send({"Message": "Error: " + err})
  };

})

app.delete('/concepts/:id', async (req, res) => {
  
  const id = req.params.id;

  try {
    const conceptToDelete = await Concept.findOne({ "id": id });

    if (!conceptToDelete) {
      return res.status(404).send({ "Message": "Concept not found" });
    }

    const { skills, courses, followups, prereqs, coreqs } = conceptToDelete;

    await Promise.all([
      ...skills.map(skill => Skill.updateOne({ 'id': skill }, { $pull: { concepts: id } })),
      ...courses.map(course => Course.updateOne({ 'id': course }, { $pull: { concepts: id } })),
      ...followups.map(followup => Concept.updateOne({ 'id': followup }, { $pull: { prereqs: id } })),
      ...prereqs.map(prereq => Concept.updateOne({ 'id': prereq }, { $pull: { followups: id } })),
      ...coreqs.map(coreq => Concept.updateOne({ 'id': coreq }, { $pull: { coreqs: id } }))
    ]);

    await Concept.deleteOne({ "id": id });
    //console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    //console.log(err);
    res.send({"Message": "ERROR!" + err})
  };

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

app.post('/courses',  async (req, res) => {

  const id = req.body.id;
  const depcode = req.body.depcode;
  const coursecode = req.body.coursecode;
  const name = req.body.name;
  const desc = req.body.desc;
  const prereqs = req.body.prereqs;
  const coreqs = req.body.coreqs;
  const followups = req.body.followups;
  const skills = req.body.skills;
  const reqskills = req.body.reqskills;
  const concepts = req.body.concepts;  
  const reqconcepts = req.body.reqconcepts; 

  try {
    const course = new Course({
      "id": id,
      "department_code": depcode,
      "course_code": coursecode,
      "course_name": name,
      "description": desc,
      "prereqs": prereqs,
      "coreqs": coreqs,
      "followups": followups,
      "skills": skills,
      "requiredSkills": reqskills,
      "concepts": concepts,
      "requiredConcepts": reqconcepts
    })
    await course.save();

    await Promise.all(
      skills.map(skill => Skill.updateOne({ id: skill }, { $push: { concepts: id } }))
    );

    await Promise.all(
      concepts.map(concept => Concept.updateOne({ id: concept }, { $push: { courses: id } }))
    );

    await Promise.all(
      prereqs.map(prereq => Course.updateOne({ id: prereq }, { $push: { followups: id } }))
    );

    await Promise.all(
      coreqs.map(coreq => Course.updateOne({ id: coreq }, { $push: { coreqs: id } }))
    );

    await Promise.all(
      followups.map(followup => Course.updateOne({ id: followup }, { $push: { prereqs: id } }))
    );
    
    res.status(201);
    res.send({"Message": "Success!"});
  } catch (err) {
    console.log(err);
  };

})
/*
app.put('/courses',  async (req, res) => {
  
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
/*
============ 
/courses/:id
============
*/

app.get('/courses/:id', async (req, res) => {

  const id = req.params.id;

  try {
    const data = await Course.findOne({"id": id});
    //console.log(data);
    res.send(data);
  } catch (err) {
    //console.log(err);
  };

})

app.post('/courses/:id', (req, res) => {
  res.set("Allow", "GET, PUT, DELETE");
  res.status(405);
  res.send({"Message":"Method Not Allowed"});  
})

app.put('/courses/:id',  async (req, res) => {
  
  const id = req.params.id;
  const depcode = req.body.depcode;
  const coursecode = req.body.coursecode;
  const name = req.body.name;
  const desc = req.body.desc;
  const prereqs = req.body.prereqs;
  const coreqs = req.body.coreqs;
  const followups = req.body.followups;
  const skills = req.body.skills;
  const concepts = req.body.concepts;
  const reqskills = req.body.reqskills;
  const reqconcepts = req.body.reqconcepts;

  try {

    const originalCourse = await Course.findOne({ "id": id });
    
    if (!originalCourse) {
      return res.status(404).send({ "Message": "Course not found" });
    }

    console.log(req.body);
    await Course.updateOne({"id": id}, {
      "department_code": depcode,
      "course_code": coursecode,
      "course_name": name,
      "description": desc,
      "prereqs": prereqs,
      "coreqs": coreqs,
      "followups": followups,
      "skills": skills,
      "requiredSkills": reqskills,
      "concepts": concepts,
      "requiredConcepts": reqconcepts
    });

    const addedSkills = skills.filter(skill => !originalCourse.skills.includes(skill));
    const removedSkills = originalCourse.skills.filter(skill => !skills.includes(skill));

    const addedConcepts = concepts.filter(concept => !originalCourse.concepts.includes(concept));
    const removedConcepts = originalCourse.concepts.filter(concept => !concepts.includes(concept));

    const addedPrereqs = prereqs.filter(prereq => !originalCourse.prereqs.includes(prereq));
    const removedPrereqs = originalCourse.prereqs.filter(prereq => !prereqs.includes(prereq));

    const addedCoreqs = coreqs.filter(coreq => !originalCourse.coreqs.includes(coreq));
    const removedCoreqs = originalCourse.coreqs.filter(coreq => !coreqs.includes(coreq));

    const addedFollowups = followups.filter(followup => !originalCourse.followups.includes(followup));
    const removedFollowups = originalCourse.followups.filter(followup => !followups.includes(followup));

    //add
    await Promise.all([
      ...addedSkills.map(skill => Skill.updateOne({ 'id': skill }, { $push: { courses: id } })),
      ...addedConcepts.map(concept => Concept.updateOne({ 'id': concept }, { $push: { courses: id } })),
      ...addedPrereqs.map(prereq => Course.updateOne({ 'id': prereq }, { $push: { followups: id } })),
      ...addedCoreqs.map(coreq => Course.updateOne({ 'id': coreq }, { $push: { coreqs: id } })),
      ...addedFollowups.map(followup => Course.updateOne({ 'id': followup }, { $push: { prereqs: id } }))
    ]);

    //remove
    await Promise.all([
      ...removedSkills.map(skill => Skill.updateOne({ 'id': skill }, { $pull: { courses: id } })),
      ...removedConcepts.map(concept => Concept.updateOne({ 'id': concept }, { $pull: { courses: id } })),
      ...removedPrereqs.map(prereq => Course.updateOne({ 'id': prereq }, { $pull: { followups: id } })),
      ...removedCoreqs.map(coreq => Course.updateOne({ 'id': coreq }, { $pull: { coreqs: id } })),
      ...removedFollowups.map(followup => Course.updateOne({ 'id': followup }, { $pull: { prereqs: id } }))
    ]);
    
    res.status(200);
    res.send({"Message": "Successfully updated!"});
    
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({"Message": "Error: " + err})
  };

})

app.delete('/courses/:id', async (req, res) => {
  
  const id = req.params.id;

  try {
    const courseToDelete = await Course.findOne({ "id": id });

    if (!courseToDelete) {
      return res.status(404).send({ "Message": "Course not found" });
    }

    const { skills, concepts, prereqs, coreqs, followups, groups } = courseToDelete;

    await Promise.all([
      ...skills.map(skill => Skill.updateOne({ 'id': skill }, { $pull: { courses: id } })),
      ...concepts.map(concept => Concept.updateOne({ 'id': concept }, { $pull: { courses: id } })),
      ...prereqs.map(prereq => Course.updateOne({ 'id': prereq }, { $pull: { followups: id } })),
      ...coreqs.map(coreq => Course.updateOne({ 'id': coreq }, { $pull: { coreqs: id } })),
      ...followups.map(followup => Course.updateOne({ 'id': followup }, { $pull: { prereqs: id } })),
      ...groups.map(group => Group.updateOne({ 'id': group }, { $pull: { children: id } }))
    ]);

    await Course.deleteOne({"id": id});
    //console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    //console.log(err);
    res.send({"Message": "ERROR!" + err})
  };

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
  const prereqs = req.body.prereqs;
  const coreqs = req.body.coreqs;
  const followups = req.body.followups;

  try {
    const skill = new Skill({
      "id": id,
      "skill_name": name,
      "description": desc,
      "prereqs": prereqs,
      "coreqs": coreqs,
      "followups": followups,
      "concepts": concepts,
      "courses": courses,
      "links": links
    })
    await skill.save();

    await Promise.all(
      courses.map(course => Course.updateOne({ 'id': course }, { $push: { skills: id } }))
    );

    await Promise.all(
      concepts.map(concept => Concept.updateOne({ 'id': concept }, { $push: { skills: id } }))
    );

    await Promise.all(
      prereqs.map(prereq => Skill.updateOne({ 'id': prereq }, { $push: { followups: id } }))
    );

    await Promise.all(
      coreqs.map(coreq => Skill.updateOne({ 'id': coreq }, { $push: { coreqs: id } }))
    );

    await Promise.all(
      followups.map(followup => Skill.updateOne({ 'id': followup }, { $push: { prereqs: id } }))
    );

    res.status(201);
    res.send({"Message": "Success!"});
  } catch (err) {
    //console.log(err);
  }

  ;
})
/*
app.put('/skills',  async (req, res) => {
  
  const id = req.params.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const concepts = req.body.concepts;
  const courses = req.body.courses;
  const links = req.body.links;
  const prereq = req.body.prereq;
  const coreq = req.body.coreqs;
  const followups = req.body.followups;

  

  try {
    await Course.updateMany({}, {
      "id": id,
      "skill_name": name,
      "description": desc,
      "prereqs": prereq,
      "coreqs": coreq,
      "followups": followups,
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
*/
/*
============ 
/skills/:id
============
*/

app.get('/skills/:id', async (req, res) => {

  const id = req.params.id;
  
  try {
    const data = await Skill.findOne({"id": id});

    res.send(data);
  } catch (err) {
    //console.log(err);
  };

})

app.post('/skills/:id', (req, res) => {
  res.set("Allow", "GET, PUT, DELETE");
  res.status(405);
  res.send({"Message":"Method Not Allowed"});
})

app.put('/skills/:id',  async (req, res) => {
  
  const id = req.params.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const concepts = req.body.concepts;
  const courses = req.body.courses;
  const links = req.body.links;
  const prereqs = req.body.prereqs;
  const coreqs = req.body.coreqs;
  const followups = req.body.followups;
  
  try {

    const originalSkill = await Skill.findOne({ "id": id });
    
    if (!originalSkill) {
      return res.status(404).send({ "Message": "Skill not found" });
    }

    await Skill.updateOne({"id": id}, {
      "id": id,
      "skill_name": name,
      "description": desc,
      "concepts": concepts,
      "courses": courses,
      "prereqs": prereqs,
      "coreqs": coreqs,
      "followups": followups,
      "links": links
    });

    const addedConcepts = concepts.filter(concept => !originalSkill.concepts.includes(concept));
    const removedConcepts = originalSkill.concepts.filter(concept => !concepts.includes(concept));

    const addedCourses = courses.filter(course => !originalSkill.courses.includes(course));
    const removedCourses = originalSkill.courses.filter(course => !courses.includes(course));

    const addedPrereqs = prereqs.filter(prereq => !originalSkill.prereqs.includes(prereq));
    const removedPrereqs = originalSkill.prereqs.filter(prereq => !prereqs.includes(prereq));

    const addedCoreqs = coreqs.filter(coreq => !originalSkill.coreqs.includes(coreq));
    const removedCoreqs = originalSkill.coreqs.filter(coreq => !coreqs.includes(coreq));

    const addedFollowups = followups.filter(followup => !originalSkill.followups.includes(followup));
    const removedFollowups = originalSkill.followups.filter(followup => !followups.includes(followup));

    //add
    await Promise.all([
      ...addedConcepts.map(concept => Concept.updateOne({ 'id': concept }, { $push: { skills: id } })),
      ...addedCourses.map(course => Course.updateOne({ 'id': course }, { $push: { skills: id } })),
      ...addedPrereqs.map(prereq => Skill.updateOne({ 'id': prereq }, { $push: { followups: id } })),
      ...addedCoreqs.map(coreq => Skill.updateOne({ 'id': coreq }, { $push: { coreqs: id } })),
      ...addedFollowups.map(followup => Skill.updateOne({ 'id': followup }, { $push: { prereqs: id } }))
    ]);

    //delete
    await Promise.all([
      ...removedConcepts.map(concept => Concept.updateOne({ 'id': concept }, { $pull: { skills: id } })),
      ...removedCourses.map(course => Course.updateOne({ 'id': course }, { $pull: { skills: id } })),
      ...removedPrereqs.map(prereq => Skill.updateOne({ 'id': prereq }, { $pull: { followups: id } })),
      ...removedCoreqs.map(coreq => Skill.updateOne({ 'id': coreq }, { $pull: { coreqs: id } })),
      ...removedFollowups.map(followup => Skill.updateOne({ 'id': followup }, { $pull: { prereqs: id } }))
    ]);

    res.status(200);
    res.send({"Message": "Successfully updated!"});
    
  } catch (err) {
    //console.log(err);
    res.status(500);
    res.send({"Message": "Error: " + err})
  };

});

app.delete('/skills/:id', async (req, res) => {
  
  const id = req.params.id;  

  try {
    const skillToDelete = await Skill.findOne({ "id": id });

    if (!skillToDelete) {
      return res.status(404).send({ "Message": "Skill not found" });
    }

    const { concepts, courses, prereqs, coreqs, followups } = skillToDelete;

    await Promise.all([
      ...concepts.map(concept => Concept.updateOne({ 'id': concept }, { $pull: { skills: id } })),
      ...courses.map(course => Course.updateOne({ 'id': course }, { $pull: { skills: id } })),
      ...prereqs.map(prereq => Skill.updateOne({ 'id': prereq }, { $pull: { followups: id } })),
      ...coreqs.map(coreq => Skill.updateOne({ 'id': coreq }, { $pull: { coreqs: id } })),
      ...followups.map(followup => Skill.updateOne({ 'id': followup }, { $pull: { prereqs: id } }))
    ]);
    
    await Skill.deleteOne({"id": id});

    //console.log("Deleted Successfully");
    res.status(200);
    res.send({"Message": "Deleted Successfully"});
  } catch (err) {
    //console.log(err);
    res.status(500);
    res.send({"Message": "ERROR!" + err});
  };

});

app.post('/resources/:type/:id', async (req, res) => {

  const type = req.params.type;
  const id = req.params.id;
  const name = req.body.name;
  const link = req.body.link;
  const linkType = req.body.type;
  const linkId = req.body.id;

  try {
    let resource;
    if (type == 'skills') {

      resource = await Skill.findOne({ 'id': id });

    } else if (type == 'concepts') {

      resource = await Concept.findOne({ 'id': id });

    } else {
      throw new Error("Invalid Type");
    }

    console.log(resource);
    const obj = {
      'id': linkId,
      'name': name,
      'type': linkType,
      'link': link
    }

    resource.links.push(obj);
    await resource.save();

    res.status(200);
    res.send({ "Message": "Link added successfully" });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({ "Message": "Error: " + err });
  }
});


app.put('/resources/:type/:id', async (req, res) => {

  const type = req.params.type;
  const id = req.params.id;
  const name = req.body.name;
  const link = req.body.link;
  const linkType = req.body.type;
  const linkId = req.body.id;

  try {
    let resource;
    if (type == 'skills') {

      resource = await Skill.findOne({ 'id': id });

    } else if (type == 'concepts') {

      resource = await Concept.findOne({ 'id': id });

    } else {
      throw new Error("Invalid Type");
    }
    
    const linkToUpdate = resource.links.find(link => link.id === linkId);

    linkToUpdate.name = name;
    linkToUpdate.type = linkType;
    linkToUpdate.link = link;   
    
    await resource.save();

    res.status(200);
    res.send({ "Message": "Link updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({ "Message": "Error: " + err });
  }
});

app.delete('/resources/:type/:id/', async (req, res) => {

  const type = req.params.type;
  const id = req.params.id;
  const linkId = req.body.id;

  try {
    let resource;
    if (type === 'skills') {
      resource = await Skill.findOne({ 'id': id });
    } else if (type === 'concepts') {
      resource = await Concept.findOne({ 'id': id });
    } else {
      throw new Error("Invalid Type");
    }

    const linkToDelete = resource.links.findIndex(link => link.id === linkId);

    resource.links.splice(linkToDelete, 1);
    await resource.save();

    res.status(200);
    res.send({ "Message": "Link deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({ "Message": "Error: " + err });
  }
});

app.get('/groups', async (req, res) => {

  try {

    const data = await Group.find({});
    res.status(200);
    res.send(data);

  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({ "Message": "Error: " + err });
  }

});

app.post('/groups', async (req, res) => {

  const id = req.body.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const children = req.body.children;

  try {

    const group = new Group({
      "id": id,
      "group_name": name,
      "description": desc,
      "children": children
    })

    await group.save();

    await Promise.all(
      children.map(course => Course.updateOne({ 'id': course }, { $push: { groups: id } }))
    );

    res.status(201);
    res.send({"Message": "Success!"});
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({ "Message": "Error: " + err });
  };

});

/*
app.put('/groups', (req, res) => {

});

app.del('/groups', (req, res) => {

});
*/

app.get('/groups/:id', async (req, res) => {

  const id = req.params.id;

  try {
    const data = await Group.findOne({"id": id});
    res.status(200);
    res.send(data);

  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({ "Message": "Error: " + err });
  };

});

app.post('/groups/:id', (req, res) => {
  res.set("Allow", "GET, PUT, DELETE");
  res.status(405);
  res.send({"Message":"Method Not Allowed"});
});

app.put('/groups/:id', async (req, res) => {
  
  const id = req.params.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const children = req.body.children;
  
  try {

    originalGroup = await Group.findOne({"id": id});

    await Group.updateOne({"id": id}, {
      "id": id,
      "group_name": name,
      "description": desc,
      "children": children
    });

    const addedChildren = children.filter(child => !originalGroup.children.includes(child));
    const removedChildren = originalGroup.children.filter(child => !children.includes(child));
    
    await Promise.all(
      addedChildren.map(course => Course.updateOne({ 'id': course }, { $push: { groups: id } }))
    );

    await Promise.all(
      removedChildren.map(course => Course.updateOne({ 'id': course }, { $pull: { groups: id } }))
    );

    res.status(200);
    res.send({"Message": "Successfully updated!"});
    
  } catch (err) {
    //console.log(err);
    res.status(500);
    res.send({"Message": "Error: " + err})
  };

});

app.delete('/groups/:id', async (req, res) => {
  
  const id = req.params.id;

  try {

    const groupToDelete = await Group.findOne({"id": id});
    const { children } = groupToDelete;

    await Promise.all(
      children.map(course => Course.updateOne({ 'id': course }, { $pull: { groups: id } }))
    );

    const data = await Group.deleteOne({"id": id});
    res.status(200);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.send(500);
    res.send({ "Message": "Error: " + err });
  };

});



app.get('/users', async (req, res) => {

  try {

    const data = await User.find({});
    res.status(200);
    res.send(data);

  } catch (err) {

    console.log(err);
    res.status(500);
    res.send(err);

  }

});

app.post('/users', async (req, res) => {

  const { rcsid, id, perms } = req.body;

  try {

    const user = new User({
      "rcsid": rcsid,
      "id": id,
      "perms": perms
    });

    await user.save();
    
    res.status(201);
    res.send({"Message": "Success!"});

  } catch (err) {

    console.log(err);
    res.status(500);
    res.send(err);

  }

});

app.put('/users', async (req, res) => {
  res.set("Allow", "GET, POST");
  res.status(405);
  res.send({"Message":"Method Not Allowed"});
});

app.delete('/users', async (req, res) => {
  res.set("Allow", "GET, POST");
  res.status(405);
  res.send({"Message":"Method Not Allowed"});
});


app.get('/users/:id', async (req, res) => {

  const id = req.params.id;

  try {

    const data = await User.findOne({"id": id});
    res.status(200);
    res.send(data);

  } catch (err) {

    console.log(err);
    res.status(500);
    res.send(err);

  }

});

app.post('/users', async (req, res) => {
  res.set("Allow", "GET, PUT, DELETE");
  res.status(405);
  res.send({"Message":"Method Not Allowed"});
});

app.put('/users/:id', async (req, res) => {

  const { rcsid, id, perms } = req.body;

  try {

    await User.updateOne({
      "rcsid": rcsid,
      "id": id,
      "perms": perms
    });
    
    res.status(200);
    res.send({"Message": "Updated Successfully!"});

  } catch (err) {

    console.log(err);
    res.status(500);
    res.send(err);

  }

});

app.delete('/users/:id', async (req, res) => {

  const id = req.params.id;

  try {

    await User.deleteOne({"id": id});
    res.status(200);
    res.send({"Message": "Deleted Successfully!"});

  } catch (err) {

    console.log(err);
    res.status(500);
    res.send(err);

  }
});



module.exports = app;
