import { spawn } from 'node:child_process';
import type { Scope } from '../../paths.js';
import type { WorkflowRole, WorkflowRunState } from '../../types/workflow-state.js';
import { writeRunState } from '../../state/workflow-state.js';
import { log } from '../../utils/log.js';

const WORKFLOW_ROLES: WorkflowRole[] = ['architect', 'executor', 'review'];

const NON_INTERACTIVE_RULES = [
  'Execution rules:',
  '- Do not ask the user any follow-up questions.',
  '- Do not request choices or confirmations.',
  '- If details are missing, state assumptions briefly and continue.',
  '- Return only the requested output format.',
].join('\n');

function buildStepInput(prompt: string, task: string, upstreamOutputs: string[]): string {
  const upstreamBlock = upstreamOutputs.length > 0 ? upstreamOutputs.join('\n\n') : '- (none)';
  return `${prompt}\n\nTask:\n${task}\n\nUpstream Outputs:\n${upstreamBlock}\n\n${NON_INTERACTIVE_RULES}\n`;
}

async function runCodex(input: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    const args: string[] = ['exec', '-'];
    const child = spawn('codex', args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to start codex: ${error.message}`));
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(
          new Error(
            `codex exited with code ${code}\n` +
            `stderr:\n${stderr.trim()}\n` +
            `stdout:\n${stdout.trim()}`,
          ),
        );
      }
    });

    child.stdin.write(input);
    child.stdin.end();
  });
}

async function runStep(role: string, prompt: string, task: string, upstreamOutputs: string[]): Promise<string> {
  log.info(`Running ${role}...`);
  return await runCodex(buildStepInput(prompt, task, upstreamOutputs));
}

function formatRoleLabel(role: WorkflowRole): string {
  return `${role.charAt(0).toUpperCase()}${role.slice(1)} Output`;
}

function getUpstreamOutputs(state: WorkflowRunState, role: WorkflowRole): string[] {
  const currentIndex = WORKFLOW_ROLES.indexOf(role);
  return state.steps
    .slice(0, currentIndex)
    .filter((step) => step.status === 'succeeded' && typeof step.output === 'string')
    .map((step) => `${formatRoleLabel(step.role)}:\n${step.output}`);
}

function normalizeErr(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

export async function runWorkflowSteps(
  scope: Scope,
  state: WorkflowRunState,
  startIndex: number,
  prompts: Record<WorkflowRole, string>,
): Promise<void> {
  for (let i = startIndex; i < WORKFLOW_ROLES.length; i += 1) {
    const role = WORKFLOW_ROLES[i];
    const step = state.steps[i];
    step.status = 'running';
    step.startAt = new Date().toISOString();
    step.finishedAt = undefined;
    step.error = undefined;
    step.output = undefined;
    state.status = 'running';
    await writeRunState(scope, state);

    try {
      const output = await runStep(role, prompts[role], state.task, getUpstreamOutputs(state, role));
      step.status = 'succeeded';
      step.finishedAt = new Date().toISOString();
      step.output = output;
      await writeRunState(scope, state);
    } catch (e) {
      step.status = 'failed';
      step.finishedAt = new Date().toISOString();
      step.error = normalizeErr(e);
      state.status = 'failed';
      await writeRunState(scope, state);
      throw new Error(`Workflow failed at ${role} (runId=${state.runId}): ${step.error}`);
    }
  }
}
