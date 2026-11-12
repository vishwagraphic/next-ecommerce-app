import { test, expect, jest } from '@jest/globals';
import { generateAccessToken, paypal } from '../lib/paypal';
import 'dotenv/config';

test('generate access token', async () => {
    const token = await generateAccessToken();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
});

test('create order', async () => {
    const token = await generateAccessToken();  
    const order = await paypal.createOrder(100);
    console.log(order);
    expect(order).toHaveProperty('id');
    expect(order.status).toBe('CREATED');
});

test('capture payment', async () => {
    const token = await generateAccessToken();
    const orderId = '100'
    const mockCapturePayment = jest.spyOn(paypal, 'capturePayment').mockResolvedValue({ id: orderId, status: 'COMPLETED' });
    const capture = await paypal.capturePayment(orderId);
    console.log(capture);
    expect(capture).toHaveProperty('id');
    expect(capture.status).toBe('COMPLETED');
    mockCapturePayment.mockRestore();
});