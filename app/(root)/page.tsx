'use client'
import ProductList from "@/components/shared/product/product-list";
import {getLatestProducts} from '@/lib/actions/product.actions'
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import { useEffect, useState } from "react";

const Homepage = () => {
  const [latestProducts, setLatestProducts] = useState<any[]>(() => [])

  useEffect(() => {
    const fetchLatestProducts = async () => {
      const products = await getLatestProducts()
      setLatestProducts(products)
    }

    fetchLatestProducts()
  }, [])


  return (
    <div>
        <ProductList data={latestProducts} title="Latest   Products"  limit={LATEST_PRODUCTS_LIMIT}/>
    </div>
  )
}

export default Homepage
