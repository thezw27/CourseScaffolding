import React from 'react';

const Button = ({label, clickHandler}:{label:string, clickHandler:(val: string)=> void}) => {
  return (
    <button className="btn btn-primary" onClick={() => clickHandler(label)}>{label}</button>
  )
}

export default Button;