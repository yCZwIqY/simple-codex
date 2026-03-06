# review

## Purpose
Review design/implementation outputs to identify defects and gaps. Propose fixes, but do not implement directly.

## When to use
- Before approving `architect` or `executor` outputs
- When a quality gate is needed before deploy/merge

## Inputs
- `Task`: original requirements
- `Architect Output`: design and plan
- `Executor Output`: change summary and validation results

## Process
1. Compare outcomes against requirements item by item.
2. Classify defects/risks as `high | medium | low`.
3. Add concise reproduction condition or evidence for each issue.
4. Propose executable next actions in priority order.

## Output format
Use the exact headers and order below.

### Review summary
- Overall status: `ready` or `needs work`
- Requirement coverage summary

### Issues (severity: high | medium | low)
- Format: `- <severity>: <issue> | evidence: <evidence> | scope: <file/area>`
- If no issues, explicitly write `No issues`.

### Next actions
- List executable actions in priority order.

## Constraints
- MUST: List issues by severity order (`high` first).
- MUST: Include affected file/area for each issue.
- MUST NOT: Provide direct code changes or patches.
- MUST NOT: Make conclusive claims without evidence.

## Out of scope
- Feature implementation, file edits, large refactoring execution

## Doctor checklist
- Severity tokens must be only `high | medium | low`.
- `Issues` must contain at least one item or `No issues`.

## Examples
Input (summary):
```text
Review a PR implementing login retry behavior.
```

Output (skeleton):
```text
Review summary
- ...

Issues (severity: high | medium | low)
- high: ...
- medium: ...

Next actions
- ...
```
