const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const clientId = process.env.PAYPAL_CLIENT_ID ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;


export const paypal = {
    createOrder: async function createOrder (price: number) {
        const accessToken = await generateAccessToken()
        const url = `${base}/v2/checkout/orders`
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: price.toFixed(2)
                        }
                    }
                ]
            })
        })
        return await handlePaypalResponse(response, 'Payment Failed');
    },
    capturePayment: async function capturePayment(orderId: string) {
        const accessToken = await generateAccessToken()
        const url = `${base}/v2/checkout/orders/${orderId}/capture`
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        })
        return await handlePaypalResponse(response, 'Capture Payment Failed');
    }
}

async function generateAccessToken() {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + auth
        },
        body: 'grant_type=client_credentials'
    });
    
    const data = await handlePaypalResponse(response, 'Failed to generate access token');
    return data.access_token;
}

async function handlePaypalResponse(response: Response, errorDetail:string) {
    if(response.ok){
        return await response.json()
    } else {
        const errorMessage = await response.text()
        throw new Error(`${errorDetail}: ${errorMessage}`)
    }
}

export { generateAccessToken };