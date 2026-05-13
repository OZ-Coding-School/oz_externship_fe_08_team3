#!/usr/bin/env node
// scripts/a11y-grep.mjs
//
// axe로 못 잡는 정적 안티 패턴을 grep으로 검출.
// reports/a11y-manual.{json,md} 생성.

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = process.cwd();
const SRC = resolve(ROOT, 'src');
const REPORTS = resolve(ROOT, 'reports');
if (!existsSync(REPORTS)) mkdirSync(REPORTS, { recursive: true });

const PATTERNS = [
  {
    id: 'forwardRef-usage',
    severity: 'serious',
    wcag: '—',
    note: 'forwardRef는 React 19에서 ref-as-prop으로 대체. a11y와 직접 관계는 아니지만 컴포넌트 모더나이즈 신호.',
    re: /\bforwardRef\b/,
  },
  {
    id: 'focus-trap-react',
    severity: 'serious',
    wcag: '2.1.2 No Keyboard Trap',
    note: '<dialog> + showModal() 사용 시 불필요. Modal/AlertModal 등이 <dialog>로 마이그레이션됐는지 확인.',
    re: /from\s+['"]focus-trap-react['"]/,
  },
  {
    id: 'div-onclick-no-keyboard',
    severity: 'critical',
    wcag: '2.1.1 Keyboard',
    note: '<div onClick>은 키보드 접근 불가. <button> 또는 role+tabIndex+onKeyDown 필요.',
    re: /<div[^>]*onClick=/,
  },
  {
    id: 'img-no-alt',
    severity: 'critical',
    wcag: '1.1.1 Non-text Content',
    note: '<img>에 alt 속성 필수. 장식용이면 alt="".',
    re: /<img(?![^>]*\balt\s*=)[^>]*>/,
  },
  {
    id: 'span-onclick',
    severity: 'critical',
    wcag: '2.1.1 Keyboard',
    note: '<span onClick>은 키보드/스크린리더 접근 불가.',
    re: /<span[^>]*onClick=/,
  },
  {
    id: 'aria-label-empty',
    severity: 'serious',
    wcag: '4.1.2 Name, Role, Value',
    note: 'aria-label=""는 라벨 없음과 동일하지만 의도 모호. 의도적이면 aria-hidden 사용.',
    re: /aria-label\s*=\s*["']\s*["']/,
  },
  {
    id: 'label-no-htmlfor',
    severity: 'serious',
    wcag: '1.3.1 / 3.3.2 Labels',
    note: '<label>은 htmlFor로 input과 연결되어야 함. useId() 권장.',
    re: /<label(?![^>]*\bhtmlFor\s*=)[^>]*>/,
  },
  {
    id: 'no-prefers-reduced-motion',
    severity: 'moderate',
    wcag: '2.3.3 Animation from Interactions',
    note: '애니메이션/transition 사용 컴포넌트는 prefers-reduced-motion 대응 필요.',
    re: /\btransition[-:]|animate(?:tion)?[-:]/,
    // 너무 많이 잡힐 수 있어서 도메인 파일 일부만 위험 신호로
    onlyReport: true,
  },
  {
    id: 'manual-modal-pattern',
    severity: 'moderate',
    wcag: '—',
    note: '<dialog> 대신 div + position: fixed로 모달 흉내. 마이그레이션 후보.',
    re: /role\s*=\s*["']dialog["']/,
  },
];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(tsx?|jsx?)$/.test(name)) yield full;
  }
}

const findings = [];
for (const file of walk(SRC)) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  for (const p of PATTERNS) {
    let match;
    const re = new RegExp(p.re.source, p.re.flags.includes('g') ? p.re.flags : p.re.flags + 'g');
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i])) {
        findings.push({
          patternId: p.id,
          severity: p.severity,
          wcag: p.wcag,
          file: relative(ROOT, file),
          line: i + 1,
          content: lines[i].trim().slice(0, 200),
        });
      }
      re.lastIndex = 0;
    }
  }
}

// 도메인 분류
function domainOf(path) {
  if (/^src\/components\/(common|layout)\//.test(path)) return 'common';
  if (/^src\/(components\/qna|features\/qna|pages\/qna)\//.test(path)) return 'qna';
  if (/^src\/(components\/chatbot|features\/chatbot)\//.test(path)) return 'chatbot';
  return 'shared';
}

const bySeverity = { critical: 0, serious: 0, moderate: 0, minor: 0 };
const byDomain = { common: {}, qna: {}, chatbot: {}, shared: {} };
const byPattern = {};
for (const f of findings) {
  bySeverity[f.severity]++;
  const dom = domainOf(f.file);
  byDomain[dom][f.severity] = (byDomain[dom][f.severity] || 0) + 1;
  byPattern[f.patternId] = (byPattern[f.patternId] || 0) + 1;
}

writeFileSync(
  resolve(REPORTS, 'a11y-manual.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), bySeverity, byDomain, byPattern, findings }, null, 2),
);

const md = [
  `# A11y Manual Pattern Audit — ${new Date().toISOString().slice(0, 10)}`,
  '',
  '## Severity Breakdown',
  '',
  `- critical: **${bySeverity.critical}**`,
  `- serious:  **${bySeverity.serious}**`,
  `- moderate: **${bySeverity.moderate}**`,
  `- minor:    **${bySeverity.minor}**`,
  '',
  '## By Domain',
  '',
  '| 도메인 | critical | serious | moderate | minor |',
  '|--------|----------|---------|----------|-------|',
  ...['common', 'qna', 'chatbot', 'shared'].map((d) => {
    const s = byDomain[d];
    return `| ${d} | ${s.critical || 0} | ${s.serious || 0} | ${s.moderate || 0} | ${s.minor || 0} |`;
  }),
  '',
  '## Pattern Counts',
  '',
  ...Object.entries(byPattern)
    .sort((a, b) => b[1] - a[1])
    .map(([id, n]) => `- \`${id}\`: ${n}`),
  '',
  '## Top Files (most findings)',
  '',
];

const byFile = {};
for (const f of findings) {
  byFile[f.file] = (byFile[f.file] || 0) + 1;
}
const topFiles = Object.entries(byFile)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);

md.push('| 파일 | 건수 |');
md.push('|------|------|');
for (const [file, n] of topFiles) md.push(`| \`${file}\` | ${n} |`);

writeFileSync(resolve(REPORTS, 'a11y-manual.md'), md.join('\n'));
console.log(`✅ wrote reports/a11y-manual.{json,md}`);
console.log('');
console.log('=== A11y Manual Audit ===');
for (const [sev, n] of Object.entries(bySeverity)) {
  console.log(`  ${sev.padEnd(10)} ${n}`);
}
