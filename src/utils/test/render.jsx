import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { MemoryRouter } from 'react-router-dom';

export default async (component, options = {}) => {
  const { routerProps } = options;
  const user = userEvent.setup();

  // 쿼리 클라이언트 생성
  // https://tanstack.com/query/v4/docs/react/guides/testing
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // ✅ turns retries off: 잘못된 호출에 대해
        // tanstack query가 3번의 시도를 진행
        // 그러나 시간 초과 에러가 발생하면 제대로된 에러 피드백을 받지 못할 수 있기 때문에 retry를 false로 설정
        retry: false,
      },
    },
    // 단순 로그, 경고는 남기되 에러메시지는 출력되지 않도록 설정
    logger: {
      log: console.log,
      warn: console.warn,
      // ✅ no more errors on the console for tests
      error: process.env.NODE_ENV === 'test' ? () => {} : console.error,
    },
  });

  // queryClientProvider로 감싸주기
  return {
    user,
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter {...routerProps}>{component}</MemoryRouter>
        <Toaster />
      </QueryClientProvider>,
    ),
  };
};
