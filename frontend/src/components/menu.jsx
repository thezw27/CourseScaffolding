import Input from './input';
import Button from './button';
import React, { useState } from 'react';
import Draggable from 'react-draggable';

const Menu = (
  {searchHandler, pruneHandler}
  ) => {

  const [searchQuery, updateSearchQuery] = useState('');
  const [pruneQuery, updatePruneQuery] = useState('');

  return (
    <Draggable>
      <div className="border-2 bg-gray-400 p-5">
        <div className="flex">
          <Input />
          <Button label='Search' />
        </div>
        <div>
          <Button label="Skills" />
          <Button label="Concepts" />
          <Button label="Help" />
        </div>
      </div>
    </Draggable>
  )
}

export default Menu;