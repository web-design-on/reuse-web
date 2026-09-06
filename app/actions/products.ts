"use server";

import type { Category, Product } from "@/lib/types";

// Remover quando produtos/categorias forem implementados pelo backend (banco de dados).

export async function getProducts(category?: string): Promise<Product[]> {
  const url = category
    ? `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=100`
    : "https://dummyjson.com/products?limit=100";

  const response = await fetch(url);
  if (!response.ok) throw new Error("Erro ao buscar produtos.");

  const data: { products: Product[] } = await response.json();
  return data.products;
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch("https://dummyjson.com/products/categories");
  if (!response.ok) throw new Error("Erro ao buscar categorias.");

  const data: { slug: string; name: string }[] = await response.json();
  return data.map(({ slug, name }) => ({ slug, name }));
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`https://dummyjson.com/products/${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error("Produto não encontrado.");

  return response.json();
}
