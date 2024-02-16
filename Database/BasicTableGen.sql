\c postgres
DROP DATABASE IF EXISTS basiccoursedata;
CREATE DATABASE basiccoursedata;
\c basiccoursedata

CREATE TABLE courses (
    id integer PRIMARY,
    name text NOT NULL,
    department text NOT NULL,
    course_code integer NOT NULL,
    description text
);

CREATE TABLE skills (
    id integer PRIMARY,
    name text NOT NULL,
    course_id integer NOT NULL
);

CREATE TABLE prereqs (
    id integer PRIMARY,
    name text NOT NULL,
    department text NOT NULL,
    course_code integer NOT NULL,
    description text,
    course_id integer NOT NULL
);