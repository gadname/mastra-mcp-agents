import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';

// コピーライターエージェント
export const copywriterAgent = new Agent({
  name: 'Copywriter',
  instructions: 'あなたはプロのコピーライターです。与えられたトピックに基づいて、オリジナルのブログ記事を作成してください。',
  model: anthropic('claude-3-5-sonnet-20241022'),
});

// エディターエージェント
export const editorAgent = new Agent({
  name: 'Editor',
  instructions: 'あなたは編集者です。文章の明確さ、トーン、構造を改善してください。',
  model: openai('gpt-4o-mini'),
});

// SEO最適化エージェント
export const seoAgent = new Agent({
  name: 'SEOOptimizer',
  instructions: 'あなたはSEOの専門家です。関連するキーワードを追加し、SEOのための構造を最適化してください。',
  model: openai('gpt-4o-mini'),
});