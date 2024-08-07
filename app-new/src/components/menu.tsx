'use client';
import React, { useRef, useContext} from 'react';
import { DataContext } from '@/contexts/PageContext';
import Draggable, { DraggableEvent } from 'react-draggable';
import Button from './button';

const Menu = () => {

  const { setGraphType } = useContext(DataContext);
  const draggableRef = useRef(null);

  return (
    <Draggable nodeRef={draggableRef} positionOffset={{ x: '-30vw', y: '-30vh' }} >
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
