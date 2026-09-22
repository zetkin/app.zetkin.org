/* eslint-disable no-console */
/**
 * Downloads and opens the Playwright report from the latest CI run for the
 * current branch. Works on macOS, Linux, and Windows (uses Node APIs instead
 * of shell-specific syntax for cross-platform compatibility).
 *
 * Requires the GitHub CLI (`gh`): https://cli.github.com/
 *
 * Usage:
 *   npm run e2e:ci:report
 *   npm run e2e:ci:report -- feat/my-branch
 */
import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';

const REPORT_DIR = 'playwright-report';
const ARTIFACT_NAME = 'playwright-report';
const WORKFLOW_FILE = 'main.yml';

function run(cmd: string): string {
  return execSync(cmd, { encoding: 'utf-8' }).trim();
}

function resolveUpstreamBranch(): string | null {
  try {
    // Get the upstream tracking ref, e.g. "refs/remotes/origin/feat/foo"
    const ref = run('git rev-parse --abbrev-ref --symbolic-full-name @{u}');
    // Extract just the branch name after the remote prefix
    const parts = ref.split('/');
    return parts.slice(1).join('/');
  } catch {
    return null;
  }
}

function getLocalBranch(): string {
  return run('git branch --show-current');
}

function main() {
  const explicitBranch = process.argv[2];

  const branch = explicitBranch || resolveUpstreamBranch() || getLocalBranch();

  if (!branch) {
    console.error(
      'Could not determine branch. Pass it explicitly: npm run e2e:ci:report -- <branch>'
    );
    process.exit(1);
  }

  // Verify gh is available before proceeding
  try {
    run('gh --version');
  } catch {
    console.error(
      'GitHub CLI (`gh`) not found. Install it from https://cli.github.com/'
    );
    process.exit(1);
  }

  console.log(`Looking for CI runs on branch: ${branch}`);

  // Find latest workflow run for the branch
  const json = run(
    `gh run list --branch "${branch}" --workflow ${WORKFLOW_FILE} --limit 1 --json databaseId`
  );
  const runs = JSON.parse(json);
  const runId = runs[0]?.databaseId;

  if (!runId) {
    console.error(
      `No CI runs found for branch "${branch}". Is the branch pushed?`
    );
    process.exit(1);
  }

  console.log(`Downloading report from run ${runId}...`);

  // Clean previous report
  rmSync(REPORT_DIR, { force: true, recursive: true });

  // Download artifact
  try {
    run(`gh run download ${runId} --name ${ARTIFACT_NAME} --dir ${REPORT_DIR}`);
  } catch {
    console.error(
      `Could not download artifact "${ARTIFACT_NAME}" from run ${runId}. ` +
        'The run may not have produced a report.'
    );
    process.exit(1);
  }

  console.log('Opening report...');
  execSync(`npx playwright show-report ${REPORT_DIR}`, { stdio: 'inherit' });
}

main();
