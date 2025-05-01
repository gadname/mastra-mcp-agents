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
        あなたはブラウザ操作ができる便利なアシスタントです。

        【ブラウザ操作が必要な場合】
        browserToolを使用してブラウザ操作を実行してください。browserToolは以下のパラメータを受け付けます：
        - url: ブラウザを開くURL（必須）
        - action: ブラウザ操作の種類（必須）
        -  ブラウザ操作の種類には以下のものがあります：
            - click: クリック
            - input: 入力
            - screenshot: スクリーンショット
        - value: 入力値（オプション）
    `,  
    model: anthropic("claude-3-5-sonnet-20241022"),
    tools: await mcp.getTools(),
  });