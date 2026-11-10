import { getHomePageData } from '@/lib/payload/queries';
import HomePage from '@/components/pages/homePage';

export const revalidate = 120; 



export default async function Page() {
  const rawData = await getHomePageData();

const data = {
  posts: rawData.posts?.map((p: any) => ({
    ...p,
    id: String(p.id),
    author: p.author ? { ...p.author, id: String(p.author.id) } : undefined,
    tags: p.tags?.map((t: any) => ({ ...t, id: String(t.id) })),
  })) ?? [],
  products: rawData.products?.map((p: any) => ({
    ...p,
    id: String(p.id), 
  })) ?? [],
};
  return (
    <div className="container max-w-2xl lg:max-w-7xl px-5 py-20 mx-auto space-y-20">
      <HomePage initialData={data} />
    </div>
  );
} 