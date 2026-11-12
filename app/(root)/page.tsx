'use client'
import ViewAllProducts from "@/components/view-all-products";
import ProductList from "@/components/shared/product/product-list";
import {getLatestProducts, getFeaturedProducts} from '@/lib/actions/product.actions'
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import { useEffect, useState } from "react";
import ProductCarousel from "@/components/shared/product/product-carousel";

const Homepage = () => {
  const [latestProducts, setLatestProducts] = useState<any[]>(() => [])
  const [featuredProducts, setFeaturedProducts] = useState<any[]>(() => [])

  useEffect(() => {
    const fetchLatestProducts = async () => {
      const products = await getLatestProducts()
      setLatestProducts(products)
    }

    const fetchFeaturedProducts = async () => {
      const products = await getFeaturedProducts()
      setFeaturedProducts(products as any)
    }

    fetchLatestProducts()
    fetchFeaturedProducts()
  }, [])


  return (
    <div>
      {
        featuredProducts.length > 0 && (
          <ProductCarousel data={featuredProducts} />
        )
      }
        <ProductList data={latestProducts} title="Latest   Products"  limit={LATEST_PRODUCTS_LIMIT}/>
        <ViewAllProducts />
    </div>
  )
}

export default Homepage
