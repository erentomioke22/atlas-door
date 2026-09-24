// lib/portableTextComponents.tsx
import Image from 'next/image';
import Link from 'next/link';
import { PortableTextComponents } from '@portabletext/react';

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.url) return null;

      return (
        <figure className="my-8">
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src={value.url}
              alt={value.alt || 'تصویر مقاله'}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
              placeholder={value.lqip ? 'blur' : 'empty'}
              blurDataURL={value.lqip}
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const isExternal = value?.href?.startsWith('http');
      const rel = isExternal ? 'noopener noreferrer' : '';
      const target = value?.blank || isExternal ? '_blank' : '_self';

      return (
        <Link
          href={value?.href || '#'}
          target={target}
          rel={rel}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {children}
        </Link>
      );
    },
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    code: ({ children }) => (
      <code className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-sm">
        {children}
      </code>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-bold mt-6 mb-3">{children}</h4>,
    h5: ({ children }) => <h5 className="text-base font-bold mt-4 mb-2">{children}</h5>,
    h6: ({ children }) => <h6 className="text-sm font-bold mt-4 mb-2">{children}</h6>,
    normal: ({ children }) => <p className="my-4 leading-loose">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-r-4 border-blue-500 pr-4 my-6 italic text-neutral-600 dark:text-neutral-400">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pr-6 my-4 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pr-6 my-4 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-loose">{children}</li>,
    number: ({ children }) => <li className="leading-loose">{children}</li>,
  },
};