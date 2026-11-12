import Image from 'next/image'
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import Menu from './Menu'
import CategoryDrawer from './category-drawer'
import ProductSearch from './search'

const Header = () => {
    return (
      <header className="w-full border-b">
        <div className="wrapper flex-between">
          <div className="flex-start">
            <CategoryDrawer />
            <Link href="/" className="flex-start ml-4">
              <Image
                src="/images/logo.svg"
                alt={APP_NAME}
                width={48}
                height={48}
                priority
              />
              <span className="hidden lg:block text-2xl font-bold">
                {APP_NAME}
              </span>
            </Link>
          </div>
         
            <div className='hidden md:block'><ProductSearch /></div>
            <Menu />
          
        </div>
      </header>
    );
}
 
export default Header;