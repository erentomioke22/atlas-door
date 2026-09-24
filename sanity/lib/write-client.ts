// sanity/lib/write-client.ts
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

// ✅ Client مخصوص نوشتن با توکن Editor
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // ← حتماً false
  token: process.env.SANITY_API_WRITE_TOKEN,
  perspective: 'raw',
});