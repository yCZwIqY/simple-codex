import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { WorkflowRole, WorkflowRunMode, WorkflowRunState } from '../types/workflow-state.js';
import { getTargets, type Scope } from '../paths.js';
import { ensureDir, exists, readText, writeText } from '../utils/fsx.js';

const WORKFLOW_ROLES: WorkflowRole[] = ['architect', 'executor', 'review'];

// 현재 시각을 ISO 문자열로 통일해서 저장하기 위한 헬퍼
function nowIso() {
  return new Date().toISOString();
}

// scope(user/project)에 맞는 workflow run 루트 디렉터리를 계산
function getRunsRoot(scope: Scope) {
  const t = getTargets(scope);
  return path.join(t.stateHome, 'workflow-runs');
}

// 특정 runId의 state.json 파일 경로를 계산
function getStatePath(scope: Scope, runId: string) {
  return path.join(getRunsRoot(scope), runId, 'state.json');
}

// 가장 최근 실행 runId를 저장하는 LATEST 파일 경로를 계산
function getLatestPath(scope: Scope) {
  return path.join(getRunsRoot(scope), 'LATEST');
}

// 최신 실행 포인터(LATEST)를 runId로 갱신
export async function markLatest(scope: Scope, runId: string) {
  const latestPath = getLatestPath(scope);
  await ensureDir(path.dirname(latestPath));
  await writeText(latestPath, `${runId}\n`);
}

// runId를 확정(resolve): 인자가 있으면 그대로, 없으면 LATEST 파일에서 읽음
export async function resolveRunId(scope: Scope, runId?: string): Promise<string> {
  if (runId?.trim()) return runId.trim();

  const latestPath = getLatestPath(scope);
  if (!(await exists(latestPath))) {
    throw new Error('No workflow run id provided and LATEST is missing');
  }

  const latestRunId = (await readText(latestPath)).trim();
  if (!latestRunId) throw new Error('LATEST exist but is empty');
  return latestRunId;
}

// 특정 runId의 상태 파일(state.json)을 읽어 WorkflowRunState로 반환
export async function readRunState(scope: Scope, runId: string): Promise<WorkflowRunState> {
  const statePath = getStatePath(scope, runId);
  if (!(await exists(statePath))) throw new Error(`Missing workflow state: ${statePath}`);
  const raw = await readText(statePath);
  return JSON.parse(raw) as WorkflowRunState;
}

// 상태를 디스크에 저장하면서 updatedAt을 현재 시각으로 자동 갱신
export async function writeRunState(scope: Scope, state: WorkflowRunState): Promise<void> {
  const newState: WorkflowRunState = {
    ...state,
    updatedAt: nowIso(),
  };

  const statePath = getStatePath(scope, state.runId);
  await ensureDir(path.dirname(statePath));
  await writeText(statePath, `${JSON.stringify(newState, null, 2)}\n`);
}

// 새로운 workflow 실행 상태를 생성하고, 초기 state.json + LATEST를 함께 기록
export async function createRunState(scope: Scope, input: {
  task: string;
  mode: WorkflowRunMode;
  previousRunId?: string;
}): Promise<WorkflowRunState> {
  const createdAt = nowIso();
  const runId = randomUUID();

  const state: WorkflowRunState = {
    runId,
    mode: input.mode,
    status: 'running',
    task: input.task,
    previousRunId: input.previousRunId,
    createdAt,
    updatedAt: createdAt,
    steps: WORKFLOW_ROLES.map(role => ({ role, status: 'pending' })),
  } as WorkflowRunState;

  await writeRunState(scope, state);
  await markLatest(scope, runId);
  return state;
}
