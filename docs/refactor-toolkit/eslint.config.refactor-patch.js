// eslint.config.refactor-patch.js
//
// 기존 eslint.config.js 의 export default 배열에 이 객체를 추가하세요.
// 또는 그대로 spread해서 합쳐도 됩니다:
//
//   import refactorPatch from './eslint.config.refactor-patch.js';
//   export default [...existing, ...refactorPatch];
//
// 필요한 플러그인 설치:
//   pnpm add -D eslint-plugin-sonarjs eslint-plugin-jsx-a11y eslint-plugin-react-compiler
//
// (react-compiler 플러그인은 Babel 플러그인과 함께 사용)

import sonarjs from 'eslint-plugin-sonarjs';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactCompiler from 'eslint-plugin-react-compiler';

export default [
  {
    name: 'refactor/complexity-metrics',
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      sonarjs,
    },
    rules: {
      // 기본 복잡도
      complexity: ['warn', { max: 10 }],
      'max-depth': ['warn', 3],
      'max-lines-per-function': [
        'warn',
        { max: 80, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
      'max-nested-callbacks': ['warn', 3],
      'max-params': ['warn', 5],

      // SonarJS
      'sonarjs/cognitive-complexity': ['warn', 15],
      'sonarjs/no-duplicate-string': ['warn', { threshold: 4 }],
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/no-redundant-boolean': 'warn',
      'sonarjs/no-useless-catch': 'warn',
    },
  },
  {
    name: 'refactor/a11y',
    files: ['src/**/*.{tsx,jsx}'],
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      // 우리 프로젝트 한정으로 강하게
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/label-has-associated-control': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
    },
  },
  {
    name: 'refactor/react-compiler',
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      // 컴파일러가 처리 불가능한 패턴을 잡아줌
      'react-compiler/react-compiler': 'error',
    },
  },
];
