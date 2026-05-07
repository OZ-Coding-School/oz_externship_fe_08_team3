/**
 * frontend-design-guide.checklist.js
 *
 * 토스 프론트엔드 가이드라인 체크리스트 (docs/frontend-design-guide.checklist.md 기반)
 *
 * 사용법:
 *   1. Claude Code가 스테이징된 .ts/.tsx 파일을 읽고 각 항목을 판정
 *   2. 판정 결과를 아래 checklist 배열의 status 필드에 기록
 *      - "O"   : 통과
 *      - "X"   : 위반 (violations 배열에 상세 기록)
 *      - "N/A" : 해당 패턴이 파일에 존재하지 않음 (통과로 간주)
 *   3. `node scripts/rules/frontend-design-guide.checklist.js` 로 실행
 *      - 모두 O/N/A → exit 0
 *      - 하나라도 X → exit 1
 */

const checklist = [
  // ─── 1. Readability (가독성) ──────────────────────────────
  {
    id: "R-01",
    category: "Readability",
    name: "매직 넘버 명명",
    description: "의미 있는 숫자 리터럴이 명명된 상수로 추출되어 있는가?",
    // QnaListPage: PAGE_SIZE=10, SEARCH_DEBOUNCE_MS=300 상수 추출됨
    // CSS 픽셀값(944px, 211px, 472px 등)은 Figma 디자인 스펙 기반 레이아웃 값으로 허용
    // Pagination: maxVisible=5 상수 추출됨
    status: "O",
    violations: [],
  },
  {
    id: "R-02",
    category: "Readability",
    name: "구현 세부사항 추상화 (인증/권한)",
    description: "인증 체크, 권한 검사 등 공통 로직이 래퍼/가드 컴포넌트로 분리되어 있는가?",
    // Header: useAuthStore 사용하여 인증 상태 확인 — 기존 패턴 유지
    // 이번 변경에서 인증/권한 로직 신규 추가 없음
    status: "N/A",
    violations: [],
  },
  {
    id: "R-03",
    category: "Readability",
    name: "구현 세부사항 추상화 (인터랙션)",
    description: "다이얼로그/오버레이 등 복잡한 인터랙션이 전용 컴포넌트로 추출되어 있는가?",
    // SortPopover: QnaListPage 내 별도 컴포넌트로 분리됨
    // CategoryFilter: 전용 컴포넌트로 분리, Modal 공용 컴포넌트 활용
    status: "O",
    violations: [],
  },
  {
    id: "R-04",
    category: "Readability",
    name: "조건부 렌더링 분리",
    description: "역할/상태에 따라 크게 다른 UI/로직이 별도 컴포넌트로 분리되어 있는가?",
    // QuestionCard: 썸네일 유무에 따른 조건부 렌더링 — 같은 컴포넌트 내 단순 분기
    // QnaListPage: isLoading/isError/data 상태별 분기 — 적절한 단순 분기
    status: "O",
    violations: [],
  },
  {
    id: "R-05",
    category: "Readability",
    name: "복잡한 삼항 연산자 단순화",
    description: "중첩 삼항 연산자가 if/else 또는 IIFE로 대체되어 있는가?",
    // 중첩 삼항 연산자 없음. className 조인에 단일 삼항만 사용
    status: "O",
    violations: [],
  },
  {
    id: "R-06",
    category: "Readability",
    name: "시선 이동 감소 (Colocation)",
    description: "단일 사용처에서만 쓰이는 단순 로직이 사용 위치 근처에 배치되어 있는가?",
    // SORT_LABEL, SORT_OPTIONS, PAGE_SIZE 등 QnaListPage 파일 상단에 정의
    // SortPopover 컴포넌트가 QnaListPage 내에 같이 정의됨 (단일 사용처)
    // NAV_BTN 상수가 Pagination 파일 내 정의
    status: "O",
    violations: [],
  },
  {
    id: "R-07",
    category: "Readability",
    name: "복잡한 조건에 이름 붙이기",
    description: "2개 이상 조합된 boolean 표현식이 의미 있는 변수명으로 추출되어 있는가?",
    // QuestionCard: isAnswered = question.answer_count > 0
    // QnaListPage: hasFilter = categoryId != null
    // CategoryFilter: canApply = largeCategoryId !== ''
    status: "O",
    violations: [],
  },

  // ─── 2. Predictability (예측 가능성) ──────────────────────
  {
    id: "P-01",
    category: "Predictability",
    name: "API 훅 반환 타입 표준화",
    description: "유사한 API 훅들이 일관된 반환 타입(UseQueryResult 등)을 사용하는가?",
    // 이번 변경에서 API 훅 신규/변경 없음
    status: "N/A",
    violations: [],
  },
  {
    id: "P-02",
    category: "Predictability",
    name: "검증 함수 반환 타입 표준화",
    description: "검증 함수들이 일관된 Discriminated Union 타입을 반환하는가?",
    // 스테이징된 파일에 검증 함수 없음
    status: "N/A",
    violations: [],
  },
  {
    id: "P-03",
    category: "Predictability",
    name: "숨겨진 사이드 이펙트 제거",
    description: "함수가 이름에 드러나지 않은 사이드 이펙트(로깅, 분석 등)를 수행하지 않는가?",
    // handleTabChange, handlePageChange, updateParam 등 이름에 드러난 동작만 수행
    status: "O",
    violations: [],
  },
  {
    id: "P-04",
    category: "Predictability",
    name: "고유하고 설명적인 네이밍",
    description: "표준 라이브러리 래퍼가 원본과 구분되는 고유한 이름을 가지는가?",
    // 표준 라이브러리 래퍼 없음
    status: "N/A",
    violations: [],
  },

  // ─── 3. Cohesion (응집도) ─────────────────────────────────
  {
    id: "C-01",
    category: "Cohesion",
    name: "폼 응집도 선택",
    description: "폼 검증이 용도에 맞게 필드 단위 또는 폼 단위로 일관되게 선택되어 있는가?",
    // CategoryFilter: canApply 단일 조건 (대분류 선택 여부) — 적절
    status: "O",
    violations: [],
  },
  {
    id: "C-02",
    category: "Cohesion",
    name: "도메인별 디렉토리 구조",
    description: "기능/도메인 관련 코드가 도메인 폴더에 묶여 있는가?",
    // QuestionCard, CategoryFilter → src/components/qna/
    // 카테고리/질문 핸들러 → src/features/qna/
    // 공용 Modal, Pagination → src/components/common/
    status: "O",
    violations: [],
  },
  {
    id: "C-03",
    category: "Cohesion",
    name: "상수와 로직의 근접성",
    description: "상수가 사용 로직과 가까운 위치에 정의되어 있거나 이름으로 용도가 명확한가?",
    // SORT_LABEL, SORT_OPTIONS → QnaListPage 파일 상단, 사용처와 근접
    // NAV_BTN → Pagination 파일 내 정의
    status: "O",
    violations: [],
  },

  // ─── 4. Coupling (결합도) ─────────────────────────────────
  {
    id: "CP-01",
    category: "Coupling",
    name: "성급한 추상화 지양",
    description: "단순히 비슷하다는 이유로 섣불리 공통 훅/함수로 추출되지 않았는가?",
    // SortPopover: QnaListPage 전용 — 단일 사용처이므로 파일 내 정의 적절
    // CategoryFilter: onHandle 콜백으로 부모와 소통 — useCategorySelector 훅 재활용
    status: "O",
    violations: [],
  },
  {
    id: "CP-02",
    category: "Coupling",
    name: "상태 관리 범위 축소",
    description: "여러 관심사가 하나의 훅/컨텍스트에 묶이지 않고 분리되어 있는가?",
    // QnaListPage: URL params(searchParams), 입력값(inputValue), 모달(showCategoryModal), 필터핸들(filterHandle) 각각 독립 state
    // SortPopover: open, focusIndex 독립 state
    status: "O",
    violations: [],
  },
  {
    id: "CP-03",
    category: "Coupling",
    name: "Props Drilling 제거",
    description: "3단계 이상 props 전달이 컴포지션(children)으로 대체되어 있는가?",
    // CategoryFilter → QnaListPage: 1단계 props 전달, drilling 없음
    status: "N/A",
    violations: [],
  },
];

// ─── 실행부 ─────────────────────────────────────────────────
const COLOR = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

function printResults() {
  const byCategory = checklist.reduce((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});

  console.log("");
  console.log(`${COLOR.bold}Frontend Design Guide Checklist Results${COLOR.reset}`);
  console.log("─".repeat(60));

  for (const [category, items] of Object.entries(byCategory)) {
    console.log(`\n${COLOR.bold}[${category}]${COLOR.reset}`);
    for (const item of items) {
      const icon =
        item.status === "O" ? `${COLOR.green}✓${COLOR.reset}` :
        item.status === "X" ? `${COLOR.red}✗${COLOR.reset}` :
        item.status === "N/A" ? `${COLOR.gray}-${COLOR.reset}` :
        `${COLOR.yellow}?${COLOR.reset}`;
      console.log(`  ${icon} ${item.id} ${item.name}`);

      if (item.status === "X" && item.violations.length > 0) {
        for (const v of item.violations) {
          console.log(`      ${COLOR.red}→ ${v.file}:${v.line}${COLOR.reset} ${v.detail}`);
          if (v.suggestion) {
            console.log(`        ${COLOR.gray}제안: ${v.suggestion}${COLOR.reset}`);
          }
        }
      }
    }
  }

  const total = checklist.length;
  const passed = checklist.filter((i) => i.status === "O").length;
  const failed = checklist.filter((i) => i.status === "X").length;
  const na = checklist.filter((i) => i.status === "N/A").length;
  const pending = checklist.filter((i) => i.status === "PENDING").length;

  console.log("\n" + "─".repeat(60));
  console.log(
    `${COLOR.bold}요약:${COLOR.reset} ` +
    `${COLOR.green}통과 ${passed}${COLOR.reset} / ` +
    `${COLOR.red}위반 ${failed}${COLOR.reset} / ` +
    `${COLOR.gray}해당없음 ${na}${COLOR.reset} / ` +
    `${COLOR.yellow}미검사 ${pending}${COLOR.reset} (총 ${total})`
  );
  console.log("");
}

function resetAll() {
  for (const item of checklist) {
    item.status = "PENDING";
    item.violations = [];
  }
}

function run() {
  printResults();

  const hasFailed = checklist.some((i) => i.status === "X");
  const hasPending = checklist.some((i) => i.status === "PENDING");

  if (hasPending) {
    console.error(`${COLOR.yellow}⚠ 검사가 완료되지 않은 항목이 있습니다. Claude Code가 모든 항목을 판정해야 합니다.${COLOR.reset}`);
    process.exit(1);
  }

  if (hasFailed) {
    console.error(`${COLOR.red}✗ 검사 실패: 위반 항목을 수정해야 합니다.${COLOR.reset}`);
    process.exit(1);
  }

  console.log(`${COLOR.green}✓ 모든 체크리스트 항목을 통과했습니다.${COLOR.reset}`);
  process.exit(0);
}

// Node 직접 실행 시
run();

// export (필요 시 다른 스크립트에서 재사용)
module.exports = { checklist };
