import React from 'react'
import { Search, ShoppingCart, MenuIcon } from 'lucide-react'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav>
      {/* Quick Links */}
      <section className='w-full h-9 flex justify-center overflow-hidden sm:justify-end sm:px-10'>
        <ul className='flex items-center gap-5 text-sm text-[#333333]'>
          <li>Help</li>
          <li>Orders & Returns</li>
          <li>Hi, John</li>
        </ul>
      </section>

      <main className='flex items-center justify-between w-full h-16 px-3 overflow-hidden md:px-8'>
        <h1 className='font-extrabold text-2xl tracking-tight'>ECOMMERCE</h1>

        <div className='hidden md:inline-block'>
          <ul className='flex items-center gap-4 text-sm font-semibold lg:text-base lg:gap-7'>
            <li>Categories</li>
            <li>Sales</li>
            <li>Clearance</li>
            <li>New Stock</li>
            <li>Trending</li>
          </ul>
        </div>

        <div className='flex items-center gap-4 md:gap-7'>
          <Search size={22} strokeWidth={1.5} color='#333333' />
          <ShoppingCart size={22} strokeWidth={1.5} color='#333333' />
          <MenuIcon className='inline-block md:hidden' size={22} strokeWidth={1.5} color='#333333' />
        </div>

      </main>
    </nav>
  )
}

export default Navbar;
