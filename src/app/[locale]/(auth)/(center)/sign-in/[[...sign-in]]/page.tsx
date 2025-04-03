'use client';

import { SignIn } from '@clerk/nextjs';

// 简单化登录页面实现
export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center p-4">
      <div className="w-full">
        <h1 className="mb-8 text-2xl font-bold text-center">登录</h1>
        <SignIn 
          signUpUrl="/sign-up"
          afterSignInUrl="/"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500',
              footerActionLink: 'text-indigo-600 hover:text-indigo-500'
            }
          }}
        />
      </div>
    </div>
  );
}
