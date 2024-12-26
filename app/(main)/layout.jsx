import Navbar from "@components/Navbar"
import Footer from '@components/footer';
// import { useSession } from "next-auth/react";


export default async function Layout({children}) {

  return (
  <div className="min-h-screen">
     <Navbar />
         <div className="pt-20">
           {children}
         </div> 
     <Footer/>
  </div>
  );
}