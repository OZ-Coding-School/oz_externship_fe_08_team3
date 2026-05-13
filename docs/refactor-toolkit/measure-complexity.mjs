#!/usr/bin/env node
// scripts/measure-complexity.mjs
//
// 모든 .ts/.tsx 파일에 대해 다음을 측정해서 reports/complexity.{json,md} 에 저장.
// - LOC
// - useState/useEffect/useMemo/useCallback/React.memo 호출 수
// - forwardRef 사용 수
// - 컴포넌트 함수 수
// - 점수 (가중 합)
//
// 사용: node scripts/measure-complexity.mjs

import { Project, SyntaxKind } from 'ts-morph';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = resolve(ROOT, 'reports');
if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });

const TSCONFIG = existsSync(resolve(ROOT, 'tsconfig.app.json'))
  ? resolve(ROOT, 'tsconfig.app.json')
  : resolve(ROOT, 'tsconfig.json');

console.log(`[measure-complexity] using ${relative(ROOT, TSCONFIG)}`);

const project = new Project({
  tsConfigFilePath: TSCONFIG,
  skipAddingFilesFromTsConfig: false,
});

// src/ 안만 — 테스트나 d.ts는 제외
const files = project
  .getSourceFiles()
  .filter((f) => {
    const p = f.getFilePath();
    return (
      p.includes(`${ROOT}/src/`) &&
      !p.endsWith('.d.ts') &&
      !p.includes('/node_modules/') &&
      !p.includes('.test.') &&
      !p.includes('.spec.')
    );
  });

const HOOK_NAMES = new Set([
  'useState',
  'useReducer',
  'useEffect',
  'useLayoutEffect',
  'useMemo',
  'useCallback',
  'useRef',
  'useContext',
  'useId',
  'useSyncExternalStore',
  'useTransition',
  'useDeferredValue',
  'useImperativeHandle',
  'useDebugValue',
  'useInsertionEffect',
  'useActionState',
  'useFormStatus',
  'useOptimistic',
]);

const MANUAL_MEMO = new Set(['useMemo', 'useCallback']);

function countCalls(file, predicate) {
  return file.getDescendantsOfKind(SyntaxKind.CallExpression).filter(predicate)
    .length;
}

function fileMetrics(file) {
  const path = relative(ROOT, file.getFilePath());
  const loc = file.getEndLineNumber();

  // import { ... } from 'react' 안에 forwardRef/memo 들어있는지
  const reactImports = file
    .getImportDeclarations()
    .filter((d) => d.getModuleSpecifierValue() === 'react');

  let usesForwardRef = false;
  let usesReactMemo = false;
  for (const imp of reactImports) {
    for (const named of imp.getNamedImports()) {
      const n = named.getName();
      if (n === 'forwardRef') usesForwardRef = true;
      if (n === 'memo') usesReactMemo = true;
    }
    // namespace import
    const ns = imp.getNamespaceImport();
    if (ns) {
      const text = imp.getText();
      if (/forwardRef/.test(text)) usesForwardRef = true;
      if (/\.memo\b/.test(text)) usesReactMemo = true;
    }
  }

  // 실제 호출 수 — useState() 같은 패턴
  const calls = file.getDescendantsOfKind(SyntaxKind.CallExpression);
  const hookCalls = {};
  for (const name of HOOK_NAMES) hookCalls[name] = 0;

  let forwardRefCalls = 0;
  let memoCalls = 0;

  for (const call of calls) {
    const expr = call.getExpression().getText();
    // useXxx() 직접 호출
    if (HOOK_NAMES.has(expr)) hookCalls[expr]++;
    if (expr === 'forwardRef') forwardRefCalls++;
    if (expr === 'memo' || expr === 'React.memo') memoCalls++;
  }

  const useState = hookCalls.useState + hookCalls.useReducer;
  const useEffect = hookCalls.useEffect + hookCalls.useLayoutEffect;
  const useMemo = hookCalls.useMemo;
  const useCallback = hookCalls.useCallback;
  const memos = useMemo + useCallback + memoCalls;

  // 점수
  const score =
    loc * 0.1 +
    useState * 3 +
    useEffect * 5 +
    memos * 2 +
    forwardRefCalls * 4;

  return {
    path,
    loc,
    useState,
    useEffect,
    useMemo,
    useCallback,
    reactMemo: memoCalls,
    forwardRef: forwardRefCalls,
    useId: hookCalls.useId,
    useSyncExternalStore: hookCalls.useSyncExternalStore,
    useActionState: hookCalls.useActionState,
    useOptimistic: hookCalls.useOptimistic,
    score: Number(score.toFixed(1)),
    flags: {
      // 안티 패턴 플래그
      usesForwardRef: usesForwardRef || forwardRefCalls > 0,
      usesReactMemo: usesReactMemo || memoCalls > 0,
      hasManualMemo: memos > 0,
      hasEffect: useEffect > 0,
    },
  };
}

console.log(`[measure-complexity] analyzing ${files.length} files...`);

const rows = files.map(fileMetrics).sort((a, b) => b.score - a.score);

// 도메인 집계
const DOMAINS = {
  common: /^src\/components\/(common|layout)\//,
  qna: /^src\/(components\/qna|features\/qna|pages\/qna)\//,
  chatbot: /^src\/(components\/chatbot|features\/chatbot)\//,
  shared: /^src\/(api|stores|hooks|utils|providers|mocks|constants)\//,
  other: /.*/,
};

function domainOf(path) {
  for (const [name, re] of Object.entries(DOMAINS)) {
    if (re.test(path)) return name;
  }
  return 'other';
}

const summary = {
  totalFiles: rows.length,
  totalLOC: rows.reduce((a, r) => a + r.loc, 0),
  totalUseState: rows.reduce((a, r) => a + r.useState, 0),
  totalUseEffect: rows.reduce((a, r) => a + r.useEffect, 0),
  totalManualMemo: rows.reduce(
    (a, r) => a + r.useMemo + r.useCallback + r.reactMemo,
    0,
  ),
  totalForwardRef: rows.reduce((a, r) => a + r.forwardRef, 0),
  totalReact19Hooks: rows.reduce(
    (a, r) => a + r.useActionState + r.useOptimistic + r.useId,
    0,
  ),
  byDomain: {},
};

for (const dom of Object.keys(DOMAINS)) {
  const subset = rows.filter((r) => domainOf(r.path) === dom);
  summary.byDomain[dom] = {
    files: subset.length,
    loc: subset.reduce((a, r) => a + r.loc, 0),
    useEffect: subset.reduce((a, r) => a + r.useEffect, 0),
    manualMemo: subset.reduce(
      (a, r) => a + r.useMemo + r.useCallback + r.reactMemo,
      0,
    ),
    avgScore: subset.length
      ? Number((subset.reduce((a, r) => a + r.score, 0) / subset.length).toFixed(2))
      : 0,
  };
}

// JSON 저장
const complexityPath = resolve(REPORTS_DIR, 'complexity.json');
writeFileSync(
  complexityPath,
  JSON.stringify({ generatedAt: new Date().toISOString(), summary, rows }, null, 2),
);
console.log(`[measure-complexity] wrote ${relative(ROOT, complexityPath)}`);

// 마크다운 요약
const top20 = rows.slice(0, 20);
const lines = [
  `# Complexity Report — ${new Date().toISOString().slice(0, 10)}`,
  '',
  '## Headline',
  '',
  `- 총 파일: **${summary.totalFiles}**`,
  `- 총 LOC: **${summary.totalLOC.toLocaleString()}**`,
  `- 총 \`useState\`: **${summary.totalUseState}**`,
  `- 총 \`useEffect\`: **${summary.totalUseEffect}** ⚠️ 목표: 절반 이하`,
  `- 총 수동 메모이제이션 (useMemo/useCallback/React.memo): **${summary.totalManualMemo}** ⚠️ 목표: < 10`,
  `- 총 forwardRef: **${summary.totalForwardRef}** ⚠️ 목표: 0`,
  `- React 19 신규 훅 사용 (useActionState/useOptimistic/useId): **${summary.totalReact19Hooks}**`,
  '',
  '## By Domain',
  '',
  '| 도메인 | 파일 | LOC | useEffect | 수동 memo | 평균 점수 |',
  '|--------|------|-----|-----------|-----------|----------|',
  ...Object.entries(summary.byDomain).map(
    ([d, s]) =>
      `| ${d} | ${s.files} | ${s.loc} | ${s.useEffect} | ${s.manualMemo} | ${s.avgScore} |`,
  ),
  '',
  '## Top 20 Refactor Priorities',
  '',
  '| # | 파일 | LOC | useState | useEffect | memos | fwdRef | 점수 |',
  '|---|------|-----|----------|-----------|-------|--------|------|',
  ...top20.map(
    (r, i) =>
      `| ${i + 1} | \`${r.path}\` | ${r.loc} | ${r.useState} | ${r.useEffect} | ${r.useMemo + r.useCallback + r.reactMemo} | ${r.forwardRef} | ${r.score} |`,
  ),
  '',
  '## Notes',
  '',
  '- 점수 가중치: LOC×0.1 + useState×3 + useEffect×5 + memo×2 + forwardRef×4',
  '- 컴파일러 환경에서 수동 memo는 거의 다 제거 대상',
  '- useEffect는 거의 대부분 derived state 또는 이벤트 핸들러로 치환 가능',
  '- forwardRef는 React 19에서 ref-as-prop으로 마이그레이션 (이 카운트는 0이 목표)',
];

const mdPath = resolve(REPORTS_DIR, 'complexity.md');
writeFileSync(mdPath, lines.join('\n'));
console.log(`[measure-complexity] wrote ${relative(ROOT, mdPath)}`);

// 우선순위 큐 (priority.md) — 도메인별로 그룹화
const priorityLines = [
  `# Refactor Priority Queue — ${new Date().toISOString().slice(0, 10)}`,
  '',
  '리팩토링은 도메인 단위 일괄로 진행한다: common → qna → chatbot',
  '',
];

for (const dom of ['common', 'qna', 'chatbot', 'shared']) {
  const subset = rows.filter((r) => domainOf(r.path) === dom).slice(0, 10);
  if (subset.length === 0) continue;
  priorityLines.push(`## ${dom}`, '');
  priorityLines.push('| 순위 | 파일 | 점수 | 키 이슈 |');
  priorityLines.push('|------|------|------|---------|');
  for (let i = 0; i < subset.length; i++) {
    const r = subset[i];
    const issues = [];
    if (r.useEffect > 0) issues.push(`useEffect×${r.useEffect}`);
    if (r.useMemo + r.useCallback + r.reactMemo > 0)
      issues.push(`memo×${r.useMemo + r.useCallback + r.reactMemo}`);
    if (r.forwardRef > 0) issues.push(`forwardRef×${r.forwardRef}`);
    if (r.useState >= 5) issues.push(`useState×${r.useState}`);
    if (r.loc > 200) issues.push(`LOC×${r.loc}`);
    priorityLines.push(
      `| ${i + 1} | \`${r.path}\` | ${r.score} | ${issues.join(', ') || '—'} |`,
    );
  }
  priorityLines.push('');
}

const priorityPath = resolve(REPORTS_DIR, 'priority.md');
writeFileSync(priorityPath, priorityLines.join('\n'));
console.log(`[measure-complexity] wrote ${relative(ROOT, priorityPath)}`);

// 콘솔 요약
console.log('');
console.log('=== Summary ===');
console.log(`Files: ${summary.totalFiles}`);
console.log(`useEffect total: ${summary.totalUseEffect}`);
console.log(`Manual memo total: ${summary.totalManualMemo}`);
console.log(`forwardRef total: ${summary.totalForwardRef}`);
console.log('');
console.log('Top 5:');
for (const r of rows.slice(0, 5)) {
  console.log(`  ${r.score.toFixed(1).padStart(6)} ${r.path}`);
}
