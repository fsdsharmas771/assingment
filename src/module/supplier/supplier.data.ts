export interface SupplierHotel {
  hotelId: string;
  name: string;
  price: number;
  city: string;
  commissionPct: number;
}

export const supplierAData: SupplierHotel[] = [
  {
    hotelId: 'a1',
    name: 'Holtin',
    price: 6000,
    city: 'delhi',
    commissionPct: 10,
  },
  {
    hotelId: 'a2',
    name: 'Grand Plaza',
    price: 8000,
    city: 'delhi',
    commissionPct: 10,
  },
  {
    hotelId: 'a3',
    name: 'Sunset View',
    price: 5500,
    city: 'delhi',
    commissionPct: 10,
  },
];

export const supplierBData: SupplierHotel[] = [
  {
    hotelId: 'b1',
    name: 'Holtin',
    price: 5340,
    city: 'delhi',
    commissionPct: 20,
  },
  {
    hotelId: 'b2',
    name: 'Grand Plaza',
    price: 7500,
    city: 'delhi',
    commissionPct: 20,
  },
  {
    hotelId: 'b3',
    name: 'Ocean Breeze',
    price: 6200,
    city: 'delhi',
    commissionPct: 20,
  },
];
