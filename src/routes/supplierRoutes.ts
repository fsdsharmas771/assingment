import { Router, Request, Response } from 'express';

const router = Router();

// Mock Supplier A data
const supplierAData = [
  {
    hotelId: 'a1',
    name: 'Holtin',
    price: 6000,
    city: 'delhi',
    commissionPct: 10
  },
  {
    hotelId: 'a2',
    name: 'Grand Plaza',
    price: 8000,
    city: 'delhi',
    commissionPct: 10
  },
  {
    hotelId: 'a3',
    name: 'Sunset View',
    price: 5500,
    city: 'delhi',
    commissionPct: 10
  }
];

// Mock Supplier B data
const supplierBData = [
  {
    hotelId: 'b1',
    name: 'Holtin',
    price: 5340,
    city: 'delhi',
    commissionPct: 20
  },
  {
    hotelId: 'b2',
    name: 'Grand Plaza',
    price: 7500,
    city: 'delhi',
    commissionPct: 20
  },
  {
    hotelId: 'b3',
    name: 'Ocean Breeze',
    price: 6200,
    city: 'delhi',
    commissionPct: 20
  }
];

router.get('/supplierA/hotels', (req: Request, res: Response) => {
  const city = req.query.city as string;
  if (city) {
    const filtered = supplierAData.filter(hotel => 
      hotel.city.toLowerCase() === city.toLowerCase()
    );
    return res.json(filtered);
  }
  res.json(supplierAData);
});

router.get('/supplierB/hotels', (req: Request, res: Response) => {
  const city = req.query.city as string;
  if (city) {
    const filtered = supplierBData.filter(hotel => 
      hotel.city.toLowerCase() === city.toLowerCase()
    );
    return res.json(filtered);
  }
  res.json(supplierBData);
});

export default router;

