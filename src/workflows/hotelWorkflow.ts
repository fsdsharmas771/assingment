import * as wf from '@temporalio/workflow';
import type * as activities from '../temporal/activities';
import { Hotel } from '../redis/hotelCache';

const { fetchSupplierA, fetchSupplierB, saveToRedis, getFromRedis } = wf.proxyActivities<typeof activities>({
  startToCloseTimeout: '30s',
  retry: {
    maximumAttempts: 3,
  },
});

export interface HotelWorkflowInput {
  city: string;
}

export interface HotelWorkflowOutput {
  hotels: Hotel[];
}

export async function hotelComparisonWorkflow(input: HotelWorkflowInput): Promise<HotelWorkflowOutput> {
  const { city } = input;

  // Check Redis first
  const cachedHotels = await getFromRedis(city);

  if (cachedHotels && cachedHotels.length > 0) {
    return { hotels: cachedHotels };
  }

  // Fetch from both suppliers in parallel
  const [supplierAHotels, supplierBHotels] = await Promise.all([
    fetchSupplierA(city),
    fetchSupplierB(city),
  ]);

  // Deduplicate by name and select cheapest price
  const hotelMap = new Map<string, Hotel>();

  // Process Supplier A hotels
  for (const hotel of supplierAHotels) {
    const existing = hotelMap.get(hotel.name.toLowerCase());
    if (!existing || hotel.price < existing.price) {
      hotelMap.set(hotel.name.toLowerCase(), hotel);
    }
  }

  // Process Supplier B hotels
  for (const hotel of supplierBHotels) {
    const existing = hotelMap.get(hotel.name.toLowerCase());
    if (!existing || hotel.price < existing.price) {
      hotelMap.set(hotel.name.toLowerCase(), hotel);
    }
  }

  // Convert map to array
  const deduplicatedHotels = Array.from(hotelMap.values());

  // Save to Redis
  await saveToRedis(city, deduplicatedHotels);

  return { hotels: deduplicatedHotels };
}

