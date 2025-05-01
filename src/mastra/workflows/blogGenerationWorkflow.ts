import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Step, Workflow } from '@mastra/core/workflows';
import { z } from 'zod';

// 1. ワークフロー定義
const blogGenerationWorkflow = new Workflow({
  name: 'blog-generation-workflow',
  triggerSchema: z.object({
    topic: z.string().describe('ブログ記事のトピック'),
  }),
});

// 2. コピーライターエージェント（初稿生成）
const copywriterAgent = new Agent({
  name: 'Copywriter',
  instructions: 'あなたはプロのコピーライターです。与えられたトピックに基づいて、オリジナルのブログ記事を作成してください。',
  model: anthropic('claude-3-5-sonnet-20241022'),
});

const copywriterStep = new Step({
  id: 'copywriterStep',
  execute: async ({ context }) => {
    const triggerData = context?.getStepResult<{ topic: string }>('trigger');
    if (!triggerData) {
      throw new Error('トリガーデータが見つかりません');
    }

    const topic = triggerData.topic;
    const result = await copywriterAgent.generate(`以下のトピックについてブログ記事を書いてください: ${topic}`);
    return { copy: result.text };
  },
});

// 3. エディターエージェント（文章整形）
const editorAgent = new Agent({
  name: 'Editor',
  instructions: 'あなたは編集者です。文章の明確さ、トーン、構造を改善してください。',
  model: openai('gpt-4o-mini'),
});

const editorStep = new Step({
  id: 'editorStep',
  execute: async ({ context }) => {
    const copywriterResult = context?.getStepResult(copywriterStep) as { copy: string };
    if (!copywriterResult) {
      throw new Error('コピーライターの結果が見つかりません');
    }

    const copy = copywriterResult.copy;
    const result = await editorAgent.generate(`この記事の明確さを向上させるために編集してください: ${copy}`);
    return { copy: result.text };
  },
});

// 4. SEO最適化エージェント
const seoAgent = new Agent({
  name: 'SEOOptimizer',
  instructions: 'あなたはSEOの専門家です。関連するキーワードを追加し、SEOのための構造を最適化してください。',
  model: openai('gpt-4o-mini'),
});

const seoStep = new Step({
  id: 'seoStep',
  execute: async ({ context }) => {
    const editorResult = context?.getStepResult(editorStep) as { copy: string };
    if (!editorResult) {
      throw new Error('エディターの結果が見つかりません');
    }

    const copy = editorResult.copy;
    const result = await seoAgent.generate(`このブログ記事をSEO向けに最適化してください: ${copy}`);
    return { optimized: result.text };
  },
});

// 5. ワークフローの実行順序を設定
blogGenerationWorkflow
  .step(copywriterStep)
  .then(editorStep)
  .then(seoStep);

blogGenerationWorkflow.commit();

export { blogGenerationWorkflow, copywriterAgent, editorAgent, seoAgent };