'use client';
import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import Input from './input';
import Button from './button';

const Menu = () => {
  const draggableRef = useRef(null);

  return (
    <Draggable nodeRef={draggableRef}>
      <div ref={draggableRef} className="border-2 bg-gray-400 p-5">
        <div className="flex">
          <Input />
          <Button label='Search' />
        </div>
        <div>
          <Button label="Skills" />
          <Button label="Concepts" />
          <Button label="Help" />
          <a href="/admin" className="btn btn-primary">Admin Portal</a>
        </div>
      </div>
    </Draggable>
  );
};

export default Menu;
