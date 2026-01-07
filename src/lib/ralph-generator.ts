import { LlmProvider, LLM_CONFIGS, ProjectConfig } from '../types';

/**
 * Generates the LLM invocation command based on provider
 */
function getLlmCommand(provider: LlmProvider): string {
  const config = LLM_CONFIGS[provider];

  switch (config.cliCommand) {
    case 'anthropic':
      return `anthropic messages create --model ${config.modelId} --max-tokens 8192 -f "$SCRIPT_DIR/prompt.md"`;
    case 'openai':
      return `openai api chat.completions.create --model ${config.modelId} --max-tokens 8192 -f "$SCRIPT_DIR/prompt.md"`;
    default:
      return `${config.cliCommand} --model ${config.modelId} -f "$SCRIPT_DIR/prompt.md"`;
  }
}

/**
 * Generates the ralph.sh script content
 * Mirrors canonical logic from https://github.com/snarktank/ralph
 * with non-AMP LLM invocation
 */
export function generateRalphScript(provider: LlmProvider): string {
  const llmCommand = getLlmCommand(provider);
  const providerName = LLM_CONFIGS[provider].displayName;

  return `#!/bin/bash
# Ralph Wiggum - Long-running AI agent loop
# Provider: ${providerName}
# Usage: ./ralph.sh [max_iterations]
#
# This script runs an autonomous AI loop that works through stories
# in prd.json until all pass or max iterations is reached.

set -e

MAX_ITERATIONS=\${1:-10}
SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$(dirname "$SCRIPT_DIR")/progress.txt"
ARCHIVE_DIR="$SCRIPT_DIR/archive"
LAST_BRANCH_FILE="$SCRIPT_DIR/.last-branch"

# Archive previous run if branch changed
if [ -f "$PRD_FILE" ] && [ -f "$LAST_BRANCH_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  LAST_BRANCH=$(cat "$LAST_BRANCH_FILE" 2>/dev/null || echo "")

  if [ -n "$CURRENT_BRANCH" ] && [ -n "$LAST_BRANCH" ] && [ "$CURRENT_BRANCH" != "$LAST_BRANCH" ]; then
    # Archive the previous run
    DATE=$(date +%Y-%m-%d)
    # Strip "ralph/" prefix from branch name for folder
    FOLDER_NAME=$(echo "$LAST_BRANCH" | sed 's|^ralph/||')
    ARCHIVE_FOLDER="$ARCHIVE_DIR/$DATE-$FOLDER_NAME"

    echo "Archiving previous run: $LAST_BRANCH"
    mkdir -p "$ARCHIVE_FOLDER"
    [ -f "$PRD_FILE" ] && cp "$PRD_FILE" "$ARCHIVE_FOLDER/"
    [ -f "$PROGRESS_FILE" ] && cp "$PROGRESS_FILE" "$ARCHIVE_FOLDER/"
    echo "   Archived to: $ARCHIVE_FOLDER"

    # Reset progress file for new run
    echo "# Ralph Progress Log" > "$PROGRESS_FILE"
    echo "Started: $(date)" >> "$PROGRESS_FILE"
    echo "---" >> "$PROGRESS_FILE"
  fi
fi

# Track current branch
if [ -f "$PRD_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  if [ -n "$CURRENT_BRANCH" ]; then
    echo "$CURRENT_BRANCH" > "$LAST_BRANCH_FILE"
  fi
fi

# Initialize progress file if it doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
  echo "# Ralph Progress Log" > "$PROGRESS_FILE"
  echo "Started: $(date)" >> "$PROGRESS_FILE"
  echo "---" >> "$PROGRESS_FILE"
fi

echo "Starting Ralph - Max iterations: $MAX_ITERATIONS"
echo "Provider: ${providerName}"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "═══════════════════════════════════════════════════════"
  echo "  Ralph Iteration $i of $MAX_ITERATIONS"
  echo "═══════════════════════════════════════════════════════"

  # Run the LLM with the ralph prompt
  # Using ${providerName} via CLI
  OUTPUT=$(${llmCommand} 2>&1 | tee /dev/stderr) || true

  # Check for completion signal
  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    echo ""
    echo "Ralph completed all tasks!"
    echo "Completed at iteration $i of $MAX_ITERATIONS"
    exit 0
  fi

  echo "Iteration $i complete. Continuing..."
  sleep 2
done

echo ""
echo "Ralph reached max iterations ($MAX_ITERATIONS) without completing all tasks."
echo "Check $PROGRESS_FILE for status."
exit 1
`;
}

/**
 * Generates the prompt.md content for the Ralph agent
 */
export function generatePromptMd(config: ProjectConfig): string {
  const providerName = LLM_CONFIGS[config.llmProvider].displayName;

  return `# Ralph System Instructions - ${config.project}

## Role
You are an elite AI Software Architect working on the "${config.project}" project using the Ralph pattern.

## Project Goal
${config.description}

## CRITICAL RULE: Atomic Iterations
Focus ONLY on the highest priority story in \`scripts/ralph/prd.json\` where \`passes: false\`.

## Operational Rules
1. **Atomic Iterations**: Complete one story at a time, in priority order.
2. **Persistence**:
    - After completing a story, update \`scripts/ralph/prd.json\` by setting \`passes: true\` for that story.
    - Append technical learnings and patterns to \`progress.txt\`.
3. **Quality Gate**:
    - Every change must pass \`npm run typecheck\`.
    - UI changes must be verified in the browser.

## LLM Provider
This project is configured to use **${providerName}**.

## How to Finish
When all stories in \`prd.json\` have \`passes: true\`, output the string: \`<promise>COMPLETE</promise>\`.

---
*Ralph Pattern by [@GeoffreyHuntley](https://x.com/GeoffreyHuntley) & [@ryancarson](https://x.com/ryancarson)*
`;
}

/**
 * Generates the complete bundle for a Ralph project
 */
export function generateBundle(config: ProjectConfig): {
  ralphSh: string;
  promptMd: string;
  prdJson: string;
} {
  return {
    ralphSh: generateRalphScript(config.llmProvider),
    promptMd: generatePromptMd(config),
    prdJson: JSON.stringify(config, null, 2),
  };
}
