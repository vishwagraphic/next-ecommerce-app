'use client';


import { cn } from "cn";
import Image from "next/image";
import { useState } from "react";

const ProductImages = ({images} : {images: string[]}) => {
    const [currentImage, setCurrentImage] = useState(0);
    return (
        <div>
            <Image src={images[currentImage]} alt="Product" width={1000} height={1000} className="min-h-75 object-cove object-center" />
            <div className="flex gap-2 mt-2">
                {images.map((image, index) => (
                    <div key={index}
                    className={`border mr-2 cursor-pointer hover:border-orange-600 ${
                      currentImage === index ? 'border-orange-500' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImage(index)} // Ensure this updates the currentImage state
                  >
                        <Image
                            src={image}
                            width={100}
                            height={100}
                            alt="Product"
                            className="w-16 h-16 object-cover cursor-pointer"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default ProductImages;