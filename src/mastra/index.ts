import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow, blogGenerationWorkflow } from './workflows';
import { weatherAgent, copywriterAgent, editorAgent, seoAgent } from './agents';
import { mcpAgent } from './agents/mcpAgent';
import { playWrightAgent } from './agents/playWrightAgent';
import { qiitaPostSummarizeAgent } from './agents/qiitaPostSummarizeAgent';


export const mastra = new Mastra({
  workflows: { weatherWorkflow, blogGenerationWorkflow },
  agents: { 
    weatherAgent, 
    mcpAgent, 
    playWrightAgent, 
    qiitaPostSummarizeAgent,
    copywriterAgent,
    editorAgent,
    seoAgent
  },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
