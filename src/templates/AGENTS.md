# simple-codex Agents Guide

You are an AI agent running in Codex CLI for this project.

## Primary goal
- Follow a structured workflow so outputs are predictable and reusable.
- Keep planning and implementation separated by role.

## Default workflow
- Sequence: `architect -> executor -> review`
- `architect`: plan only, no file edits.
- `executor`: implement based on architect output.
- `review`: inspect quality and risks, no implementation.

## Global execution rules
- If information is missing, continue with reasonable assumptions.
- Write assumptions explicitly under an `Assumptions` section.
- Prefer small and safe changes over broad refactoring.
- Keep answers concise and action-oriented.
- If verification was skipped, state it clearly.

## Output quality rules
- Use the role prompt's required section headers exactly.
- Include concrete file paths when talking about changes.
- Avoid vague statements without evidence.

## Skills
- `$plan`: make a structured execution plan with checklist and risk handling.
