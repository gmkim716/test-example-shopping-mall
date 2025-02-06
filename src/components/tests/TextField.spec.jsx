import { screen } from '@testing-library/react';
import React from 'react';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

beforeEach(() => {
  console.log('root - beforeAll');
}); // 최상단 루트에 있는 beforeEach는 모든 테스트에 적용
beforeAll(() => {
  console.log('root - beforeAll');
});

afterEach(() => {
  console.log('root - afterEach');
});
afterAll(() => {
  console.log('root - afterAll');
});

it('className prop으로 설정한 css class가 적용된다', async () => {
  // === AAA 패턴 === //
  // Arrange: 테스트를 위한 환경 만들기
  // className을 지닌 컴포넌트 렌더링

  // Act: 테스트할 동작을 설정
  // 렌더링에 대한 검증이기 때문에 이 단계는 생략
  // 클릭이나 메서드 호출, prop 변경 등등에 대한 작업이 여기에 해당

  // Assert: 올바른 동작이 실행되었는지 검증
  // 렌더링 후 DOM에 해당 class가 존재하는지 검증

  // render API를 호출: 테스트 환경의 jsDOM에 리액트 컴포넌트가 렌더링된 DOM 구조가 반영
  // jsDOM: Node.js에서 사용하기 위해 많은 웹 표준을 순수 자바스크립트로 구현
  await render(<TextField className="my-class" />);

  screen.debug(); // 컴포넌트가 jsdom에 어떤식으로 렌더링 되는지 확인 가능

  // vitest의 expect 함수를 사용해 기대 결과를 검증
  expect(screen.getByRole('textbox')).toHaveClass('my-class');
});

/** it & test & describe
 *
 * it과 test 함수는 기능적으로 동일, 다만 관용적으로 사용하는 방법에 차이가 있는다
 *  it('should ~~~~')
 *  test('if ~~~~~~~~')
 *
 * describe: 테스트를 묶어서 동작 가능
 */

describe('placeholder', () => {
  beforeEach(() => {
    console.log('describe-beforeEach');
  }); // 특정 describe 내부에서 선언된 경우 내부에서만 적용
  it('placeholder prop에 따라 placeholder가 변경된다', async () => {
    await render(<TextField placeholder="텍스트를 입력해 주세요." />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    // toBeInTheDocument: jsdom에서 사용하는 DOM에 있는 요소가 있는지 확인
    expect(textInput).toBeInTheDocument();
  });

  it('기본 placeholder prop에 따라 placeholder가 변경된다', async () => {
    await render(<TextField placeholder="상품명을 입력해 주세요." />);

    const textInput = screen.getByPlaceholderText('상품명을 입력해 주세요.');

    // toBeInTheDocument: jsdom에서 사용하는 DOM에 있는 요소가 있는지 확인
    expect(textInput).toBeInTheDocument();
  });

  it('텍스트를 입력하면 onChange prop으로 등록한 함수가 호출된다.', async () => {
    // 스파이 함수: 테스트 코드에서 특정 함수가 호출되었는지, 함수의 인자로 어떤 것이 넘어왔는지, 어떤 값을 반환하는 지 등을 저장
    // 콜백 함수나 이벤트 핸들러가 올바르게 호출되었는지 검증하고 싶을 때 사용
    const spy = vi.fn();

    const { user } = await render(<TextField onChange={spy} />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해주세요');
    await user.type(textInput, '테스트'); // userEvent를 사용해 텍스트 입력

    expect(spy).toHaveBeenCalled('test'); // toHaveBeenCalledWith: 함수가 특정 인자와 함께 호출되었는지 확인하는 matcher
  });

  it('포커스가 활성화되면 onFocus prop으로 등록한 함수가 호출된다.', async () => {
    const spy = vi.fn();
    const { user } = await render(<TextField onFocus={spy} />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해주세요');
    await user.click(textInput); // 인풋 요소를 클릭했을 때, 포커스 이동, 활성화

    expect(spy).toHaveBeenCalled(); // prop으로 등록한 함수가 호출되었는지 확인
  });

  it('포커스가 활성화되면 border 스타일이 추가된다.', async () => {
    const { user } = await render(<TextField />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    await user.click(textInput);

    expect(textInput).toHaveStyle({
      borderWidth: 2,
      borderColor: 'rgb(25, 118, 210)',
    });
  });
});
