import React, { useState, useEffect } from 'react';

export default function Input({status, name, id, setter, value}: {status?: string, name?: string, id?: string, setter: React.Dispatch<React.SetStateAction<any>>, value?: string}) {
  // Manage local state for the input
  const [localValue, setLocalValue] = useState(value || '');

  // Sync with parent when value prop changes
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Handle input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.target.value);  // Update local value first
    setter(event.target.value);         // Then update parent state
  };

  return (
    <div className="flex w-100 m-4">
      <label className="flex font-bold w-2/5 items-center" htmlFor={id}>{name}</label>
      <input
        disabled={status === 'locked'}
        value={localValue}
        name={id}
        className="custom-input w-3/5"
        id={id}
        onChange={handleChange}
      />
    </div>
  );
}
