'use client';
import React, { useState, useEffect } from 'react';
import Admin from '@/components/admin';
import { Concept, Course, Skill, Group} from '@/contexts/PageContext';
import cookie from 'cookie';
import * as jwt from 'jsonwebtoken';

const SECRET = process.env.NEXT_PUBLIC_SECRET as string;
const PW = process.env.NEXT_PUBLIC_PW as string;

export default function AuthCheck({data}:{data: [Course[], Skill[], Concept[], Group[]]}) {
  const [auth, setAuth] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  /*const checkCookie = () => {
    if (typeof window !== 'undefined') {
      try {
        const cookies = cookie.parse(document.cookie);
        if (cookies.token) {
          jwt.verify(cookies.token, SECRET, (err) => {
            if (!err) {
              setAuth(true); 
            } else {
              setAuth(false);
            }
          });
        } else {
          setAuth(false);
        }
      } catch (e) {
        console.error('Error parsing cookies:', e);
        setAuth(false);
      }
    }
  };*/

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();console.log('JWT Object:', jwt);
    if (password=== PW) {
      //const token = jwt.sign({ user: 'admin' }, SECRET, { expiresIn: '1h' }); 
      //document.cookie = `token=${token}; path=/; max-age=${60 * 60};`; 
      setAuth(true);
      setError(null);
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

 // useEffect(() => {
  //  checkCookie();
  //}, []);

  if (auth) {
    return (
       <Admin data={data} />
    )
  } else {
    return (
      <div>
        <h2>Please enter the password to access the admin panel</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <button type="submit">Submit</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

}

