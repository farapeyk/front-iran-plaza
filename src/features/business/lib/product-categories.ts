import type { ProductCategoryItem, ProductItem } from "@/features/business/types/business-extras"

export function getUncategorizedProducts(
  products: ProductItem[],
  categories: ProductCategoryItem[],
) {
  const categoryIds = new Set(categories.map((category) => category.id))
  return products.filter(
    (product) =>
      !product.productCategoryId || !categoryIds.has(product.productCategoryId),
  )
}
