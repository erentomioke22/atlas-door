// app/(main)/products/productsListClient.tsx
'use client';

import InfiniteList from '@/components/list/infiniteList';
import ProductCard from '@/components/products/productCard';
import { loadMoreProducts } from '@/lib/list/actions';
import type { ProductLite, CategoryLite } from '@/lib/types';

interface Props {
  initialProducts: ProductLite[];
  initialCategories: CategoryLite[];
  selectedCategory: string;
  totalCount: number;
  hasMore: boolean;
  initialLimit: number;
  loadMoreLimit: number;
}

export default function ProductsListClient(props: Props) {
  return (
    <InfiniteList<ProductLite>
      initialItems={props.initialProducts}
      initialFilters={props.initialCategories.map((c) => ({
        _id: c._id,
        name: c.title,
        slug: c.slug,
        count: c.count,
      }))}
      selectedFilter={props.selectedCategory}
      totalCount={props.totalCount}
      hasMore={props.hasMore}
      initialLimit={props.initialLimit}
      loadMoreLimit={props.loadMoreLimit}
      // ✅ تنظیمات
      listType="products"
      filterKey="category"
      emptyIcon="🛍️"
      emptyTitle="هیچ محصولی پیدا نشد"
      emptyMessage="با دسته‌بندی دیگری جستجو کنید"
      emptyActionLabel="مشاهده همه محصولات"
      itemPrefix=""
      showAllLabel="همه"
      moreLabel={(count) => `+${count} دسته دیگر`}
      countLabel={(count) => `${count} محصول یافت شد`}
      // ✅ رندر
      renderItem={(product) => (
        <ProductCard key={product._id} product={product} />
      )}
      // ✅ لود بیشتر
      onLoadMore={loadMoreProducts}
    />
  );
}
