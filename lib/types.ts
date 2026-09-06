export interface Category {
  slug: string;
  name: string;
  imageUrl?: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Product {
  id: number;
  title: string;
  description?: string;
  category: string;
  price: number;
  rating?: number;
  stock?: number;
  brand?: string;
  tags?: string[];
  availabilityStatus?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  dimensions?: ProductDimensions;
  images?: string[];
  thumbnail?: string;
}
