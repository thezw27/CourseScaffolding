'use client';
import React, { useRef, useContext, useState } from 'react';
import { DataContext, Group, SelectOption } from '@/contexts/PageContext';
import Draggable, { DraggableEvent } from 'react-draggable';
import Button from './button';
import Select, { MultiValue,  } from 'react-select';
import makeAnimated from 'react-select/animated';

const Menu = ({data}:{data:Group[]}) => {
  
  const [groupSelection, setGroupSelection] = useState<MultiValue<SelectOption>>([]);

  const GroupOptions: SelectOption[] = data
  .map(({ id, group_name } : { id:number, group_name:string }) => ({ label: group_name, value: id }))
  //.sort((a, b) => a.label.localeCompare(b.label));

  const animatedComponents = makeAnimated();
  const customStyles = {
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      transform: state.selectProps.menuPlacement === 'top' ? 'rotate(180deg)' : null,
    }),
  };

  const { setGraphType, setFilteredNodes } = useContext(DataContext);
  const draggableRef = useRef(null);

  const setNodes = (data: Group[], groupIds: number[]) => {
    let out = [];
    for (let i = 0; i < groupIds.length; i++) {
      let nodeArr: Group = data.find(obj => obj.id == groupIds[i])!;
      out.push(...nodeArr.children);
    }
    setFilteredNodes(Array.from(new Set(out)));
  }

  return (
    <Draggable nodeRef={draggableRef} positionOffset={{ x: '-30vw', y: '-30vh' }} >
      <div style={{ width: '25vw', position: "absolute", zIndex: "1",}} ref={draggableRef} className="border-2 bg-gray-400 p-5">
        
        <div className="flex flex-row justify-between mb-4">
          <Button label="Courses" clickHandler={setGraphType}/>
          <Button label="Skills" clickHandler={setGraphType}/>
          <Button label="Concepts" clickHandler={setGraphType}/>
        </div>

        <div className="flex items-center">
          <label className="mx-1" htmlFor="filter">Filter:</label>
          <Select className="flex-grow mx-1" styles={customStyles} options={GroupOptions} value={groupSelection} closeMenuOnSelect={false} components={animatedComponents} isMulti menuPlacement="top" onChange={(event) => {setGroupSelection(event); setNodes(data, event.map(obj => obj.value));}}/>
        </div>
        
      </div>
    </Draggable>
  );
  
};

export default Menu;