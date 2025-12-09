import redis from './client';

export interface Hotel {
  hotelId: string;
  name: string;
  price: number;
  city: string;
  commissionPct: number;
}

export async function saveHotelsToRedis(city: string, hotels: Hotel[]): Promise<void> {
  const key = `hotels:${city.toLowerCase()}`;
  await redis.setex(key, 3600, JSON.stringify(hotels)); // 1 hour TTL
  console.log(`Saved ${hotels.length} hotels to Redis for city: ${city}`);
}

export async function getHotelsFromRedis(city: string): Promise<Hotel[] | null> {
  const key = `hotels:${city.toLowerCase()}`;
  const data = await redis.get(key);
  if (data) {
    return JSON.parse(data) as Hotel[];
  }
  return null;
}

export function filterHotelsByPrice(hotels: Hotel[], minPrice?: number, maxPrice?: number): Hotel[] {
  if (!minPrice && !maxPrice) {
    return hotels;
  }

  return hotels.filter(hotel => {
    if (minPrice && hotel.price < minPrice) {
      return false;
    }
    if (maxPrice && hotel.price > maxPrice) {
      return false;
    }
    return true;
  });
}


