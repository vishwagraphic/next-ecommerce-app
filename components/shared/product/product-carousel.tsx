'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Product } from "@/lib/generated/prisma/browser";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";

const ProductCarousel = ({data}: {data: Product[]}) => {
    return ( 
   <Carousel className="w-full mb-12" opts={{ loop: true }} plugins={[Autoplay(
    { delay: 2000, stopOnInteraction: true, stopOnMouseEnter: true }
   )]}>
    <CarouselContent>
        {data.map((product:Product) => (
            <CarouselItem key={product.id}>
               <Link href={`/product/${product.slug}`}>
                   <div className="relative mx-auto" >
                       <Image
                           src={product.banner as string}
                           alt={product.name}
                           width={0}
                           height={0}
                           sizes="100vw"
                           className="w-full h-auto"
                       />
                       <div className="absolute inset-0 flex items-end justify-center">
                           <h2 className="bg-gray-900 text-white bg-opacity-50 text-2xl font-bold">{product.name}</h2>
                       </div>
                   </div>
               </Link>
            </CarouselItem>
        ))}

    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
   </Carousel>
 );
}
 
export default ProductCarousel;