import { Router, Request, Response } from 'express';
import { getTemporalClient } from '../temporal/client';
import { hotelComparisonWorkflow } from '../workflows/hotelWorkflow';
import { getHotelsFromRedis, filterHotelsByPrice, Hotel } from '../redis/hotelCache';

const router = Router();

router.get('/api/hotels', async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string;
    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    // If price filters are provided, fetch from Redis only
    if (minPrice !== undefined || maxPrice !== undefined) {
      const cachedHotels = await getHotelsFromRedis(city.toLowerCase());
      if (!cachedHotels || cachedHotels.length === 0) {
        return res.status(404).json({ error: 'No hotels found in cache. Please fetch hotels first without price filters.' });
      }
      const filteredHotels = filterHotelsByPrice(cachedHotels, minPrice, maxPrice);
      return res.json({ hotels: filteredHotels, count: filteredHotels.length });
    }

    // Otherwise, trigger Temporal workflow
    const client = await getTemporalClient();
    const handle = await client.workflow.start(hotelComparisonWorkflow, {
      taskQueue: 'hotel-offer-queue',
      workflowId: `hotel-comparison-${city}-${Date.now()}`,
      args: [{ city: city.toLowerCase() }],
    });

    const result = await handle.result();
    res.json({ hotels: result.hotels, count: result.hotels.length });
  } catch (error: any) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;

