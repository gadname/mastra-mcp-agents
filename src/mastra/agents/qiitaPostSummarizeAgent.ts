import { anthropic } from "@ai-sdk/anthropic";
import { Agent } from "@mastra/core/agent";
import { getQiitaPostTool } from "../tools/qiita-post";

export const qiitaPostSummarizeAgent = new Agent({
  name: 'Qiita Post Summarize Agent',
  instructions: `
    あなたはプロの編集者です。ユーザーから与えられたインプットを、要点を逃さない形で要約します。
    要約の読み手は日本のエンジニアです。エンジニアが読んで理解しやすい内容にすると喜ばれます。

    ## 制約
      - 要約は800文字程度で出力します
      - 難しい漢字は読み手が間違えないように、ひらがなで書きます
      - 要約には markdown の記法やコード、改行コード、URL は含めないでください
  `,
  model: anthropic("claude-3-5-sonnet-20241022"),
  tools: { getQiitaPostTool },
});