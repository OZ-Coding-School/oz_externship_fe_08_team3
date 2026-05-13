#!/usr/bin/env node
// scripts/compare-bundle.mjs
//
// dist/ 의 모든 파일 사이즈를 측정하고, reports/baseline/bundle.json 과 비교.
// 5% 이상 증가 시 exit 1.
//
// 사용:
//   pnpm exec vite build && node scripts/compare-bundle.mjs
//   node scripts/compare-bundle.mjs --update-baseline

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = process.cwd();
const DIST = resolve(ROOT, 'dist');
const REPORTS = resolve(ROOT, 'reports');
const BASELINE = resolve(REPORTS, 'baseline');
const CURRENT = resolve(REPORTS, 'bundle.json');
const BASELINE_FILE = resolve(BASELINE, 'bundle.json');
const STRICT = process.argv.includes('--strict');
const UPDATE = process.argv.includes('--update-baseline');
const THRESHOLD_PCT = 5;

if (!existsSync(DIST)) {
  console.error('❌ dist/ 없음. `pnpm exec vite build` 먼저 실행.');
  process.exit(1);
}

if (!existsSync(REPORTS)) mkdirSync(REPORTS, { recursive: true });

function walk(dir, prefix = '') {
  const out = {};
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = prefix ? `${prefix}/${name}` : name;
    const st = statSync(full);
    if (st.isDirectory()) Object.assign(out, walk(full, rel));
    else out[rel] = st.size;
  }
  return out;
}

const current = walk(DIST);
const totalCurrent = Object.values(current).reduce((a, b) => a + b, 0);
writeFileSync(CURRENT, JSON.stringify(current, null, 2));

if (UPDATE) {
  if (!existsSync(BASELINE)) mkdirSync(BASELINE, { recursive: true });
  copyFileSync(CURRENT, BASELINE_FILE);
  console.log(`✅ bundle baseline 갱신: ${relative(ROOT, BASELINE_FILE)}`);
  console.log(`   total: ${(totalCurrent / 1024).toFixed(1)}KB`);
  process.exit(0);
}

if (!existsSync(BASELINE_FILE)) {
  if (!existsSync(BASELINE)) mkdirSync(BASELINE, { recursive: true });
  copyFileSync(CURRENT, BASELINE_FILE);
  console.log(`ℹ️  bundle baseline 없음 — 현재를 baseline으로 저장`);
  console.log(`   total: ${(totalCurrent / 1024).toFixed(1)}KB`);
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(BASELINE_FILE, 'utf8'));
const totalBaseline = Object.values(baseline).reduce((a, b) => a + b, 0);
const delta = totalCurrent - totalBaseline;
const pct = (delta / totalBaseline) * 100;

console.log('=== Bundle Size ===');
console.log(`Baseline: ${(totalBaseline / 1024).toFixed(1)}KB`);
console.log(`Current:  ${(totalCurrent / 1024).toFixed(1)}KB`);
console.log(`Delta:    ${delta >= 0 ? '+' : ''}${(delta / 1024).toFixed(1)}KB (${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%)`);

// 파일별 변화
const allFiles = new Set([...Object.keys(baseline), ...Object.keys(current)]);
const changes = [];
for (const f of allFiles) {
  const b = baseline[f] ?? 0;
  const c = current[f] ?? 0;
  if (b !== c) changes.push({ file: f, before: b, after: c, delta: c - b });
}
changes.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

if (changes.length > 0) {
  console.log('\nTop changes:');
  for (const c of changes.slice(0, 10)) {
    const sign = c.delta > 0 ? '+' : '';
    console.log(`  ${sign}${(c.delta / 1024).toFixed(1).padStart(8)}KB  ${c.file}`);
  }
}

if (pct > THRESHOLD_PCT) {
  console.error(`\n❌ 번들이 ${THRESHOLD_PCT}% 이상 증가했습니다.`);
  if (STRICT) process.exit(1);
}
