import { sanityFetch } from '@/sanity/lib/server';
import { HOME_PAGE_QUERY } from '@/lib/sanity/queries';
import HomePage from '@/components/pages/homePage';
import { transformProductToLite } from '@/lib/sanity/transformers';

export const revalidate = 120; 

interface HomeData {
  posts?: any[];
  products?: any[];
}

export default async function Page() {
  const rawData = await sanityFetch<HomeData>({
    query: HOME_PAGE_QUERY,
    tags: ['post', 'product'],
    revalidate: 120,
  });

  const data = {
    posts: rawData.posts || [],
    products: (rawData.products || []).map(transformProductToLite),
  };

  return (
    <div className="container max-w-2xl lg:max-w-7xl px-5 py-20 mx-auto space-y-20">
      <HomePage initialData={data} />
    </div>
  );
}