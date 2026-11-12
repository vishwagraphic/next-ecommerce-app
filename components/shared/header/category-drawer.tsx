import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import {getAllCategories} from '@/lib/actions/product.actions'
import { Button, buttonVariants } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

const CategoryDrawer = async () => {
    const categories = await getAllCategories();
    console.log(categories)
    return ( 
        <Drawer swipeDirection="left">
            <DrawerTrigger
                render={
                    <Button aria-label="Open categories">
                    <MenuIcon />
                    </Button>
                }
            />
            <DrawerContent className='h-full max-w-sm'>
                <DrawerHeader>
                    <DrawerTitle>Select a category</DrawerTitle>
                </DrawerHeader>
                <div className='space-y-4'>
                    {categories?.data?.map((category: any) => (
                        <DrawerClose
                            key={category.category}
                            render={
                                <Link
                                    href={`/search?category=${category.category}`}
                                    className={buttonVariants({
                                        variant: "ghost",
                                        className: "w-full justify-start",
                                    })}
                                />
                            }
                        >
                            {category.category}
                        </DrawerClose>
                    ))}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
 
export default CategoryDrawer;