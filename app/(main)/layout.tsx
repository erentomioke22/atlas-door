import Navbar from "@/components/Navbar"
import Footer from '@/components/footer';
import { ReactNode } from 'react';
import { getServerSession } from "@/lib/get-session";
interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await getServerSession();
  
  return (
    <div>
      <Navbar session={session}/>
      <div className="min-h-screen pt-28">
        {children}
      </div> 
      <Footer/>
    </div>
  );
}