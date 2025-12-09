import * as wf from '@temporalio/workflow';
import { fetchSupplierA, fetchSupplierB, saveToRedis, getFromRedis } from '../activities/hotelActivities';
import { Hotel } from '../redis/hotelCache';

export interface HotelWorkflowInput {
  city: string;
}

export interface HotelWorkflowOutput {
  hotels: Hotel[];
}

export async function hotelComparisonWorkflow(input: HotelWorkflowInput): Promise<HotelWorkflowOutput> {
  const { city } = input;

  // Check Redis first
  const cachedHotels = await wf.executeActivity(getFromRedis, city, {
    startToCloseTimeout: '10s',
  });

  if (cachedHotels && cachedHotels.length > 0) {
    console.log(`Returning cached hotels for city: ${city}`);
    return { hotels: cachedHotels };
  }

  // Fetch from both suppliers in parallel
  const [supplierAHotels, supplierBHotels] = await Promise.all([
    wf.executeActivity(fetchSupplierA, city, {
      startToCloseTimeout: '30s',
    }),
    wf.executeActivity(fetchSupplierB, city, {
      startToCloseTimeout: '30s',
    }),
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
  await wf.executeActivity(saveToRedis, [city, deduplicatedHotels], {
    startToCloseTimeout: '10s',
  });

  return { hotels: deduplicatedHotels };
}

