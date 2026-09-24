// hook/useSearch.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDebounce } from 'use-debounce';
import type { SearchResponse, SearchTab } from '@/lib/types';

interface UseSearchOptions {
  query: string;
  type: SearchTab;
  enabled?: boolean;
  debounceMs?: number;
}

export function useSearch({
  query,
  type = 'all',
  enabled = true,
  debounceMs = 400,
}: UseSearchOptions) {
  const [debouncedQuery] = useDebounce(query.trim(), debounceMs);

  return useQuery<SearchResponse>({
    queryKey: ['search', debouncedQuery, type],
    queryFn: async () => {
      const res = await axios.get<SearchResponse>('/api/search', {
        params: { q: debouncedQuery, type },
      });
      return res.data;
    },
    enabled: enabled && debouncedQuery.length >= 2,
    staleTime: 60 * 1000, // ۱ دقیقه
    placeholderData: (prev) => prev, // نگه‌داشتن داده قبلی
  });
}