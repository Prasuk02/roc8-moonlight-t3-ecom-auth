'use client';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CodeInput from '~/app/_components/CodeInput';
import { api } from '~/trpc/react';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userEmail, setUserEmail] = useState('');
  const [userInputCode, setUserInputCode] = useState('');
  const [ sendCode, setSendCode ] = useState(false);

  const sendVerificationCode = api.user.sendVerificationCode.useMutation({
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const verifyUserRegisteredEmail = api.user.verifyRegisteredEmail.useMutation({
    onSuccess: (res) => {
      toast.success(res.message);
      router.push('/categories');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  useEffect(() => {
    setSendCode(true);

    const userEmail = searchParams.get('email') || '';
    if (!userEmail) {
      router.push('/signup')
    }
    setUserEmail(userEmail);
  }, [])

  useEffect(() => {
    if (sendCode) {
      sendVerificationCode.mutate();
    }
  }, [sendCode])

  const verifyCode = () => {
    verifyUserRegisteredEmail.mutate({ code: userInputCode });
  }

  const getInputVerificationCode = (code: string): void => {
    setUserInputCode(code);
  }

  return (
    <>
      <Toaster richColors />
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
            className='mt-10 text-center text-white bg-black rounded-lg text-sm w-full h-11 uppercase disabled:opacity-80 disabled:cursor-not-allowed'
            disabled={ userInputCode.length === 8 ? false : true } 
            onClick={ verifyCode }
          >Verify</button>
        </div>
      </main>
    </>
  )
}

export default page