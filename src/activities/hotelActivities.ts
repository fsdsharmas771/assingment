import * as activities from '@temporalio/workflow';
import axios from 'axios';
import { saveHotelsToRedis, getHotelsFromRedis, Hotel } from '../redis/hotelCache';

export const fetchSupplierA = activities.defineActivity<[string], Hotel[]>({
  startToCloseTimeout: '30s',
  retry: {
    maximumAttempts: 3,
    initialInterval: '1s',
  },
});

export const fetchSupplierB = activities.defineActivity<[string], Hotel[]>({
  startToCloseTimeout: '30s',
  retry: {
    maximumAttempts: 3,
    initialInterval: '1s',
  },
});

export const saveToRedis = activities.defineActivity<[string, Hotel[]], void>({
  startToCloseTimeout: '10s',
  retry: {
    maximumAttempts: 3,
    initialInterval: '1s',
  },
});

export const getFromRedis = activities.defineActivity<[string], Hotel[] | null>({
  startToCloseTimeout: '10s',
  retry: {
    maximumAttempts: 3,
    initialInterval: '1s',
  },
});

// Activity implementations
export async function fetchSupplierAImpl(city: string): Promise<Hotel[]> {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
  const response = await axios.get(`${baseUrl}/supplierA/hotels`, {
    params: { city },
    timeout: 10000,
  });
  return response.data;
}

export async function fetchSupplierBImpl(city: string): Promise<Hotel[]> {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
  const response = await axios.get(`${baseUrl}/supplierB/hotels`, {
    params: { city },
    timeout: 10000,
  });
  return response.data;
}

export async function saveToRedisImpl(city: string, hotels: Hotel[]): Promise<void> {
  await saveHotelsToRedis(city, hotels);
}

export async function getFromRedisImpl(city: string): Promise<Hotel[] | null> {
  return await getHotelsFromRedis(city);
}

