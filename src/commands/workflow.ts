import path from 'node:path';
import { getTargets, Scope } from '../paths.js';
import { exists, readText } from '../utils/fsx.js';
import { log } from '../utils/log.js';
import type { WorkflowRole, WorkflowRunMode, WorkflowRunState } from '../types/workflow-state.js';
import {
  createRunState,
  markLatest,
  writeRunState,
} from '../state/workflow-state.js';
import { prepareResumeRun } from './workflow/prepare-resume.js';
import { prepareReplayRun } from './workflow/prepare-replay.js';
import { runWorkflowSteps } from './workflow/run-steps.js';

const WORKFLOW_ROLES: WorkflowRole[] = ['architect', 'executor', 'review'];

export async function runWorkflow(
  scope: Scope,
  opts: { mode: WorkflowRunMode; runId?: string; task?: string },
) {
  const t = getTargets(scope);

  const architectPromptPath = path.join(t.codexHome, 'prompts', 'architect.md');
  const executorPromptPath = path.join(t.codexHome, 'prompts', 'executor.md');
  const reviewPromptPath = path.join(t.codexHome, 'prompts', 'review.md');

  if (!(await exists(architectPromptPath))) throw new Error(`Missing: ${architectPromptPath}`);
  if (!(await exists(executorPromptPath))) throw new Error(`Missing: ${executorPromptPath}`);
  if (!(await exists(reviewPromptPath))) throw new Error(`Missing: ${reviewPromptPath}`);

  const [architectPrompt, executorPrompt, reviewPrompt] = await Promise.all([
    readText(architectPromptPath),
    readText(executorPromptPath),
    readText(reviewPromptPath),
  ]);

  const prompts: Record<WorkflowRole, string> = {
    architect: architectPrompt,
    executor: executorPrompt,
    review: reviewPrompt,
  };

  let state: WorkflowRunState;
  let startIndex = 0;

  if (opts.mode === 'new') {
    const task = opts.task?.trim();
    if (!task) throw new Error('task is required for mode=new');
    state = await createRunState(scope, { task, mode: 'new' });
  } else if (opts.mode === 'resume') {
    const resumeResult = await prepareResumeRun(scope, opts.runId);
    state = resumeResult.state;
    if (resumeResult.kind === 'completed') {
      log.ok(`Run already succeeded: ${state.runId}`);
      const reviewStep = state.steps.find((s) => s.role === 'review');
      if (reviewStep?.output) console.log(reviewStep.output);
      return;
    }
    startIndex = resumeResult.startIndex;
  } else {
    state = await prepareReplayRun(scope, opts.runId, opts.task);
  }

  await runWorkflowSteps(scope, state, startIndex, prompts);

  state.status = 'succeeded';
  await writeRunState(scope, state);

  const reviewStep = state.steps.find((s) => s.role === 'review');
  if (reviewStep?.output) console.log(reviewStep.output);
  log.ok(`Workflow completed (runId=${state.runId})`);

}
