import type { Prisma } from "@prisma/client";
import type { PortableTextBlock } from '@portabletext/types';
import type { OrderStatus } from '@prisma/client';



export type CommentTargetType = 'post' | 'product';
export type SortCategory = 'latest' | 'oldest' | 'toppest';
export type SearchTab = 'all' | 'posts' | 'products' | 'categories' | 'tags';

export interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  desc: string;
  mainImage: string;
  publishedAt: string;
  isHot: boolean;
  tags: { name: string }[];
  author: { name: string; image: string };
}


export interface SanityProduct {
  _id: string;
  name: string;
  slug: string;
  desc: string;
  content: PortableTextBlock[];
  images: string[];
  mainImage: string;
  category: {
    _id: string;
    title: string;
    slug: string;
  };
  material?: string;
  colors: Array<{
    _key: string;
    color: string;
    hexCode: string;
    price: number;
    discount: number;
    stock: number;
  }>;
  seller?: {
    _id: string;
    name: string;
    image: string;
  };
  dimensions?: string;
  assemblyRequired?: boolean;
  publishedAt: string;
  _updatedAt: string;
}
export interface UserLite {
  id: string;
  name?: string | null;
  displayName?: string | null;
  image?: string | null;
  username?: string | null;
  role?: string | null;
}

export interface TagLite {
  _id: string;
  name: string;
  slug: string;
  count: number;
}

export interface PostLite {
  _id: string;
  title: string;
  slug: string;
  desc?: string;
  mainImage?: string;
  imageAlt?: string;
  publishedAt?: string;
  author?: PostAuthor;
  tags?: Array<{
    _id: string;
    name: string;
    slug?: string;
  }>;
  discussions?: boolean;   
}

export interface ProductColorLite {
  id: string;
  hexCode: string;
  price: number;
  discount: number | null;
  name: string;
  stocks: number;
  status: string;
}


export interface ProductLite {
  _id: string;
  name: string;
  slug: string;
  desc: string;
  content: PortableTextBlock[] | string;
  images: string[];
  mainImage: string;
  category?: {
    _id: string;
    title: string;
    slug: string;
  };
  sellerId?: string;
  seller?: {
    _id: string;
    name: string;
    image: string | null;
  };
  colors: ProductColorLite[];
  material?: string;
  dimensions?: string;
  assemblyRequired?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProductsListResponse {
  products: ProductLite[];
  totalCount: number;
  categories: CategoryLite[];
}

export interface CategoryLite {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  count: number;
}
export interface ProductFull extends ProductLite {
  content: PortableTextBlock[] | string;
  relatedProducts: ProductLite[];
}



export interface PostsListResponse {
  posts: PostLite[];
  totalCount: number;
  tags: TagLite[];
}


export interface PostAuthor {
  _id?: string;
  name: string;
  image?: string | null;
}

// ====== تایپ پست کامل (برای صفحه جزئیات) ======
export interface PostFull extends PostLite {
  content: PortableTextBlock[];
  relatedPosts: PostLite[];
  readingTime?: number;
}

export function getUserDataSelect(loggedInUserId?: string | null): Prisma.UserSelect {
  return {
    id: true,
    name: true,
    email: true,
    image: true,
    phone: true,
    address: true,
    displayName: true,
    createdAt: true,
    // _count: {
    //   select: {
    //     posts: true,
    //   },
    // },
  };
}

export function getPostDataInclude(loggedInUserId?: string | null): any {
  return {};
}

export function getProductDataInclude(loggedInUserId?: string | null): any {
  return {};
}

// lib/types.ts

// ====== تایپ‌های کامنت ======
export type CommentUser = {
  id: string;
  name?: string | null;
  displayName?: string | null;
  image?: string | null;
};

export type CommentItem = {
  id: string;
  content: string;
  createdAt: string | Date;
  userId?: string | null;
  user?: CommentUser | null;
  parent?: { id: string; user?: CommentUser | null; content: string } | null;
  replies?: CommentItem[];
  _count?: { replies?: number };
};

export type CommentsPage = {
  comments: CommentItem[];
  nextCursor?: string | null;
  error?: string;
};

// ====== تایپ پست برای کامنت‌ها ======
export interface CommentPostLite {
  id: string;      // _id از Sanity
  userId: string;  // نویسنده پست (نام یا id)
  discussions?: boolean;
  user?: { id: string };
}





export type CommentTarget = {
  targetType: CommentTargetType;
  targetId: string;
  targetOwnerId?: string | null; // برای notification
  discussions?: boolean;
};


export function getCommentDataInclude(loggedInUserId?: string | null): any {
  return {
    user: {
      select: {
        id: true,
        name: true,
        displayName: true,
        image: true,
      },
    },
    replies: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            displayName: true,
            image: true,
          },
        },
        parent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                displayName: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: { replies: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    },
    parent: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            displayName: true,
            image: true,
          },
        },
      },
    },
    _count: {
      select: { replies: true }, 
    },
  };
}
export const notificationsInclude = {
  issuer: {
    select: {
      id: true,
      name: true,
      displayName: true,
      image: true,
    },
  },
  recipient: {
    select: {
      id: true,
      name: true,
      displayName: true,
      image: true,
    },
  },
} satisfies Prisma.NotificationInclude;



export interface OrderItemLite {
  id: string;
  quantity: number;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  productId: string;
  colorId: string;
  productName: string | null;
  productSlug: string | null;
  productImage: string | null;
  colorName: string | null;
  colorHex: string | null;
}

export interface OrderLite {
  id: string;
  orderCode: string;
  status: OrderStatus;
  total: number;
  paymentId: string | null;
  paymentDate: string | null;
  recipient: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemLite[];
}

export interface OrderResponse {
  orders: OrderLite[];
  totalCount: number;
  error?: string;
}

// ====== تب‌های سفارشات ======
export type OrderTab = 
  | 'ALL'
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export const ORDER_TABS: Array<{
  key: OrderTab;
  label: string;
  statuses: OrderStatus[];
  color: string;
  icon: string;
}> = [
  {
    key: 'ALL',
    label: 'همه',
    statuses: [],
    color: 'text-neutral-500',
    icon: '📋',
  },
  {
    key: 'PENDING',
    label: 'در انتظار پرداخت',
    statuses: ['PENDING'],
    color: 'text-yellow-500',
    icon: '⏳',
  },
  {
    key: 'PAID',
    label: 'پرداخت شده',
    statuses: ['PAID', 'PROCESSING', 'IN_PRODUCTION', 'SENT_TO_FACTORY', 'READY'],
    color: 'text-blue-500',
    icon: '💳',
  },
  {
    key: 'SHIPPED',
    label: 'ارسال شده',
    statuses: ['SHIPPED'],
    color: 'text-green-500',
    icon: '🚚',
  },
  {
    key: 'DELIVERED',
    label: 'تحویل داده شده',
    statuses: ['DELIVERED'],
    color: 'text-darkgreen',
    icon: '✅',
  },
  {
    key: 'CANCELLED',
    label: 'لغو شده',
    statuses: ['CANCELLED'],
    color: 'text-red-500',
    icon: '❌',
  },
];

// ====== نقشه وضعیت ======
export const ORDER_STATUS_MAP: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    progress: number;
  }
> = {
  PENDING: {
    label: 'در انتظار پرداخت',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    progress: 15,
  },
  PAID: {
    label: 'پرداخت شده',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    progress: 30,
  },
  PROCESSING: {
    label: 'در حال پردازش',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    progress: 40,
  },
  SENT_TO_FACTORY: {
    label: 'ارسال به کارخانه',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    progress: 50,
  },
  IN_PRODUCTION: {
    label: 'در حال تولید',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    progress: 60,
  },
  READY: {
    label: 'آماده تحویل',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500',
    progress: 75,
  },
  SHIPPED: {
    label: 'ارسال شده',
    color: 'text-lightgreen',
    bgColor: 'bg-lightgreen',
    progress: 85,
  },
  DELIVERED: {
    label: 'تحویل داده شده',
    color: 'text-darkgreen',
    bgColor: 'bg-darkgreen',
    progress: 100,
  },
  CANCELLED: {
    label: 'لغو شده',
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    progress: 100,
  },
};



// lib/list/types.ts
export type ListType = 'posts' | 'products';

export interface FilterItem {
  _id: string;
  name: string;      // tag.name یا category.title
  slug: string;
  count: number;
}

export interface InfiniteListProps<T> {
  // داده‌های اولیه
  initialItems: T[];
  initialFilters: FilterItem[];
  selectedFilter: string;
  totalCount: number;
  hasMore: boolean;
  initialLimit: number;
  loadMoreLimit: number;

  // تنظیمات
  listType: ListType;
  filterKey: 'tag' | 'category'; // پارامتر URL
  emptyIcon: string;
  emptyTitle: string;
  emptyMessage: string;
  searchPlaceholder?: string;

  // رندر
  renderItem: (item: T) => React.ReactNode;

  // لود بیشتر
  onLoadMore: (params: {
    filter: string;
    start: number;
    end: number;
  }) => Promise<T[]>;
}



export interface SearchResults {
  posts: PostLite[];
  products: ProductLite[];
  categories: CategoryLite[];
  tags: TagLite[];
}

export interface SearchCounts {
  posts: number;
  products: number;
  categories: number;
  tags: number;
}

export interface SearchResponse {
  results: SearchResults;
  counts: SearchCounts;
  query: string;
}

export const SEARCH_TABS: Array<{
  key: SearchTab;
  label: string;
  icon: string;
  countKey: keyof SearchCounts | null;
}> = [
  { key: 'all', label: 'همه', icon: '🔍', countKey: null },
  { key: 'products', label: 'محصولات', icon: '🛍️', countKey: 'products' },
  { key: 'posts', label: 'مقالات', icon: '📝', countKey: 'posts' },
  { key: 'categories', label: 'دسته‌بندی', icon: '📁', countKey: 'categories' },
  { key: 'tags', label: 'برچسب‌ها', icon: '🏷️', countKey: 'tags' },
];