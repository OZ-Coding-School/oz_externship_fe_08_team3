---
description: 이슈 생성 → git add → commit → push 를 한번에 진행합니다.
---

# Ship: 이슈 생성 + 커밋 + 푸시

아래 단계를 순서대로 진행해주세요.

## 1단계: 변경사항 분석

- `git status`와 `git diff`로 현재 변경사항을 파악합니다.
- 변경된 파일과 내용을 분석하여 작업 내역을 요약합니다.

## 2단계: GitHub 이슈 생성

- 분석한 변경사항을 기반으로 적절한 이슈를 `gh issue create`로 생성합니다.
- 이슈 제목 형식: 작업 내용을 간결하게 설명
- 이슈 본문: 변경사항 상세 설명
- 생성된 이슈 번호를 기록합니다.

## 3단계: git add & commit

- 변경된 파일들을 `git add`합니다. (.env, credentials 등 민감한 파일은 제외)
- 커밋 메시지 형식: `타입: 설명 (#이슈번호)`
  - 타입: feat, fix, refactor, style, docs, test, chore, build, ci, perf
  - 이슈번호는 2단계에서 생성한 번호를 사용합니다.
- 커밋 본문에 변경사항을 상세히 기술합니다.
- **Co-Authored-By는 포함하지 않습니다.**

## 4단계: git push

- 현재 브랜치를 원격에 push합니다.
- 원격 브랜치가 없으면 `-u` 플래그로 설정합니다.
- push 완료 후 이슈 URL과 커밋 해시를 출력합니다.

## 주의사항

- 각 단계 진행 전 사용자에게 내용을 보여주고 확인을 받습니다.
- 커밋 메시지에 Co-Authored-By를 넣지 않습니다.
- 민감한 파일(.env 등)은 절대 add하지 않습니다.

$ARGUMENTS
