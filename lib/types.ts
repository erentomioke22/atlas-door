export interface UserLite {
  id: string;
  name?: string | null;
  displayName?: string | null;
  image?: string | null;
  username?: string | null;
  role?: string | null;
}



export interface ProductsListResponse {
  products: ProductLite[];
  totalCount: number;
  categories: CategoryLite[];
}


export interface PostsListResponse {
  posts: PostLite[];
  totalCount: number;
  tags: TagLite[];
}




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
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface InfiniteListProps<T extends { id: string }> {
  initialItems: T[];
  initialFilters: FilterItem[];
  selectedFilter: string;
  totalCount: number;
  hasMore: boolean;
  initialLimit: number;
  loadMoreLimit: number;
  listType: ListType;
  filterKey: 'tag' | 'category';
  emptyIcon: string;
  emptyTitle: string;
  emptyMessage: string;
  emptyActionLabel: string;
  itemPrefix?: string;
  showAllLabel?: string;
  moreLabel?: (count: number) => string;
  countLabel: (count: number) => string;
  renderItem: (item: T) => React.ReactNode;
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












export interface CategoryLite {
  id: string;
  title: string;
  slug: string;
  image?: string;
  count: number;
}

export interface TagLite {
  id: string;
  name: string;
  slug: string;
  count: number;
}



// lib/types.ts
export type CommentTargetType = 'post' | 'product';
export type SortCategory = 'latest' | 'oldest' | 'toppest';
export type SearchTab = 'all' | 'posts' | 'products' | 'categories' | 'tags';
export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SENT_TO_FACTORY'
  | 'IN_PRODUCTION'
  | 'READY'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

// ====== Post (Payload) ======
export interface PostAuthor {
  id?: string;
  name: string;
  displayName: string;
  image?: string | null | { url: string };
}

export interface PostLite {
  id: string;
  title: string;
  slug: string;
  desc?: string;
  mainImage?: string | { url: string; alt?: string };
  imageAlt?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: PostAuthor;
  tags?: Array<{ id: string; name: string; slug?: string }>;
  discussions?: boolean;
}

export interface PostFull extends PostLite {
  content: any;
  relatedPosts: PostLite[];
  readingTime?: number;
}

// ====== Product (Payload) ======
export interface ProductColorLite {
  id?: string;
  color?: string;
  hexCode?: string;
  price: number;
  discount: number | null;
  name?: string;
  stocks?: number;
  stock?: number;
  status?: string;
}

export interface ProductLite {
  id: string;
  name: string;
  slug: string;
  desc: string;
  content: any;
  images: Array<string | { url: string; alt?: string }>;
  mainImage: string | { url: string; alt?: string };
  category?: { id: string; title: string; slug: string };
  sellerId?: string;
  seller?: { id: string; name: string; image: string | null };
  colors: ProductColorLite[];
  material?: string;
  dimensions?: string;
  assemblyRequired?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProductFull extends ProductLite {
  relatedProducts: ProductLite[];
}

// ====== Category & Tag (Payload) ======
export interface CategoryLite {
  id: string;
  title: string;
  slug: string;
  image?: string;
  count: number;
}

export interface TagLite {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// ====== Search ======
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

// بقیه‌ی تایپ‌ها (Comment, Order, ...) بدون تغییر می‌مانند// lib/types.ts — اضافه کنید

// ====== Notification ======
export type NotificationType =
| 'COMMENT'
| 'REPLY'
| 'POST'
| 'PAID'
| 'DELIVERED'
| 'ORDER'
| 'PRODUCT';

export type NotificationTargetType = 'post' | 'product' | 'order';

export interface NotificationIssuer {
id: string;
name?: string | null;
displayName?: string | null;
image?: string | null;
}

export interface NotificationPostLite {
slug: string;
title: string;
images: string[];
}

export interface NotificationProductLite {
slug: string;
name: string;
images: string[];
}

export interface NotificationOrderLite {
id: string;
orderCode: string;
total: number;
status: string;
}

export interface NotificationItem {
id: string;
type: NotificationType;
read: boolean;
createdAt: string | Date;
targetType?: NotificationTargetType | string | null;
targetId?: string | null;
issuer: NotificationIssuer | null;
recipient?: NotificationIssuer | null;
post?: NotificationPostLite | null;
product?: NotificationProductLite | null;
order?: NotificationOrderLite | null;
}

export interface NotificationsPage {
notifications: NotificationItem[];
nextCursor: string | null;
unreadCount: number;
}