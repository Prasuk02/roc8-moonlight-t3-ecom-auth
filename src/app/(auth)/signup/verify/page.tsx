'use client';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CodeInput from '~/app/_components/CodeInput';

const page = () => {
  const searchParams = useSearchParams()
  const [userEmail, setUserEmail] = useState('');
  const [userInputCode, setUserInputCode] = useState('');

  useEffect(() => {
    setUserEmail(searchParams.get('email') || '');
    // logic to generate verification code and send to user via email
  }, [])

  const verifyCode = () => {
    // Logic to verify user with help of generated code sent to mail
  }

  const getInputVerificationCode = (code: string): void => {
    setUserInputCode(code);
  }

  return (
    <main className='w-full h-full flex items-start justify-center pt-8'>
      <div className='border-[1px] border-[#c1c1c1] rounded-2xl px-10 py-8 w-[460px]'>
        <h2 className='text-center text-2xl font-bold'>Verify your email</h2>
        <p className='mt-5 text-center text-sm'>Enter the 8 digit code you have received on<br/><strong>{ userEmail }</strong></p>

        <div className='mt-6'>
          <CodeInput
            length={8}
            getInputVerificationCode={getInputVerificationCode}
          />
        </div>
        
        <button 
          className='mt-10 text-center text-white bg-black rounded-lg text-sm w-full h-11 uppercase disabled:opacity-85 disabled:cursor-not-allowed'
          disabled={ userInputCode ? false : true } 
          onClick={ verifyCode }
        >Verify</button>
      </div>
    </main>
  )
}

export default page