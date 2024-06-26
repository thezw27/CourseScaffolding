import React, { ReactElement, useCallback } from 'react';
import { JSXSource } from 'react/jsx-dev-runtime';
import { useReactFlow } from 'reactflow';

export default function ContextMenu(
  {
    label, 
    top, 
    left, 
    courseData, 
    type, 
    onHover,
    graphType
  } : {
    label:string, 
    top:number, 
    left:number, 
    courseData: {id:string, name:string}[], 
    type:boolean, 
    onHover:React.Dispatch<React.SetStateAction<boolean>>,
    graphType:string
  }
) {
  if (label == '') {
    return;
  }
  let courses : ReactElement | null = null;

  if (type) {
    courses = (
      <ul>
        <li><strong>Used In:</strong></li>
        {courseData.map((course) => (
          <li><a href={"/" + graphType.toLowerCase() + '/' + course.id}>{course.name}</a></li>
        ))}
      </ul>
    );
  }

  return (
    <div
      style={{ top, left, position: 'absolute' }}
      className="context-menu"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <p style={{ margin: '0.5em' }}>{label}</p>

      {courses}
    
    </div>
  );
}
