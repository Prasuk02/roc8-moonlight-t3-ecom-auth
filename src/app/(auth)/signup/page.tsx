'use client';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { api } from '~/trpc/react'
import { Toaster, toast } from 'sonner';
import Link from "next/link";

const page = () => {
  const router = useRouter()
  const [ newUser, setNewUser ] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const handleUserData = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({...newUser, [event.target.name] : event.target.value})
  }

  const registerUser = api.user.create.useMutation({
    onSuccess: (res) => {
      toast.success("User registered successfully, Please verify your email Id")
      router.push(`/signup/verify?email=${res.message}`)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const createNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser.mutate(newUser)
  }

  return (
    <>
      <Toaster richColors />
      <main className='w-full h-full flex items-start justify-center pt-8'>
        <div className='border-[1px] border-[#c1c1c1] rounded-2xl px-10 py-9 w-[430px]'>
          <h2 className='text-center text-2xl font-bold'>Create your account</h2>

          <form className='mt-4'>
            <label htmlFor="name" className='font-medium text-sm'>Name</label>
            <input
              id="name"
              name="name"
              type="name"
              onChange={ handleUserData }
              placeholder="Enter"
              className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </form>

          <div className='mt-3'>
            <label htmlFor="email" className='font-medium text-sm'>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={ handleUserData }
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
              onChange={ handleUserData }
              placeholder="Enter"
              className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          
          <button type='submit' onClick={ createNewUser } className='mt-8 text-center text-white bg-black rounded-lg text-sm w-full h-11 uppercase'>Create Account</button>
          <p className='mt-7 text-center text-sm'>Have an Account? 
            <strong className='pl-1'>
              <Link href='login' className="text-[#222222] uppercase">LOGIN</Link>
            </strong>
          </p>
        </div>
      </main>
    </>
  )
}

export default page