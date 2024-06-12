'use client';
import React, { useRef, useContext } from 'react';
import { DataContext } from '@/contexts/PageContext';
import Draggable from 'react-draggable';
import Input from './input';
import Button from './button';

const Menu = () => {
  const draggableRef = useRef(null);

  const { setGraphType } = useContext(DataContext);

  return (
    <Draggable nodeRef={draggableRef}>
      <div ref={draggableRef} className="border-2 bg-gray-400 p-5">
    {/*`<div className="flex">
          <Input />
          <Button label='Search' />
        </div>`*/}
        <div >
          <Button label="Courses" clickHandler={setGraphType}/>
          <Button label="Skills" clickHandler={setGraphType}/>
          <Button label="Concepts" clickHandler={setGraphType}/>
          {/*<Button label="Help" />*/}
          <a href="/admin" className="btn btn-primary">Admin Portal</a>
        </div>
      </div>
    </Draggable>
  );
};

export default Menu;
