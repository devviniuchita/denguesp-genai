import React from 'react';

export default function HomeLayout({ children }: { readonly children: React.ReactNode }) {
  return <div className='min-h-screen flex flex-col bg-background text-foreground'>{children}</div>;
}
