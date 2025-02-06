import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import { handlers } from '@/__mocks__/handlers';

/* msw */
export const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();

  // 모킹된 모의 객체 호출에 대한 히스토리를 초기화합니다
  // 모킹된 모듈의 구현을 초기화하지는 않습니다 -> 모킹된 상태로 유지
  // -> 모킹 모듈 기반으로 작성한 테스트가 올바르게 실행됩니다
  // 반면, 모킹 히스토리가 계속 쌓입니다(호출 횟수나 인자가 계속 변경) -> 다른 테스트에 영향을 줄 수 있습니다
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks(); // 모킹 모듈에 대한 모든 구현을 초기화합니다
  server.close();
});

vi.mock('zustand');

// https://github.com/vitest-dev/vitest/issues/821
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
