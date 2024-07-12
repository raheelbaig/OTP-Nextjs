import OtpLogin from '@/components/OtpLogin'
import React from 'react'

function LoginPage() {
  return (
    <>
    <div className='h-16 border border-b-2 shadow-lg'></div>
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="font-bold text-center text-2xl mb-4">
        One-Time-Password Phone Authentication.
      </h1>
      <OtpLogin />
    </main>
    </>
  )
}

export default LoginPage