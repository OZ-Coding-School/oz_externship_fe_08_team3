---
name: git-sync
description: git add → commit → push 를 한번에 진행합니다.
allowed-tools: Bash(git:*), Read, Grep, Glob
argument-hint: [작업 설명 (선택)]
---

# Ship: 커밋 + 푸시

아래 단계를 순서대로 진행해주세요.

## 1단계: 변경사항 분석

- `git status`와 `git diff`로 현재 변경사항을 파악합니다.
- 변경된 파일과 내용을 분석하여 작업 내역을 요약합니다.

## 2단계: 원격 dev 브랜치 기준 최신화 확인

- 먼저 `git branch --show-current`로 현재 브랜치를 확인합니다.
- **현재 브랜치가 `main` 또는 `dev`인 경우** → 이 단계를 건너뛰고 3단계로 진행합니다.
- `git fetch origin dev`로 원격 dev 브랜치를 최신화합니다.
- `git log HEAD..origin/dev --oneline`으로 현재 브랜치에 반영되지 않은 dev 커밋이 있는지 확인합니다.
- **반영되지 않은 커밋이 없으면** (이미 최신 상태) → 3단계로 진행합니다.
- **반영되지 않은 커밋이 있으면** → 사용자에게 미반영 커밋 목록을 보여주고 rebase 진행 여부를 확인받습니다.
  - 승인 시: 현재 변경사항을 `git stash`로 임시 저장 → `git rebase origin/dev` 실행 → stash 복원
  - **충돌 발생 시:**
    1. 충돌이 발생한 파일 목록을 사용자에게 보여줍니다.
    2. 각 충돌 파일에 대해 현재 브랜치(ours)와 dev 브랜치(theirs)의 변경 내용을 모두 표시합니다.
    3. 파일별로 어떤 버전을 사용할지 (ours / theirs / 수동 편집) 사용자에게 확인받습니다.
    4. 사용자의 선택에 따라 충돌을 해결하고 `git rebase --continue`로 rebase를 완료합니다.
  - rebase 거부 시: 경고 메시지를 출력하고 3단계로 진행합니다.

## 3단계: git add & commit

- 변경된 파일들을 `git add`합니다. (.env, credentials 등 민감한 파일은 제외)
- 커밋 메시지 형식: `타입: 설명`
  - 타입: feat, fix, refactor, style, docs, test, chore, build, ci, perf
- 커밋 본문에 변경사항을 상세히 기술합니다.
- **Co-Authored-By는 포함하지 않습니다.**

## 4단계: git push

- 현재 브랜치를 원격에 push합니다.
- 원격 브랜치가 없으면 `-u` 플래그로 설정합니다.
- push 완료 후 커밋 해시를 출력합니다.

## 주의사항

- 각 단계 진행 전 사용자에게 내용을 보여주고 확인을 받습니다.
- 커밋 메시지에 Co-Authored-By를 넣지 않습니다.
- 민감한 파일(.env 등)은 절대 add하지 않습니다.
