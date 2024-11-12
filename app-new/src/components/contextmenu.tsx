import React, { ReactElement, useCallback } from 'react';

export default function ContextMenu({
  label, 
  top, 
  left, 
  courseData, 
  codeData,
  type, 
  onHover,
  graphType
}:{
  label:string, 
  top:number, 
  left:number, 
  courseData: {id:string, name:string}[], 
  codeData: {dept:string, code:string}
  type:boolean, 
  onHover:React.Dispatch<React.SetStateAction<boolean>>,
  graphType:string
}) {
  if (label == '') {
    return;
  }
  let courses : ReactElement | null = null;
  let code : ReactElement | null = null;

  if (type) {
    courses = (
      <ul>
        <li><strong>Used In:</strong></li>
        {courseData.map((course) => (
          <li><a style={{ color: "blue" }} href={"/courses/" + course.id}>{course.name}</a></li>
        ))}
      </ul>
    );
  } else {
    code = (
      <p style={{ margin: '0.25em' }}>{codeData.dept + codeData.code}</p>
    )
  }

  return (
    <div
      style={{ top, left, position: 'absolute', width: '200px', justifyContent: "center" }}
      className="context-menu"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <p style={{ margin: '0.5em' }}>{label}</p>
      {code}
      {courses}
    
    </div>
  );
}

