import type { Scope } from '../../paths.js';
import type { WorkflowRunState } from '../../types/workflow-state.js';
import {
  markLatest,
  readRunState,
  resolveRunId,
  writeRunState,
} from '../../state/workflow-state.js';

export type ResumePreparationResult =
  | {
      kind: 'completed';
      state: WorkflowRunState;
    }
  | {
      kind: 'prepared';
      state: WorkflowRunState;
      startIndex: number;
    };

function getResumeStartIndex(state: WorkflowRunState): number {
  const firstNonSucceeded = state.steps.findIndex((step) => step.status !== 'succeeded');
  return firstNonSucceeded === -1 ? state.steps.length : firstNonSucceeded;
}

export async function prepareResumeRun(scope: Scope, runId?: string): Promise<ResumePreparationResult> {
  const resolvedRunId = await resolveRunId(scope, runId);
  const state = await readRunState(scope, resolvedRunId);

  if (state.status === 'succeeded') {
    return {
      kind: 'completed',
      state,
    };
  }

  const startIndex = getResumeStartIndex(state);
  state.mode = 'resume';
  state.status = 'running';

  for (let i = startIndex; i < state.steps.length; i += 1) {
    state.steps[i] = {
      role: state.steps[i].role,
      status: 'pending',
    };
  }

  await writeRunState(scope, state);
  await markLatest(scope, state.runId);

  return {
    kind: 'prepared',
    state,
    startIndex,
  };
}
