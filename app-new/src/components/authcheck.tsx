'use client';
import React, { useState, useEffect } from 'react';
import Admin from '@/components/admin';
import { Concept, Course, Skill, Group, User} from '@/contexts/PageContext';
import cookie from 'cookie';
import * as jwt from 'jsonwebtoken';

const SECRET = process.env.NEXT_PUBLIC_SECRET as string;
const PW = process.env.NEXT_PUBLIC_PW as string;

export default function AuthCheck({data}:{data: [Course[], Skill[], Concept[], Group[], User[]]}) {
  const [auth, setAuth] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const users: User[] = data[4];

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
    e.preventDefault();
    console.log(password, PW)
    if (password === PW) {
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="mb-4">Please enter the password to access the admin panel</h2>
        <form className="flex flex-col items-center" onSubmit={handlePasswordSubmit}>
          <input
            className="mb-4 w-full p-2 border border-gray-300 rounded"
            type="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter username"
            required
          />
          <input
            className="mb-4 w-full p-2 border border-gray-300 rounded"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <button className="btn btn-primary w-full p-2" type="submit">Submit</button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    );
  }

}

