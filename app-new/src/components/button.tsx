import React from 'react';

const Button = ({label, clickHandler}:{label:string, clickHandler:React.MouseEventHandler<HTMLButtonElement>}) => {
  return (
    <button className="btn btn-primary w-1/3" onClick={clickHandler}>{label}</button>
  )
}

export default Button;