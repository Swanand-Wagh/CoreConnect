import React from 'react';

import Image from 'next/image';
import { Comments } from './Comments';
import { currentUser, isAuthenicated } from '@/lib/auth';
import DOMPurify from 'isomorphic-dompurify';
import { Badge } from '@/components/ui/badge';
import { BlogDataWithContentType } from '../types/blog';
import { getAllBlogComments } from '../server/actions';

type SingleBlogProps = {
  data: BlogDataWithContentType;
};

export const SingleBlog = async ({ data }: SingleBlogProps) => {
  const user = await currentUser();
  const comments = await getAllBlogComments({ slug: data.slug });
  const isAuthenticated = await isAuthenicated();

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Error Loading Blog Post</h1>
        <p>
          We&apos;re sorry, but we couldn&apos;t load the blog post data or probably it doesn&apos;t exist. <br />
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="mb-4 text-4xl font-bold">{data.title}</h1>
          {data.isPaid ? (
            <Badge variant="destructive" className="mb-4">
              Premium Content
            </Badge>
          ) : (
            <Badge variant="default" className="mb-4">
              Free Content
            </Badge>
          )}
        </div>

        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
          <span>By {data.author}</span>
          <span>
            {data.updatedAt
              ? `Updated ${new Date(data.updatedAt).toLocaleDateString()}`
              : `Published ${new Date(data.createdAt).toLocaleDateString()}`}
          </span>
        </div>

        <div className="mb-4 flex gap-2">
          {data.categories.map((category, index) => (
            <Badge key={index} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>

        {data.coverImage && (
          <Image
            width={1200}
            height={630}
            alt={data.title}
            src={data.coverImage}
            className="aspect-video w-full rounded-lg object-cover"
          />
        )}
      </header>

      <div className="prose mb-12 max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content) }} />

      <Comments
        userId={user?.id ?? null}
        blogSlug={data.slug}
        comments={comments?.data ?? []}
        isAuthenticated={isAuthenticated}
      />
    </article>
  );
};
