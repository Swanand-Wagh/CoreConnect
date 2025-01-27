'use client';

import { useCallback, useRef, useState } from 'react';

import Link from '@tiptap/extension-link';
import { useEditor } from '@tiptap/react';
import { useRouter } from 'next/navigation';
import Image from '@tiptap/extension-image';

import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';

import { z } from 'zod';
import { BlogForm } from './BlogForm';
import { useForm } from 'react-hook-form';
import { updateBlog } from '../server/actions';
import { useAction } from 'next-safe-action/hooks';
import { convertFileToBase64 } from '@/lib/base64';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema } from '../schema/blog';
import { BlogDataWithContentType } from '../types/blog';

type EditBlogProps = {
  data: BlogDataWithContentType;
};

export const EditBlog = ({ data }: EditBlogProps) => {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(data.coverImage ?? '');
  const { execute, result, isPending, hasSucceeded } = useAction(updateBlog);

  const form = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: data,
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Link,
      Color,
      Underline,
      TextStyle,
      Highlight,
      StarterKit,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'w-[80%] max-w-full mx-auto rounded-sm',
        },
      }),
      CharacterCount,
      TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),
      Placeholder.configure({ placeholder: 'Write something …' }),
    ],
    content: data.content,
  });

  const handleResetBlog = () => {
    form.clearErrors();

    form.reset(data);
    editor?.commands.setContent(data.content);
    setCoverImagePreview(data.coverImage || null);
  };

  const handleCoverImageChange = useCallback(
    async (file: File) => {
      try {
        const base64CoverImage = await convertFileToBase64(file);
        form.setValue('coverImage', base64CoverImage);
        setCoverImagePreview(base64CoverImage);
      } catch (error) {
        console.error('Error converting file to Base64:', error);
      }
    },
    [form]
  );

  const onSubmit = (values: z.infer<typeof blogSchema>) => {
    execute({ ...values, id: data.id });
  };

  if (!isPending && hasSucceeded) {
    router.push('/admin/blogs');
  }

  const handleContainerClick = () => fileInputRef.current?.click();

  return (
    <BlogForm
      form={form}
      editor={editor}
      isEditing={true}
      onSubmit={onSubmit}
      isPending={isPending}
      fileInputRef={fileInputRef}
      success={result?.data?.success}
      handleResetBlog={handleResetBlog}
      error={result.serverError?.toString()}
      coverImagePreview={coverImagePreview}
      handleContainerClick={handleContainerClick}
      handleCoverImageChange={handleCoverImageChange}
    />
  );
};
