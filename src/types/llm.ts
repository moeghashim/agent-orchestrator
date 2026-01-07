/**
 * LLM Provider Types for Agent Facilitator
 * Defines the domain models for different LLM providers and their configurations
 */

export enum LlmProvider {
  CLAUDE_4_5 = 'CLAUDE_4_5',
  CLAUDE_SONNET = 'CLAUDE_SONNET',
  GPT_4O = 'GPT_4O',
  GPT_4_TURBO = 'GPT_4_TURBO',
}

export interface LlmConfig {
  provider: LlmProvider;
  displayName: string;
  cliCommand: string;
  modelId: string;
  description: string;
  maxTokens: number;
}

export const LLM_CONFIGS: Record<LlmProvider, LlmConfig> = {
  [LlmProvider.CLAUDE_4_5]: {
    provider: LlmProvider.CLAUDE_4_5,
    displayName: 'Claude Opus 4.5',
    cliCommand: 'anthropic',
    modelId: 'claude-opus-4-5-20251101',
    description: 'Most capable Claude model for complex reasoning and code generation',
    maxTokens: 200000,
  },
  [LlmProvider.CLAUDE_SONNET]: {
    provider: LlmProvider.CLAUDE_SONNET,
    displayName: 'Claude Sonnet 4',
    cliCommand: 'anthropic',
    modelId: 'claude-sonnet-4-20250514',
    description: 'Balanced Claude model for everyday tasks',
    maxTokens: 200000,
  },
  [LlmProvider.GPT_4O]: {
    provider: LlmProvider.GPT_4O,
    displayName: 'GPT-4o',
    cliCommand: 'openai',
    modelId: 'gpt-4o',
    description: 'OpenAI flagship multimodal model',
    maxTokens: 128000,
  },
  [LlmProvider.GPT_4_TURBO]: {
    provider: LlmProvider.GPT_4_TURBO,
    displayName: 'GPT-4 Turbo',
    cliCommand: 'openai',
    modelId: 'gpt-4-turbo',
    description: 'OpenAI enhanced GPT-4 with vision capabilities',
    maxTokens: 128000,
  },
};

export interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: number;
  passes: boolean;
  notes: string;
}

export interface ProjectConfig {
  project: string;
  branchName: string;
  description: string;
  userStories: UserStory[];
  llmProvider: LlmProvider;
}

export interface GeneratedBundle {
  promptMd: string;
  prdJson: string;
  ralphSh: string;
}
