#!/usr/bin/env node
// scripts/compare-baseline.mjs
//
// reports/baseline/complexity.json 과 reports/complexity.json 을 비교해서
// reports/diff.md 생성. 회귀 발견 시 exit 1.
//
// 사용:
//   node scripts/compare-baseline.mjs                    # 비교만
//   node scripts/compare-baseline.mjs --update-baseline  # 현재를 baseline으로 복사
//   node scripts/compare-baseline.mjs --strict           # 회귀 시 exit 1

import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  copyFileSync,
} from 'node:fs';
import { resolve, relative } from 'node:path';

const ROOT = process.cwd();
const REPORTS = resolve(ROOT, 'reports');
const BASELINE = resolve(REPORTS, 'baseline');
const CURRENT_PATH = resolve(REPORTS, 'complexity.json');
const BASELINE_PATH = resolve(BASELINE, 'complexity.json');

const args = new Set(process.argv.slice(2));
const STRICT = args.has('--strict');
const UPDATE = args.has('--update-baseline');

if (!existsSync(CURRENT_PATH)) {
  console.error(`❌ ${relative(ROOT, CURRENT_PATH)} 없음. 먼저 measure-complexity 실행.`);
  process.exit(1);
}

if (UPDATE) {
  if (!existsSync(BASELINE)) mkdirSync(BASELINE, { recursive: true });
  copyFileSync(CURRENT_PATH, BASELINE_PATH);
  console.log(`✅ baseline 갱신: ${relative(ROOT, BASELINE_PATH)}`);
  process.exit(0);
}

if (!existsSync(BASELINE_PATH)) {
  // 첫 실행 — baseline 자동 생성
  if (!existsSync(BASELINE)) mkdirSync(BASELINE, { recursive: true });
  copyFileSync(CURRENT_PATH, BASELINE_PATH);
  console.log(`ℹ️  baseline 없음 — 현재 측정을 baseline으로 저장: ${relative(ROOT, BASELINE_PATH)}`);
  console.log('   다음 측정부터 비교가 동작합니다.');
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
const current = JSON.parse(readFileSync(CURRENT_PATH, 'utf8'));

const baseSummary = baseline.summary;
const curSummary = current.summary;

function delta(cur, base) {
  const d = cur - base;
  const pct = base === 0 ? 0 : (d / base) * 100;
  return { delta: d, pct };
}

const metrics = [
  ['총 파일', curSummary.totalFiles, baseSummary.totalFiles, 'neutral'],
  ['총 LOC', curSummary.totalLOC, baseSummary.totalLOC, 'lower-better'],
  ['useState 총합', curSummary.totalUseState, baseSummary.totalUseState, 'neutral'],
  ['useEffect 총합', curSummary.totalUseEffect, baseSummary.totalUseEffect, 'lower-better'],
  ['수동 memo 총합', curSummary.totalManualMemo, baseSummary.totalManualMemo, 'lower-better'],
  ['forwardRef 총합', curSummary.totalForwardRef, baseSummary.totalForwardRef, 'lower-better'],
  ['React 19 신규 훅', curSummary.totalReact19Hooks, baseSummary.totalReact19Hooks, 'higher-better'],
];

function fmt(d) {
  const sign = d.delta > 0 ? '+' : d.delta < 0 ? '' : '±';
  return `${sign}${d.delta} (${sign}${d.pct.toFixed(1)}%)`;
}

function status(d, kind) {
  if (d.delta === 0) return '➡️';
  if (kind === 'neutral') return 'ℹ️';
  if (kind === 'lower-better') return d.delta < 0 ? '✅' : '⚠️';
  if (kind === 'higher-better') return d.delta > 0 ? '✅' : '⚠️';
  return '';
}

const lines = [
  `# Baseline Diff — ${new Date().toISOString().slice(0, 10)}`,
  '',
  `Baseline: ${baseline.generatedAt}`,
  `Current:  ${current.generatedAt}`,
  '',
  '## Summary',
  '',
  '| Metric | Baseline | Current | Delta | |',
  '|--------|----------|---------|-------|--|',
];

let regressions = 0;
for (const [name, cur, base, kind] of metrics) {
  const d = delta(cur, base);
  const s = status(d, kind);
  if (s === '⚠️') regressions++;
  lines.push(`| ${name} | ${base} | ${cur} | ${fmt(d)} | ${s} |`);
}

lines.push('', '## By Domain', '');
lines.push('| 도메인 | LOC Δ | useEffect Δ | manualMemo Δ | avgScore Δ |');
lines.push('|--------|-------|-------------|--------------|------------|');
for (const dom of Object.keys(curSummary.byDomain)) {
  const c = curSummary.byDomain[dom];
  const b = baseSummary.byDomain[dom] || { loc: 0, useEffect: 0, manualMemo: 0, avgScore: 0 };
  lines.push(
    `| ${dom} | ${fmt(delta(c.loc, b.loc))} | ${fmt(delta(c.useEffect, b.useEffect))} | ${fmt(delta(c.manualMemo, b.manualMemo))} | ${fmt(delta(c.avgScore, b.avgScore))} |`,
  );
}

// 파일별 회귀: baseline에 있던 파일이 점수가 올라간 경우
const baseRowsByPath = new Map(baseline.rows.map((r) => [r.path, r]));
const regressed = [];
const improved = [];
for (const r of current.rows) {
  const b = baseRowsByPath.get(r.path);
  if (!b) continue;
  const d = r.score - b.score;
  if (d > 5) regressed.push({ path: r.path, before: b.score, after: r.score, delta: d });
  if (d < -5) improved.push({ path: r.path, before: b.score, after: r.score, delta: d });
}
regressed.sort((a, b) => b.delta - a.delta);
improved.sort((a, b) => a.delta - b.delta);

if (regressed.length) {
  lines.push('', '## ⚠️ Regressed Files', '');
  lines.push('| 파일 | Before | After | Δ |');
  lines.push('|------|--------|-------|---|');
  for (const r of regressed.slice(0, 20)) {
    lines.push(`| \`${r.path}\` | ${r.before} | ${r.after} | +${r.delta.toFixed(1)} |`);
  }
}

if (improved.length) {
  lines.push('', '## ✅ Improved Files (top 20)', '');
  lines.push('| 파일 | Before | After | Δ |');
  lines.push('|------|--------|-------|---|');
  for (const r of improved.slice(0, 20)) {
    lines.push(`| \`${r.path}\` | ${r.before} | ${r.after} | ${r.delta.toFixed(1)} |`);
  }
}

const diffPath = resolve(REPORTS, 'diff.md');
writeFileSync(diffPath, lines.join('\n'));
console.log(`✅ wrote ${relative(ROOT, diffPath)}`);

console.log('');
console.log('=== Diff Summary ===');
for (const [name, cur, base, kind] of metrics) {
  const d = delta(cur, base);
  console.log(`  ${status(d, kind)} ${name.padEnd(20)} ${String(base).padStart(6)} → ${String(cur).padStart(6)} (${fmt(d)})`);
}

if (regressions > 0 && STRICT) {
  console.error(`\n❌ ${regressions} 메트릭 회귀 발견 (strict 모드)`);
  process.exit(1);
}
if (regressions > 0) {
  console.warn(`\n⚠️  ${regressions} 메트릭 회귀. --strict 옵션으로 CI 차단 가능.`);
}
