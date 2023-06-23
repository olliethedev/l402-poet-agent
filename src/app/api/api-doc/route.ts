import { NextApiRequest, NextApiResponse } from 'next';
import { createSwaggerSpec } from 'next-swagger-doc';
import { NextResponse } from 'next/server';

const spec = createSwaggerSpec({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Poet Agent',
            version: '0.1.0',
        },
        servers: [
            {
                url: "http://localhost:3000",
            }],
            paths: {
                "/api/paid": {
                    get: {
                        description: "Returns beautifully rewritten text",
                        responses: {
                            200: {
                                description: "Success",
                            },
                        }
                    }
                }
            }


    },
    apiFolder: 'app/api',
});


export async function GET(request: NextApiRequest, response: NextApiResponse) {
    return NextResponse.json(spec)
}