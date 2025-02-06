import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export default async component => {
  // userEvent: 사용자의 행동을 시뮬레이션하는 라이브러리
  // setup: userEvent를 사용하기 위한 설정
  const user = userEvent.setup();

  return {
    user,
    ...render(component),
  };
};
