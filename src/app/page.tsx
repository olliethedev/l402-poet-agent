'use client'
import { useState, useEffect } from 'react';
import { lsat } from "alby-tools";

export default function Home() {
  const [data, setData] = useState('None');
  const [loading, setLoading] = useState(false);
  const getPaidData = async () => {
    setLoading(true);
    try {
      const url = `/api/paid`;
      const response = await lsat.fetchWithLsat(url, {}, {});
      const data = await response.json();
      setData(data);
    }
    catch(e:any) {
      console.error(e);
      alert(`Sorry, something went wrong: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }
  return (
    <main>
      <button onClick={getPaidData}>Click me</button>
      <div>
        {loading ? 'Loading...' : JSON.stringify(data)}
      </div>
    </main>
  )
}
