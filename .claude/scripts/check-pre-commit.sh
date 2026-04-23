#!/usr/bin/env bash
# check-pre-commit.sh
# 커밋 전 프론트엔드 디자인 가이드 체크리스트를 검사하는 스크립트
#
# 동작:
#   1. 스테이징된 .ts/.tsx 파일 수집
#   2. scripts/rules/frontend-design-guide.checklist.js 실행
#   3. 모든 검사 통과(exit 0) 시까지 반복
#   4. 실패 시 Claude Code가 수정 → 재실행

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CLAUDE_DIR="$PROJECT_ROOT/.claude"
CHECKLIST_JS="$CLAUDE_DIR/scripts/rules/frontend-design-guide.checklist.js"
CHECKLIST_MD="$CLAUDE_DIR/docs/frontend-design-guide.checklist.md"
MAX_ITERATIONS=10
ITERATION=0

echo "==============================================="
echo " Frontend Design Guide Pre-Commit Check"
echo "==============================================="

# 스테이징된 ts/tsx 파일 확인
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$' || true)

if [ -z "$STAGED_FILES" ]; then
  echo "검사 대상 파일이 없습니다. 통과."
  exit 0
fi

echo ""
echo "검사 대상 파일:"
echo "$STAGED_FILES" | sed 's/^/  - /'
echo ""

# checklist.md 존재 확인
if [ ! -f "$CHECKLIST_MD" ]; then
  echo "체크리스트 문서를 찾을 수 없습니다: $CHECKLIST_MD"
  exit 1
fi

# checklist.js 존재 확인
if [ ! -f "$CHECKLIST_JS" ]; then
  echo "검사 JS 파일이 없습니다: $CHECKLIST_JS"
  echo "Claude Code가 checklist.md를 기반으로 생성해야 합니다."
  exit 1
fi

# 검사 루프
while [ $ITERATION -lt $MAX_ITERATIONS ]; do
  ITERATION=$((ITERATION + 1))
  echo ""
  echo "--- 검사 시도 #$ITERATION ---"

  node "$CHECKLIST_JS"
  RESULT=$?

  if [ $RESULT -eq 0 ]; then
    echo ""
    echo "==============================================="
    echo " 모든 체크리스트 항목 통과"
    echo "==============================================="
    exit 0
  fi

  echo ""
  echo "checklist 실행 결과가 0이 아닙니다. (exit code: $RESULT)"
  echo "Claude Code가 위반 항목을 수정해야 합니다."

  # 최대 반복 횟수 도달
  if [ $ITERATION -ge $MAX_ITERATIONS ]; then
    echo ""
    echo "최대 반복 횟수($MAX_ITERATIONS)에 도달했습니다."
    echo "수동 검토가 필요합니다."
    exit 1
  fi
done

exit 1
