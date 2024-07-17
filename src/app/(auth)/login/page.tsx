'use client';
import React, { useState } from 'react'
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();

  const [ loginCredentials, setLoginCredentials ] = useState({
    email: '',
    password: ''
  })

  const handleInput = (event) => {
    setLoginCredentials({ ...loginCredentials, [event.target.name]: event.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    // Logic for login user
  }

  return (
    <main className='w-full h-full flex items-start justify-center pt-8'>
      <div className='border-[1px] border-[#c1c1c1] rounded-2xl px-10 py-7 w-[430px]'>
        <h2 className='text-center text-2xl font-bold'>Login</h2>
        <h3 className='mt-5 text-center font-semibold text-lg'>Welcome back to ECOMMERCE</h3>
        <p className='mt-1 text-center text-sm'>The next gen business marketplace</p>

        <div className='mt-4'>
          <label htmlFor="email" className='font-medium text-sm'>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={ handleInput }
            placeholder="Enter"
            className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>

        <div className='mt-3'>
          <label htmlFor="password" className='font-medium text-sm'>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={ handleInput }
            placeholder="Enter"
            className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        
        <button onClick={ handleLogin } className='mt-8 text-center text-white bg-black rounded-lg text-sm w-full h-11'>LOGIN</button>

        <hr className='mt-5 border-t-[1px] border-[#c1c1c1]'/>

        <p className='mt-5 text-center text-sm'>Don't have an Account? <strong className='pl-1'>SIGN UP</strong></p>
      </div>
    </main>
  )
}

export default page