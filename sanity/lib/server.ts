// sanity/lib/server.ts
import 'server-only';
import { draftMode } from 'next/headers';
import { client } from './client';

interface SanityFetchOptions {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
  revalidate?: number | false;
}

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
  revalidate = 60,
}: SanityFetchOptions): Promise<QueryResponse> {
  const isDraftMode = (await draftMode()).isEnabled;
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment || isDraftMode) {
    return client.fetch<QueryResponse>(query, params, {
      cache: 'no-store',
    });
  }

  return client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate: revalidate || false,
      tags: [...tags, 'sanity'],
    },
  });
}