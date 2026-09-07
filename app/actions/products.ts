"use server";

import { db } from "@/lib/db";
import type { Category, Product, ProductDimensions } from "@/lib/types";

function toProduct(product: {
  id: number;
  title: string;
  description: string | null;
  category: string;
  price: number;
  rating: number | null;
  stock: number | null;
  brand: string | null;
  tags: string[];
  availabilityStatus: string | null;
  warrantyInformation: string | null;
  shippingInformation: string | null;
  dimensions: unknown;
  images: string[];
  thumbnail: string | null;
}): Product {
  return {
    ...product,
    dimensions: product.dimensions as ProductDimensions | null,
  };
}

export async function getProducts(category?: string): Promise<Product[]> {
  const products = await db.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { id: "asc" },
  });

  return products.map(toProduct);
}

export async function getCategories(): Promise<Category[]> {
  return db.category.findMany({ orderBy: { name: "asc" } });
}

export async function getProduct(id: string): Promise<Product> {
  const product = await db.product.findUnique({ where: { id: Number(id) } });
  if (!product) throw new Error("Produto não encontrado.");

  return toProduct(product);
}
