const HOST_URL = process.env.HOST_URL as any;
const config = {
    "schema_version": "v1",
    "name_for_model": "PoetAgent",
    "name_for_human": "Poet Agent",
    "description_for_human": "Write beautiful content with the help of Poet Agent",
    "description_for_model": "Assistant uses the Poet Agent plugin to write and improve any text.",
    "api": {
      "type": "openapi",
      "url": `${HOST_URL}/api/api-doc/`,
      "has_user_authentication": false
    },
    "auth": {
      "type": "none"
    },
    "logo_url": `${HOST_URL}/next.svg`,
    "contact_email": "example@example.com",
    "legal_info_url": `${HOST_URL}/us/legal/`
  }

  import { NextResponse } from 'next/server'
 
export async function GET() {
 
  return NextResponse.json(config)
}