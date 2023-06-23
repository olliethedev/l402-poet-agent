'use client'

import { fetchWithLsat } from "alby-tools";
import { useChat } from 'ai/react'
import { useEffect } from "react";
import originalFetchWithLsat from "./lsat/originalFetchWithLsat";



export default function Home() {


  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/paid',
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {  // check if code is running in the browser
      const originalFetch = window.fetch;

      // Create a new version of fetchWithLsat that uses the original fetch
      const fetchWithLsat = (url: string, fetchArgs: Record<string, any>, options: Record<string, any>) => originalFetchWithLsat(originalFetch, url, fetchArgs, options);

      window.fetch = new Proxy(window.fetch, {
        apply: function (target, thisArg, argumentsList) {
          return fetchWithLsat.apply(thisArg, argumentsList as any);
        },
      });
    }
  }, []);

  return (
    <main>
      <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
      {messages.map(m => (
        <div key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}
 
      <form onSubmit={handleSubmit}>
        <label>
          Say something...
          <input
            className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2"
            value={input}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
    </main>
  )
}
