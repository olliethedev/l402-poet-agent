import { NextResponse } from 'next/server'
 
export async function GET() {
  
  const data = {
    message: 'Hello from the free route!',
  }
 
  return NextResponse.json(data)
}