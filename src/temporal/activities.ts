import axios from 'axios';
import { saveHotelsToRedis, getHotelsFromRedis, Hotel } from '../redis/hotelCache';

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
const supplierAPath = '/supplier/supplierA/hotels';
const supplierBPath = '/supplier/supplierB/hotels';

const extractHotels = (responseData: any): Hotel[] => {
  if (Array.isArray(responseData)) return responseData;
  if (responseData && Array.isArray(responseData.data)) return responseData.data;
  return [];
};

export async function fetchSupplierA(city: string): Promise<Hotel[]> {
  const response = await axios.get(`${baseUrl}${supplierAPath}`, {
    params: { city },
    timeout: 10000,
  });
  return extractHotels(response.data);
}

export async function fetchSupplierB(city: string): Promise<Hotel[]> {
  const response = await axios.get(`${baseUrl}${supplierBPath}`, {
    params: { city },
    timeout: 10000,
  });
  return extractHotels(response.data);
}

export async function saveToRedis(city: string, hotels: Hotel[]): Promise<void> {
  await saveHotelsToRedis(city, hotels);
}

export async function getFromRedis(city: string): Promise<Hotel[] | null> {
  return await getHotelsFromRedis(city);
}
