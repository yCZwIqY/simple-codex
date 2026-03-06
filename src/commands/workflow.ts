import path from 'node:path';
import { getTargets, Scope } from '../paths.js';
import { exists, readText } from '../utils/fsx.js';
import { log } from '../utils/log.js';
import { spawn } from 'node:child_process';

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

export async function runWorkflow(scope: Scope, task: string) {
  if (!task?.trim()) throw new Error('task is required');
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

  const architectOutput = await runStep('architect', architectPrompt, task, []);
  const executorOutput = await runStep('executor', executorPrompt, task, [
    `Architect Output:\n${architectOutput}`,
  ]);
  const reviewOutput = await runStep('review', reviewPrompt, task, [
    `Architect Output:\n${architectOutput}`,
    `Executor Output:\n${executorOutput}`,
  ]);

  console.log(reviewOutput);

}
