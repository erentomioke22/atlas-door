import ProfileBar from '@/components/profileBar';
import { ReactNode } from 'react';
import { getServerSession } from "@/lib/get-session";



interface LayoutProps {
  children: ReactNode;
}

export default async  function Layout({ children }: LayoutProps){
  const  session  = await getServerSession();
  
  return (
    <div className=" container max-w-2xl lg:max-w-4xl  mx-auto mt-20 space-y-10 px-5">
      <ProfileBar session={session}/>
      <div>
        {children}
      </div>
    </div>
  );
}