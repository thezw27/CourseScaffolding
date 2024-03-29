'use client';
import { useState } from 'react';

import Header from '../components/header';
import Menu from '../components/menu';
import Footer from '../components/footer';
import Info from '../components/info';
import Graph from '../components/graph';

export default function Home() {

  return (
    <main className="flex flex-col min-h-screen flex-col items-center justify-between p-24">
      <Menu />
      <Graph />
    </main>
  );
}   