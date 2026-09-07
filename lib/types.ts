export interface Category {
  slug: string;
  name: string;
  imageUrl?: string;
}

export const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  beauty: "Beleza",
  smartphones: "Celulares",
  laptops: "Notebooks",
  fragrances: "Perfumes",
  "skin-care": "Cuidados pessoais",
  groceries: "Mercado",
  "home-decoration": "Decoração para casa",
  "kitchen-accessories": "Acessórios para cozinha",
  furniture: "Móveis",
  tops: "Blusas",
  "womens-dresses": "Vestidos femininos",
  "womens-shoes": "Calçados femininos",
  "mens-shirts": "Camisas masculinas",
  "mens-shoes": "Calçados masculinos",
  "mens-watches": "Relógios masculinos",
  "womens-watches": "Relógios femininos",
  "womens-bags": "Bolsas femininas",
  "womens-jewellery": "Joias femininas",
  sunglasses: "Óculos de sol",
  automotive: "Automotivo",
  motorcycle: "Motocicletas",
  vehicle: "Veículos",
  tablets: "Tablets",
  "mobile-accessories": "Acessórios para celular",
  "sports-accessories": "Acessórios esportivos",
  moveis: "Móveis",
  decoracao: "Decoração",
  cozinha: "Cozinha",
  eletronicos: "Eletrônicos",
  roupas: "Roupas",
  calcados: "Calçados",
  acessorios: "Acessórios",
  esportes: "Esportes",
};

export const PRODUCT_SELLERS = [
  { name: "vendedor_joão", avatar: "/avatars/vendedor_joao.png", short: "J", tint: "linear-gradient(135deg, #d9b293, #8d5d42)" },
  { name: "vendedor_7329", avatar: "/avatars/vendedor_7329.png", short: "7", tint: "linear-gradient(135deg, #98c7d9, #4c6f88)" },
  { name: "vendedor_anônimo", avatar: "/avatars/vendedor_anônimo.png", short: "A", tint: "linear-gradient(135deg, #9ca8ff, #4659d5)" },
  { name: "vendedor_maria", avatar: "/avatars/vendedor_maria.png", short: "M", tint: "linear-gradient(135deg, #f3c792, #d2874f)" },
  { name: "vendedor_1048", avatar: "/avatars/vendedor_1048.png", short: "1", tint: "linear-gradient(135deg, #9ee7b5, #2b8d62)" },
] as const;

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Product {
  id: number;
  title: string;
  description?: string | null;
  category: string;
  price: number;
  rating?: number | null;
  stock?: number | null;
  brand?: string | null;
  tags?: string[];
  availabilityStatus?: string | null;
  warrantyInformation?: string | null;
  shippingInformation?: string | null;
  dimensions?: ProductDimensions | null;
  images?: string[];
  thumbnail?: string | null;
}
