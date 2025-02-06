import path from 'path';

import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint({ exclude: ['/virtual:/**', 'node_modules/**'] })],
  test: {
    globals: true, // vitest 문법을 global로 사용할 수 있도록 설정: vitest에서 제공하는 API들을 별도의 설정없이 사용 가능
    environment: 'jsdom', // jsDOM 환경에서 실행
    // include: ['src/**/*.spec.jsx'], // 테스트 파일 경로 설정
    setupFiles: './src/utils/test/setupTests.js', // 설정 파일들을 setupTests.js에 등록
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});

/** jsdom
 *
 * 브라우저와 다르게 node.js 환경은 dom이 존재하지 않습니다. node에서 FE 결과물인 dom이 제대로 렌더링되는지 확인하기 위한 과정이 필요합니다
 * 테스트 하려는 컴포넌트가 jsdom에서 어떻게 렌더링 되는지 보고 싶다면 테스팅 라이브러리에서 제공하는 'screen.debug 함수를 사용해 dom 구조 확인이 가능합니다
 */
