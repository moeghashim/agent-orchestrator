import { LlmProvider, ProjectConfig, UserStory } from '../types';

export interface PrdInput {
  projectName: string;
  description: string;
  features: string[];
  llmProvider: LlmProvider;
}

/**
 * Converts a branch-safe name (e.g., "User Auth Feature" -> "user-auth-feature")
 */
function toBranchName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generates a story ID with a numeric suffix
 */
function generateStoryId(index: number): string {
  return `US-${String(index + 1).padStart(3, '0')}`;
}

/**
 * Determines if a feature is UI-related based on keywords
 */
function isUiFeature(feature: string): boolean {
  const uiKeywords = [
    'ui', 'interface', 'button', 'form', 'page', 'view', 'component',
    'display', 'screen', 'modal', 'dialog', 'input', 'select', 'dropdown',
    'layout', 'navigation', 'menu', 'header', 'footer', 'sidebar'
  ];
  const lower = feature.toLowerCase();
  return uiKeywords.some(keyword => lower.includes(keyword));
}

/**
 * Generates acceptance criteria based on the feature description
 */
function generateAcceptanceCriteria(feature: string, isUi: boolean): string[] {
  const criteria: string[] = [];

  // Parse the feature for specific requirements
  const featureLower = feature.toLowerCase();

  // Add feature-specific criteria
  if (featureLower.includes('api') || featureLower.includes('endpoint')) {
    criteria.push('API endpoint responds with correct data structure');
  }
  if (featureLower.includes('validation') || featureLower.includes('validate')) {
    criteria.push('Input validation handles edge cases correctly');
  }
  if (featureLower.includes('error') || featureLower.includes('handle')) {
    criteria.push('Error states are handled gracefully');
  }
  if (featureLower.includes('data') || featureLower.includes('model')) {
    criteria.push('Data model matches expected schema');
  }

  // Add default implementation criterion if none exist
  if (criteria.length === 0) {
    criteria.push('Feature implementation matches specification');
  }

  // Always add typecheck
  criteria.push('npm run typecheck passes');

  // Add test criterion for non-UI features
  if (!isUi && (featureLower.includes('logic') || featureLower.includes('util') || featureLower.includes('service'))) {
    criteria.push('npm test passes');
  }

  // Add browser verification for UI features
  if (isUi) {
    criteria.push('Verify in browser using dev-browser skill');
  }

  return criteria;
}

/**
 * Parses a feature string into a structured UserStory
 */
function parseFeatureToStory(feature: string, index: number): UserStory {
  const isUi = isUiFeature(feature);

  // Clean up the feature text
  const cleanFeature = feature.trim().replace(/^[-*•]\s*/, '');

  // Generate a title from the first few words or the whole thing if short
  const words = cleanFeature.split(' ');
  const title = words.length <= 6
    ? cleanFeature
    : words.slice(0, 6).join(' ') + '...';

  return {
    id: generateStoryId(index),
    title,
    description: `As a user, I want ${cleanFeature.toLowerCase()} so that the application meets my needs.`,
    acceptanceCriteria: generateAcceptanceCriteria(cleanFeature, isUi),
    priority: index + 1,
    passes: false,
    notes: '',
  };
}

/**
 * Generates a complete PRD JSON structure from user input
 * Following the Ralph SKILL.md schema requirements
 */
export function generatePrd(input: PrdInput): ProjectConfig {
  const branchSuffix = toBranchName(input.projectName);

  const userStories = input.features.map((feature, index) =>
    parseFeatureToStory(feature, index)
  );

  return {
    project: input.projectName,
    branchName: `ralph/${branchSuffix}`,
    description: input.description,
    userStories,
    llmProvider: input.llmProvider,
  };
}

/**
 * Validates a PRD structure against the Ralph schema requirements
 */
export function validatePrd(prd: ProjectConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!prd.project || prd.project.trim().length === 0) {
    errors.push('Project name is required');
  }

  if (!prd.branchName || !prd.branchName.startsWith('ralph/')) {
    errors.push('Branch name must start with "ralph/"');
  }

  if (!prd.userStories || prd.userStories.length === 0) {
    errors.push('At least one user story is required');
  }

  prd.userStories?.forEach((story, index) => {
    if (!story.id || !story.id.match(/^US-\d{3}$/)) {
      errors.push(`Story ${index + 1}: ID must follow pattern US-XXX`);
    }
    if (!story.title || story.title.trim().length === 0) {
      errors.push(`Story ${index + 1}: Title is required`);
    }
    if (!story.acceptanceCriteria || story.acceptanceCriteria.length === 0) {
      errors.push(`Story ${index + 1}: At least one acceptance criterion is required`);
    }
    if (!story.acceptanceCriteria?.includes('npm run typecheck passes')) {
      errors.push(`Story ${index + 1}: Must include "npm run typecheck passes" criterion`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Serializes a PRD to JSON string with proper formatting
 */
export function serializePrd(prd: ProjectConfig): string {
  return JSON.stringify(prd, null, 2);
}
