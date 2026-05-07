#!/usr/bin/env node
/**
 * create-step-log.js
 * 작업 단계 결과 파일을 자동 생성하는 스크립트
 *
 * 사용법:
 *   node .claude/scripts/create-step-log.js <작업명> <날짜> <단계번호>
 *
 * 예시:
 *   node .claude/scripts/create-step-log.js GPT연동공유 0416 01
 */

const fs = require('fs');
const path = require('path');

const [, , 작업명, 날짜, 단계번호] = process.argv;

if (!작업명 || !날짜 || !단계번호) {
  console.error('사용법: node create-step-log.js <작업명> <날짜> <단계번호>');
  console.error('예시:  node create-step-log.js GPT연동공유 0416 01');
  process.exit(1);
}

const 폴더명 = `${작업명}_${날짜}`;
const 폴더경로 = path.join('docs', 'work-log', 폴더명);
const 파일명 = `${작업명}_${단계번호}단계_${날짜}.md`;
const 파일경로 = path.join(폴더경로, 파일명);

// 폴더 없으면 생성
if (!fs.existsSync(폴더경로)) {
  fs.mkdirSync(폴더경로, { recursive: true });
  console.log(`폴더 생성: ${폴더경로}`);
}

// 이미 파일 존재하면 중단
if (fs.existsSync(파일경로)) {
  console.log(`이미 존재함: ${파일경로}`);
  process.exit(0);
}

// 결과 파일 템플릿 생성
const 템플릿 = `# ${작업명}_${단계번호}단계_${날짜}

## 단계 요약
-

## 생성 파일
-

## 수정 내역
-

## 막혔던 것
-

## 다음 단계 참고
-

## 커밋
-
`;

fs.writeFileSync(파일경로, 템플릿, 'utf8');
console.log(`생성 완료: ${파일경로}`);
