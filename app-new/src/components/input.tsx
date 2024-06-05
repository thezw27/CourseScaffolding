import React from 'react';

export default function Input({status, name, id, setter, value} : {status?:string, name?:string, id?:string, setter:React.Dispatch<React.SetStateAction<any>>, value?:string}) {
  if (status == "locked") {
    return (
      <div className="flex w-100 m-4">
        <label className="flex font-bold w-2/5 items-center" htmlFor={id}>{name}</label>
        <input disabled value={value} name={id} className="custom-input w-3/5" id={id} onChange={(event) => {
          setter(event.target.value)
        }}></input>
      </div>
    );
  } else {
    return (
      <div className="flex w-100 m-4">
        <label className="flex font-bold w-2/5 items-center" htmlFor={id}>{name}</label>
        <input value={value} name={id} className="custom-input w-3/5" id={id} onChange={(event) => {
          setter(event.target.value)
        }}></input>
      </div>
    );
  }
}