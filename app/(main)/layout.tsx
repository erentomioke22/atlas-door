// export const dynamic = "force-dynamic";

// import Navbar from "@/components/Navbar"
// import Footer from '@/components/footer';
// import { ReactNode } from 'react';
// import { getServerSession } from "@/lib/get-session";
// import { headers } from "next/headers";
// interface LayoutProps {
//   children: ReactNode;
// }
// export default async function Layout({ children }: LayoutProps) {
//   const session = await getServerSession();
//   const h = await headers();
// console.log("cookie header:", h.get("cookie"));
//   console.log("SESSION:", session);
//   return (
//     <div lang="fa" dir="rtl">
//       <Navbar session={session}/>
//       <div className="min-h-screen pt-28">
//         {children}
//       </div> 
//       <Footer/>
//     </div>
//   );
// }

// app/layout.tsx
import Footer from "@/components/footer";
import SessionGate from "@/components/SessionGate";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="fa" dir="rtl">
      {/* این بخش استاتیک است و بلافاصله prerender می‌شود */}
      <Suspense fallback={<div className="h-16" />}>
        <SessionGate />
      </Suspense>
      <div className="min-h-screen pt-28">{children}</div>
      <Footer />
    </div>
  );
}