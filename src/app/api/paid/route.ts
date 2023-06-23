import { NextResponse, NextRequest } from 'next/server'
import * as AlbyTools from 'alby-tools'
import { generateToken, isValidPreimage } from './utils';
const RECIPIENT = process.env.RECIPIENT as any;
const PRICE_IN_SATS = 100;

export async function GET(request: NextRequest,) {
    console.log(request.url)
    const requestHeaders = new Headers(request.headers)
    const authHeader = requestHeaders.get('Authorization')
    if (authHeader) {
        console.info(`Auth header present`);
        const [token, preimage] = authHeader.replace('LSAT ', '').split(":");
        const isValid = await isValidPreimage(token, preimage, request.url);
        if (isValid) {
            console.info(`Payment valid`);
            return NextResponse.json({ message: 'Hello from the paid route!' })
        }
    }
    console.log(`Requesting LSAT payment`);
    const ln = new AlbyTools.LightningAddress(RECIPIENT);
    await ln.fetch();
    const invoice = await ln.requestInvoice({ satoshi: PRICE_IN_SATS });
    const jwt = await generateToken(invoice, request.url);

    //res.set({'www-authenticate': `LSAT macaroon=${jwt},invoice=${invoice.paymentRequest}`});
    //res.status(402).json({invoice: invoice.paymentRequest, macaroon: invoice.paymentHash});
    const newHeaders = new Headers(request.headers)

    newHeaders.set('www-authenticate', `LSAT macaroon=${ jwt },invoice=${ invoice.paymentRequest }`);

    return new Response(JSON.stringify({ invoice: invoice.paymentRequest, macaroon: invoice.paymentHash }), {
        status: 402,
        headers: {
            'content-type': 'application/json',
            'www-authenticate': `LSAT macaroon=${ jwt },invoice=${ invoice.paymentRequest }`
        },
    })
}