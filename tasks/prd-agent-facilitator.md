# PRD: Agent Facilitator

## Overview
The Agent Facilitator is a web application designed to bridge the gap between a high-level project idea and an autonomous development loop. It generates a "Ralph bundle"—a set of configuration files and scripts that allow a specific AI agent (e.g., Claude Opus 4.5) to build the project autonomously following the Ralph pattern.

## Core Features
1. **Industrial Project Intake**: A high-end UI where users describe their app and select their target LLM. **Claude Opus 4.5** is a primary target.
2. **Autonomous PRD Generator**: Converts the user's description into a structured markdown PRD.
3. **Ralph Bundle Generator**:
    - Converts the PRD into a `prd.json` file.
    - Generates a customized `prompt.md` for the selected model.
    - Generates a `ralph.sh` execution script that **does not use AMP**. It must use the native CLI or API of the chosen LLM.
4. **Export Service**: Packages the generated files into a ZIP for local deployment.

## Technical Requirements
- **LLM Independence**: The generated `ralph.sh` must use the user's chosen LLM's preferred interface (e.g., `anthropic` CLI for Claude) instead of the `amp` tool.
- **Style**: "Warm Industrial Gray" aesthetic.

## Acceptance Criteria
- User can select "Claude Opus 4.5" as the target LLM.
- The generated `ralph.sh` executes the autonomous loop using the chosen LLM's interface.
- Output bundle matches the canonical Ralph structure: `scripts/ralph/ralph.sh`, `scripts/ralph/prd.json`, `scripts/ralph/prompt.md`, `progress.txt`, and archive behavior.
- Generated `ralph.sh` matches the canonical logic from https://raw.githubusercontent.com/snarktank/ralph/main/ralph.sh (archiving, `.last-branch`, progress reset, completion detection) with the single difference that the LLM invocation uses the user-selected CLI/API (not `amp`).
- Generated `prd.json` follows the schema and sizing/ordering rules from https://raw.githubusercontent.com/snarktank/amp-skills/main/ralph/SKILL.md (including required acceptance criteria such as `npm run typecheck passes`, `npm test passes` where applicable, and `Verify in browser using dev-browser skill` for UI stories).
