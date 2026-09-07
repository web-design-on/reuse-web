const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  {
    "slug": "moveis",
    "name": "Móveis"
  },
  {
    "slug": "decoracao",
    "name": "Decoração"
  },
  {
    "slug": "cozinha",
    "name": "Cozinha"
  },
  {
    "slug": "eletronicos",
    "name": "Eletrônicos"
  },
  {
    "slug": "roupas",
    "name": "Roupas"
  },
  {
    "slug": "calcados",
    "name": "Calçados"
  },
  {
    "slug": "acessorios",
    "name": "Acessórios"
  },
  {
    "slug": "esportes",
    "name": "Esportes"
  }
];

const products = [
  {
    "title": "Annibale Colombo Bed",
    "description": "Peça de mobília em bom estado, poucas marcas de uso.",
    "category": "moveis",
    "price": 855,
    "stock": 1,
    "brand": "Annibale Colombo",
    "tags": [
      "furniture",
      "beds"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/1.webp",
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp"
  },
  {
    "title": "Annibale Colombo Sofa",
    "description": "Peça de mobília em bom estado, poucas marcas de uso.",
    "category": "moveis",
    "price": 1125,
    "stock": 1,
    "brand": "Annibale Colombo",
    "tags": [
      "furniture",
      "sofas"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/1.webp",
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp"
  },
  {
    "title": "Bedside Table African Cherry",
    "description": "Peça de mobília em bom estado, poucas marcas de uso.",
    "category": "moveis",
    "price": 135,
    "stock": 1,
    "brand": "Furniture Co.",
    "tags": [
      "furniture",
      "bedside tables"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/1.webp",
      "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp"
  },
  {
    "title": "Decoration Swing",
    "description": "Item decorativo conservado, sem danos aparentes.",
    "category": "decoracao",
    "price": 25,
    "stock": 1,
    "tags": [
      "home decor",
      "swing"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/1.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp"
  },
  {
    "title": "Plant Pot",
    "description": "Item decorativo conservado, sem danos aparentes.",
    "category": "decoracao",
    "price": 10,
    "stock": 1,
    "tags": [
      "home decor",
      "plant accessories"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/1.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/thumbnail.webp"
  },
  {
    "title": "Black Whisk",
    "description": "Utensílio de cozinha em bom estado, higienizado.",
    "category": "cozinha",
    "price": 10,
    "stock": 1,
    "tags": [
      "kitchen tools",
      "utensils"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-whisk/1.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-whisk/thumbnail.webp"
  },
  {
    "title": "Boxed Blender",
    "description": "Utensílio de cozinha em bom estado, higienizado.",
    "category": "cozinha",
    "price": 20,
    "stock": 1,
    "tags": [
      "kitchen appliances",
      "blenders"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/boxed-blender/1.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/boxed-blender/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/kitchen-accessories/boxed-blender/thumbnail.webp"
  },
  {
    "title": "Apple MacBook Pro 14 Inch Space Grey",
    "description": "Aparelho eletrônico testado e funcionando perfeitamente.",
    "category": "eletronicos",
    "price": 900,
    "stock": 1,
    "brand": "Apple",
    "tags": [
      "laptops",
      "apple"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp"
  },
  {
    "title": "Lenovo Yoga 920",
    "description": "Aparelho eletrônico testado e funcionando perfeitamente.",
    "category": "eletronicos",
    "price": 495,
    "stock": 1,
    "brand": "Lenovo",
    "tags": [
      "laptops"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp"
  },
  {
    "title": "iPhone 6",
    "description": "Aparelho eletrônico testado e funcionando perfeitamente.",
    "category": "eletronicos",
    "price": 135,
    "stock": 1,
    "brand": "Apple",
    "tags": [
      "smartphones",
      "apple"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/thumbnail.webp"
  },
  {
    "title": "iPhone X",
    "description": "Aparelho eletrônico testado e funcionando perfeitamente.",
    "category": "eletronicos",
    "price": 405,
    "stock": 1,
    "brand": "Apple",
    "tags": [
      "smartphones",
      "apple"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/thumbnail.webp"
  },
  {
    "title": "iPad Mini 2021 Starlight",
    "description": "Aparelho eletrônico testado e funcionando perfeitamente.",
    "category": "eletronicos",
    "price": 225,
    "stock": 1,
    "brand": "Apple",
    "tags": [
      "electronics",
      "tablets"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/1.webp",
      "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp"
  },
  {
    "title": "Apple Airpods",
    "description": "Aparelho eletrônico testado e funcionando perfeitamente.",
    "category": "eletronicos",
    "price": 60,
    "stock": 1,
    "brand": "Apple",
    "tags": [
      "electronics",
      "wireless earphones"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/1.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp"
  },
  {
    "title": "Amazon Echo Plus",
    "description": "Aparelho eletrônico testado e funcionando perfeitamente.",
    "category": "eletronicos",
    "price": 45,
    "stock": 1,
    "brand": "Amazon",
    "tags": [
      "electronics",
      "smart speakers"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/1.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp"
  },
  {
    "title": "Blue & Black Check Shirt",
    "description": "Peça de roupa em bom estado, poucas marcas de uso.",
    "category": "roupas",
    "price": 15,
    "stock": 1,
    "brand": "Fashion Trends",
    "tags": [
      "clothing",
      "men's shirts"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp"
  },
  {
    "title": "Man Plaid Shirt",
    "description": "Peça de roupa em bom estado, poucas marcas de uso.",
    "category": "roupas",
    "price": 15,
    "stock": 1,
    "brand": "Classic Wear",
    "tags": [
      "clothing",
      "men's shirts"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp"
  },
  {
    "title": "Gray Dress",
    "description": "Peça de roupa em bom estado, poucas marcas de uso.",
    "category": "roupas",
    "price": 15,
    "stock": 1,
    "tags": [
      "clothing",
      "dresses"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/tops/gray-dress/1.webp",
      "https://cdn.dummyjson.com/product-images/tops/gray-dress/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/tops/gray-dress/thumbnail.webp"
  },
  {
    "title": "Blue Frock",
    "description": "Peça de roupa em bom estado, poucas marcas de uso.",
    "category": "roupas",
    "price": 15,
    "stock": 1,
    "tags": [
      "clothing",
      "dresses"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/tops/blue-frock/1.webp",
      "https://cdn.dummyjson.com/product-images/tops/blue-frock/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/tops/blue-frock/thumbnail.webp"
  },
  {
    "title": "Dress Pea",
    "description": "Peça de roupa em bom estado, poucas marcas de uso.",
    "category": "roupas",
    "price": 20,
    "stock": 1,
    "tags": [
      "clothing",
      "dresses"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/1.webp",
      "https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/thumbnail.webp"
  },
  {
    "title": "Nike Air Jordan 1 Red And Black",
    "description": "Calçado usado poucas vezes, sola sem desgaste visível.",
    "category": "calcados",
    "price": 65,
    "stock": 1,
    "brand": "Nike",
    "tags": [
      "footwear",
      "athletic shoes"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp"
  },
  {
    "title": "Puma Future Rider Trainers",
    "description": "Calçado usado poucas vezes, sola sem desgaste visível.",
    "category": "calcados",
    "price": 40,
    "stock": 1,
    "brand": "Puma",
    "tags": [
      "footwear",
      "casual shoes"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/thumbnail.webp"
  },
  {
    "title": "Calvin Klein Heel Shoes",
    "description": "Calçado usado poucas vezes, sola sem desgaste visível.",
    "category": "calcados",
    "price": 35,
    "stock": 1,
    "brand": "Calvin Klein",
    "tags": [
      "footwear",
      "heel shoes"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/1.webp",
      "https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/thumbnail.webp"
  },
  {
    "title": "Golden Shoes Woman",
    "description": "Calçado usado poucas vezes, sola sem desgaste visível.",
    "category": "calcados",
    "price": 20,
    "stock": 1,
    "brand": "Fashion Diva",
    "tags": [
      "footwear",
      "women's shoes"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/1.webp",
      "https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/thumbnail.webp"
  },
  {
    "title": "Brown Leather Belt Watch",
    "description": "Acessório em bom estado de conservação.",
    "category": "acessorios",
    "price": 40,
    "stock": 1,
    "brand": "Fashion Timepieces",
    "tags": [
      "watches",
      "leather watches"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp"
  },
  {
    "title": "Watch Gold for Women",
    "description": "Acessório em bom estado de conservação.",
    "category": "acessorios",
    "price": 360,
    "stock": 1,
    "brand": "Fashion Gold",
    "tags": [
      "watches",
      "women's watches"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/1.webp",
      "https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/thumbnail.webp"
  },
  {
    "title": "Green Crystal Earring",
    "description": "Acessório em bom estado de conservação.",
    "category": "acessorios",
    "price": 15,
    "stock": 1,
    "tags": [
      "fashion accessories",
      "earrings"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/1.webp",
      "https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/thumbnail.webp"
  },
  {
    "title": "Tropical Earring",
    "description": "Acessório em bom estado de conservação.",
    "category": "acessorios",
    "price": 10,
    "stock": 1,
    "tags": [
      "fashion accessories",
      "earrings"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/1.webp",
      "https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/thumbnail.webp"
  },
  {
    "title": "Classic Sun Glasses",
    "description": "Acessório em bom estado de conservação.",
    "category": "acessorios",
    "price": 10,
    "stock": 1,
    "brand": "Fashion Shades",
    "tags": [
      "eyewear",
      "sunglasses"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/1.webp",
      "https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/thumbnail.webp"
  },
  {
    "title": "Green and Black Glasses",
    "description": "Acessório em bom estado de conservação.",
    "category": "acessorios",
    "price": 15,
    "stock": 1,
    "brand": "Fashion Shades",
    "tags": [
      "eyewear",
      "sunglasses"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/1.webp",
      "https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/thumbnail.webp"
  },
  {
    "title": "Blue Women's Handbag",
    "description": "Acessório em bom estado de conservação.",
    "category": "acessorios",
    "price": 20,
    "stock": 1,
    "brand": "Fashionista",
    "tags": [
      "fashion accessories",
      "handbags"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/womens-bags/blue-women's-handbag/1.webp",
      "https://cdn.dummyjson.com/product-images/womens-bags/blue-women's-handbag/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/womens-bags/blue-women's-handbag/thumbnail.webp"
  },
  {
    "title": "White Faux Leather Backpack",
    "description": "Acessório em bom estado de conservação.",
    "category": "acessorios",
    "price": 20,
    "stock": 1,
    "brand": "Urban Chic",
    "tags": [
      "fashion accessories",
      "backpacks"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/1.webp",
      "https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/thumbnail.webp"
  },
  {
    "title": "American Football",
    "description": "Equipamento esportivo em bom estado, pronto para uso.",
    "category": "esportes",
    "price": 10,
    "stock": 1,
    "tags": [
      "sports equipment",
      "american football"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/sports-accessories/american-football/1.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/sports-accessories/american-football/thumbnail.webp"
  },
  {
    "title": "Baseball Glove",
    "description": "Equipamento esportivo em bom estado, pronto para uso.",
    "category": "esportes",
    "price": 10,
    "stock": 1,
    "tags": [
      "sports equipment",
      "baseball"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-glove/1.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-glove/2.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-glove/thumbnail.webp"
  },
  {
    "title": "Basketball",
    "description": "Equipamento esportivo em bom estado, pronto para uso.",
    "category": "esportes",
    "price": 10,
    "stock": 1,
    "tags": [
      "sports equipment",
      "basketball"
    ],
    "availabilityStatus": "In Stock",
    "images": [
      "https://cdn.dummyjson.com/product-images/sports-accessories/basketball/1.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/sports-accessories/basketball/thumbnail.webp"
  }
];

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.category.createMany({ data: categories });
  await prisma.product.createMany({ data: products });

  console.log(`Seed concluído: ${categories.length} categorias, ${products.length} produtos.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
