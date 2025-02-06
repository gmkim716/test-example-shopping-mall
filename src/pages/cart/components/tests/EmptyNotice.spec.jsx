import { screen } from '@testing-library/react';
import React from 'react';

import EmptyNotice from '@/pages/cart/components/EmptyNotice';
import render from '@/utils/test/render';

// 실제 모듈을 모킹한 모듈로 대체해서 테스트를 실행한다
// useNavigate 훅으로 반환받은 navigate 함수가 올바르게 호출되었는가 -> 스파이 함수
const navigateFn = vi.fn();

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom'); // importActual: 실제 모듈을 가져옵니다.

  return { ...original, useNavigate: () => navigateFn }; // useNavigate를 호출하면 navigateFn을 반환합니다.
});

it('"홈으로 가기" 링크를 클릭할경우 "/"경로로 navigate 호출된다', async () => {
  const { user } = await render(<EmptyNotice />);

  await user.click(screen.getByText('홈으로 가기'));

  expect(navigateFn).toHaveBeenNthCalledWith(1, '/'); // toHaveBeenNthCalledWith: n번째 호출시에 전달된 인수를 검사합니다.
});
