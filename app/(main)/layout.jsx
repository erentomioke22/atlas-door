import Navbar from "@components/Navbar"
import Footer from '@components/footer';


export default async function Layout({children}) {

  return (
  <div>
     <Navbar />
         <div className="min-h-screen pt-28">
           {children}
         </div> 
     <Footer/>
  </div>
  );
}