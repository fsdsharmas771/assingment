import axios from 'axios';
import { saveHotelsToRedis, getHotelsFromRedis, Hotel } from '../redis/hotelCache';

export async function fetchSupplierA(city: string): Promise<Hotel[]> {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
  const response = await axios.get(`${baseUrl}/supplierA/hotels`, {
    params: { city },
    timeout: 10000,
  });
  return response.data;
}

export async function fetchSupplierB(city: string): Promise<Hotel[]> {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
  const response = await axios.get(`${baseUrl}/supplierB/hotels`, {
    params: { city },
    timeout: 10000,
  });
  return response.data;
}

export async function saveToRedis(city: string, hotels: Hotel[]): Promise<void> {
  await saveHotelsToRedis(city, hotels);
}

export async function getFromRedis(city: string): Promise<Hotel[] | null> {
  return await getHotelsFromRedis(city);
}

