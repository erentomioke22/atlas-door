import { getHomePageData } from '@/lib/payload/queries';
import HomePage from '@/components/pages/homePage';

export const revalidate = 120; 

interface HomeData {
  posts?: any[];
  products?: any[];
}

export default async function Page() {
  const data = await getHomePageData();
  return (
    <div className="container max-w-2xl lg:max-w-7xl px-5 py-20 mx-auto space-y-20">
      <HomePage initialData={data} />
    </div>
  );
}