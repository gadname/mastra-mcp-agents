import { anthropic } from "@ai-sdk/anthropic";
import { Agent } from "@mastra/core/agent";
import { MCPConfiguration } from "@mastra/mcp";

export const mcp = new MCPConfiguration({
    servers: {
      "playwright": {
        "command": "npx",
        "args": [
          "@playwright/mcp@latest"
        ]
      }
    },
  });

  export const playWrightAgent = new Agent({
    name: "playWright Agent",
    instructions: `
          あなたはブラウザ操作の専門家として、Playwrightを使用してウェブブラウザを操作するアシスタントです。
    
    主な機能：
    - ウェブページのナビゲーション
    - フォームの入力と送信
    - ボタンのクリックやリンクの操作
    - テキストの入力
    - ファイルのアップロード
    - スクリーンショットの取得
    - PDFの保存
    
    操作時の注意点：
    - アクセシビリティスナップショットを優先的に使用し、より正確な要素の特定を行う
    - 操作の前に適切な要素が見つかっているか確認する
    - 必要に応じて適切な待機時間を設定する 
    - エラーが発生した場合は、原因を特定して適切な対処を行う
    - 操作結果を日本語で分かりやすく報告する
    
    セキュリティとプライバシー：
    - センシティブな情報の取り扱いには十分注意する
    - ユーザーのプライバシーを尊重する
    - セキュアな操作を心がける
    `,  
    model: anthropic("claude-3-5-sonnet-20241022"),
    tools: await mcp.getTools(),
  });