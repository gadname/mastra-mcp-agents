import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface QiitaPost {
  title: string;
  body: string;
  user: {
    id: string;
    name: string | null;
  };
  tags: Array<{ name: string }>;
  created_at: string;
  updated_at: string;
}

async function getQiitaPost(postId: string): Promise<QiitaPost> {
  const response = await fetch(`https://qiita.com/api/v2/items/${postId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Qiita post: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Qiita API を使用して、指定の記事内容を取得するツール
 */
export const getQiitaPostTool = createTool({
    id: 'get-qiita-post',
    description: 'Qiita API を使用して、指定の記事内容を取得するツール',
    inputSchema: z.object({
      postId: z.string().describe('記事のID'),
    }),
    outputSchema: z.object({
      title: z.string().describe('記事のタイトル'),
      body: z.string().describe('記事の本文'),
      author: z.string().nullable().describe('記事の作者'),
      tags: z.array(z.string()).describe('記事のタグ'),
      createdAt: z.string().describe('記事の作成日時'),
      updatedAt: z.string().describe('記事の更新日時'),
    }),
    execute: async ({ context }) => {
      const postData = await getQiitaPost(context.postId);
      return {
        title: postData.title,
        body: postData.body,
        author: postData.user.name ? postData.user.name : postData.user.id,
        tags: postData.tags.map((tag) => tag.name),
        createdAt: postData.created_at,
        updatedAt: postData.updated_at,
      };
    },
  });
  