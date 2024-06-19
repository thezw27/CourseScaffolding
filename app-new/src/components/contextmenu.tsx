import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

export default function ContextMenu({label, top, left}: {label:string, top:number, left:number}) {
  if (label == '') {
    return;
  }
  return (
    <div
      style={{ top, left, position: 'absolute' }}
      className="context-menu"
    >
      <p style={{ margin: '0.5em' }}>
        <small>{label}</small>
      </p>
      <button className="btn btn-primary">An Action</button>
      <button className="btn btn-primary">Another Action</button>
    </div>
  );
}
