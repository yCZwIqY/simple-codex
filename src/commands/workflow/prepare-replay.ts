import type { Scope } from '../../paths.js';
import type { WorkflowRunState } from '../../types/workflow-state.js';
import { createRunState, readRunState, resolveRunId } from '../../state/workflow-state.js';

export async function prepareReplayRun(scope: Scope, runId: string | undefined, taskInput: string | undefined): Promise<WorkflowRunState> {
  const sourceRunId = await resolveRunId(scope, runId);
  const source = await readRunState(scope, sourceRunId);
  const task = taskInput?.trim() || source.task;

  return await createRunState(scope, {
    task,
    mode: 'replay',
    previousRunId: source.runId,
  });
}
