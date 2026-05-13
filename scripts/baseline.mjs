#!/usr/bin/env node
// scripts/baseline.mjs
//
// Phase 0 baseline 전체를 한 번에 실행.
//   1. measure-complexity (ts-morph)
//   2. ESLint with metric rules
//   3. scc (file LOC by language)
//   4. madge (순환 의존성)
//   5. a11y-grep (정적 a11y 패턴)
//   6. vite build → compare-bundle
//   7. compare-baseline (첫 실행이면 baseline 저장, 이후엔 diff)
//
// 사용:
//   node scripts/baseline.mjs                  # 측정만 + 첫 실행이면 baseline 저장
//   node scripts/baseline.mjs --update         # 현재를 baseline으로 덮어쓰기
//   node scripts/baseline.mjs --strict         # 회귀 시 exit 1
//   node scripts/baseline.mjs --skip-build     # 번들 측정 skip

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const REPORTS = resolve(ROOT, 'reports');
if (!existsSync(REPORTS)) mkdirSync(REPORTS, { recursive: true });

const args = new Set(process.argv.slice(2));
const UPDATE = args.has('--update');
const STRICT = args.has('--strict');
const SKIP_BUILD = args.has('--skip-build');

function run(cmd, opts = {}) {
  console.log(`\n▶ ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', ...opts });
    return true;
  } catch (err) {
    if (opts.allowFail) {
      console.warn(`  (allowed failure: ${err.message?.slice(0, 100)})`);
      return false;
    }
    throw err;
  }
}

const summary = { steps: [], generatedAt: new Date().toISOString() };

function step(name, fn) {
  const t0 = Date.now();
  let ok = true;
  try {
    fn();
  } catch (e) {
    ok = false;
    console.error(`  ❌ ${name} failed: ${e.message}`);
  }
  const ms = Date.now() - t0;
  summary.steps.push({ name, ok, ms });
  console.log(`${ok ? '✅' : '❌'} ${name} (${ms}ms)`);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  Phase 0 Baseline Measurement');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

step('1. Complexity (ts-morph)', () => {
  run('node scripts/measure-complexity.mjs');
});

step('2. ESLint metrics', () => {
  // metric 룰들이 켜져있다는 전제. 없어도 일단 돌려서 결과만 저장.
  run('pnpm exec eslint "src/**/*.{ts,tsx}" --format json -o reports/eslint.json', {
    allowFail: true,
  });
});

step('3. scc (LOC by file)', () => {
  // scc 바이너리가 없으면 wc로 폴백
  try {
    run('scc --by-file -f json src > reports/scc.json');
  } catch {
    console.warn('  scc 미설치 — wc로 폴백');
    run('find src -name "*.ts" -o -name "*.tsx" | xargs wc -l > reports/wc.txt', { allowFail: true });
  }
});

step('4. madge (순환 의존성)', () => {
  run('pnpm exec madge --circular --extensions ts,tsx src --json > reports/circular.json', {
    allowFail: true,
  });
});

step('5. a11y manual patterns', () => {
  run('node scripts/a11y-grep.mjs');
});

if (!SKIP_BUILD) {
  step('6. Vite build', () => {
    run('pnpm exec vite build');
  });
  step('7. Bundle size compare', () => {
    const flags = [UPDATE && '--update-baseline', STRICT && '--strict'].filter(Boolean).join(' ');
    run(`node scripts/compare-bundle.mjs ${flags}`, { allowFail: !STRICT });
  });
} else {
  console.log('⏭  build/bundle skipped (--skip-build)');
}

step('8. Compare complexity baseline', () => {
  const flags = [UPDATE && '--update-baseline', STRICT && '--strict'].filter(Boolean).join(' ');
  run(`node scripts/compare-baseline.mjs ${flags}`, { allowFail: !STRICT });
});

writeFileSync(resolve(REPORTS, 'run-summary.json'), JSON.stringify(summary, null, 2));

const failed = summary.steps.filter((s) => !s.ok);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`  완료. 성공 ${summary.steps.length - failed.length}/${summary.steps.length}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('생성된 리포트:');
console.log('  reports/complexity.{json,md}');
console.log('  reports/priority.md');
console.log('  reports/a11y-manual.{json,md}');
console.log('  reports/diff.md (baseline 있을 때)');
console.log('  reports/bundle.json');
console.log('  reports/eslint.json');
console.log('  reports/scc.json');
console.log('  reports/circular.json');
console.log('');
console.log('다음 단계:');
console.log('  1. reports/priority.md 검토 — 어디부터 시작할지');
console.log('  2. .claude/agents/complexity-analyst 호출해서 리포트 해석');
console.log('  3. .claude/agents/common-component-refactorer 호출해서 첫 도메인 시작');

if (failed.length > 0 && STRICT) process.exit(1);
