---
name: plan
description: Create a structured execution plan before implementation.
---

# $plan

## Purpose
Create an executable plan before implementation. The result should be immediately usable by the executor.

## When to use
- When work has 2+ steps or meaningful risk
- When scope/order/validation must be fixed before file edits

## Inputs
- `Goal`: target outcome
- `Constraints`: time, quality, prohibited actions
- `Current state`: current code/document state

## Process
1. Reframe the goal into verifiable outcomes.
2. Declare missing information under `Assumptions`.
3. Write checklist-based execution steps.
4. Add failure risks and responses (including rollback) per step.

## Output format
Use the exact headers and order below.

### Goal summary
- Summarize the goal as verifiable conditions.

### Assumptions
- State unknown or uncertain information explicitly.

### Step-by-step plan (checklist format)
- Use only checklist format with `- [ ]`.
- Include Definition of Done for each step.

### Risks and rollback strategy
- List major risks and rollback strategy on failure.

### Estimated complexity (optional)
- Choose one: `S | M | L`.

## Constraints
- MUST: Each step must include Definition of Done.
- MUST: Steps must be written in execution order.
- MUST NOT: Include code implementation or patches.
- MUST NOT: Use vague verbs alone (e.g., "improve", "clean up").

## Out of scope
- Direct code edits, running tests, deployment execution

## Doctor checklist
- All 5 required headers must exist with exact names.
- `Step-by-step plan` must use checklist (`- [ ]`) format.

## Examples
Input (summary):
```text
Create a plan to improve consistency of error logging.
```

Output (skeleton):
```text
Goal summary
- ...

Assumptions
- ...

Step-by-step plan (checklist format)
- [ ] ...
- [ ] ...

Risks and rollback strategy
- ...

Estimated complexity (optional)
- M
```
