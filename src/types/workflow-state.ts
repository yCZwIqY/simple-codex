export type WorkflowRole = 'architect' | 'executor' | 'review';

export type WorkflowStepStatus = 'pending' | 'running' | 'succeeded' | 'failed';
export type WorkflowRunStatus = 'running' | 'succeeded' | 'failed';
export type WorkflowRunMode = 'new' | 'resume' | 'replay';

export interface WorkflowStepState {
  role: WorkflowRole;
  status: WorkflowStepStatus;
  startAt?: string;
  finishedAt?: string;
  output?: string;
  error?: string;
}

export interface WorkflowRunState {
  runId: string;
  mode: WorkflowRunMode;
  status: WorkflowRunStatus;
  task: string;
  previousRunId?: string;
  createdAt: string;
  updatedAt: string;
  steps: WorkflowStepState[];
}