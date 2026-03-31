---
name: branch-reset
description: 현재 feature 브랜치를 정리하고 dev를 최신화한 뒤 새 feature 브랜치를 생성합니다. 브랜치 전환, 브랜치 초기화, 새 작업 시작, 다음 기능 시작 등의 상황에서 사용합니다.
allowed-tools: Bash(git:*), AskUserQuestion
argument-hint: [새 기능 이름 (선택)]
---

# Branch Reset: 브랜치 정리 → dev 최신화 → 새 feature 브랜치 생성

현재 feature 브랜치에서의 작업을 마무리하고, 다음 작업을 위한 깨끗한 feature 브랜치를 준비합니다.

## 사전 확인

- `git status`로 커밋되지 않은 변경사항이 있는지 확인합니다.
- 커밋되지 않은 변경사항이 있으면 사용자에게 알리고 진행 여부를 확인합니다. 변경사항을 잃을 수 있기 때문입니다.
- 현재 브랜치가 `dev`나 `main`이면 삭제 단계를 건너뛰고 dev 최신화부터 진행합니다.

## 1단계: 현재 브랜치 정리

- 현재 브랜치 이름을 기록합니다.
- `git checkout dev`로 dev 브랜치로 이동합니다.
- 기록한 브랜치를 로컬에서 삭제합니다: `git branch -D <브랜치명>`
- 원격에도 해당 브랜치가 있으면 삭제합니다: `git push origin --delete <브랜치명>`
- 삭제 전 사용자에게 확인을 받습니다.

## 2단계: dev 브랜치 최신화

- `git pull origin dev`로 최신 상태를 가져옵니다.

## 3단계: 새 feature 브랜치 생성

- $ARGUMENTS에 기능 이름이 있으면 그것을 사용합니다.
- 없으면 사용자에게 새 기능 이름을 입력받습니다.
- `feature/<기능이름>` 형식으로 브랜치를 생성합니다: `git checkout -b feature/<기능이름>`
- 생성된 브랜치 정보를 출력합니다.

## 주의사항

- dev, main 브랜치는 절대 삭제하지 않습니다.
- 커밋되지 않은 변경사항이 있을 때는 반드시 사용자 확인 후 진행합니다.
- 각 단계의 결과를 사용자에게 보여줍니다.
