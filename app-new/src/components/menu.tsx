'use client';
import React, { useRef, useContext } from 'react';
import { DataContext } from '@/contexts/PageContext';
import Draggable from 'react-draggable';
import Input from './input';
import Button from './button';

const Menu = () => {
  const draggableRef = useRef(null);

  const { setGraphType } = useContext(DataContext);

  const vwToPx = (vw: number) => (vw / 100) * window.innerWidth;
  const vhToPx = (vh: number) => (vh / 100) * window.innerHeight;

  const initialX = vwToPx(-30); // 10% of the viewport width
  const initialY = vhToPx(-30); // 10% of the viewport height
  
  return (
    <Draggable nodeRef={draggableRef} defaultPosition={{ x: initialX, y: initialY }}>
      <div style={{ width: '25vw', position: "absolute", zIndex: "1",}} ref={draggableRef} className=" flex border-2 bg-gray-400 p-5">
    {/*`<div className="flex">
          <Input />
          <Button label='Search' />
        </div>`*/}
      
          <Button label="Courses" clickHandler={setGraphType}/>
          <Button label="Skills" clickHandler={setGraphType}/>
          <Button label="Concepts" clickHandler={setGraphType}/>
          {/*<Button label="Help" />*/}
        
      </div>
    </Draggable>
  );
};

export default Menu;
