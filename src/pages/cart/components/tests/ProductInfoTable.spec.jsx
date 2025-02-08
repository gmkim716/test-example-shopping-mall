import { screen, within } from '@testing-library/react';
import React from 'react';

import ProductInfoTable from '@/pages/cart/components/ProductInfoTable';
import {
  mockUseCartStore,
  mockUseUserStore,
} from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';

// 사용자 정보와 장바구니에 담긴 카트 리스트를 mock 데이터로 설정할 수 있습니다
beforeEach(() => {
  mockUseUserStore({ user: { id: 10 } });
  mockUseCartStore({
    cart: {
      6: {
        id: 6,
        title: 'Handmade Cotton Fish',
        price: 809,
        description:
          'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
        images: [
          'https://source.unsplash.com/80x80/?fish',
          'https://source.unsplash.com/80x80/?fish',
          'https://source.unsplash.com/80x80/?fish',
        ],
        count: 3,
      },
      7: {
        id: 7,
        title: 'Intelligent Rubber Computer',
        price: 743,
        description:
          'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
        images: [
          'https://source.unsplash.com/80x80/?computer',
          'https://source.unsplash.com/80x80/?computer',
          'https://source.unsplash.com/80x80/?computer',
        ],
        count: 2,
      },
    },
  });
});

it('장바구니에 포함된 아이템들의 이름, 수량, 합계가 제대로 노출된다', async () => {
  await render(<ProductInfoTable />);

  const [firstItem, secondItem] = screen.getAllByRole('row');

  // mock으로 조회한 데이터를 사용하고 싶을 때는 within을 사용합니다
  expect(
    within(firstItem).getByText('Handmade Cotton Fish'),
  ).toBeInTheDocument();
  expect(within(firstItem).getByRole('textbox')).toHaveValue('3');
  expect(within(firstItem).getByText('$2,427.00')).toBeInTheDocument();

  expect(
    within(secondItem).getByText('Intelligent Rubber Computer'),
  ).toBeInTheDocument();
  expect(within(secondItem).getByRole('textbox')).toHaveValue('2');
  expect(within(secondItem).getByText('$1,486.00')).toBeInTheDocument();
});

it('특정 아이템의 수량이 변경되었을 때 값이 재계산되어 올바르게 업데이트 된다', async () => {
  const { user } = await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');

  const input = within(firstItem).getByRole('textbox');

  await user.clear(input);
  await user.type(input, '5');

  expect(screen.getByText('$4,045.00')).toBeInTheDocument();
});

it('특정 아이템의 수량이 1000개로 변경될 경우 "최대 999개 까지 가능합니다!"라고 경고 문구가 노출된다', async () => {
  // alert 함수를 대체할 spy 함수를 만들어서 호출 여부를 검증할 수 있습니다
  const alertSpy = vi.fn();

  // window.alert를 대체: vi에서 제공하는 stubGlobal 사용
  vi.stubGlobal('alert', alertSpy);

  const { user } = await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');

  const input = within(firstItem).getByRole('textbox');

  await user.clear(input);
  await user.type(input, '1000');

  expect(alertSpy).toHaveBeenCalledWith('최대 999개 까지 가능합니다!');
});

it('특정 아이템의 삭제 버튼을 클릭할 경우 해당 아이템이 사라진다', async () => {
  const { user } = await render(<ProductInfoTable />);
  const [, secondItem] = screen.getAllByRole('row');

  const deleteButton = within(secondItem).getByRole('button');

  expect(screen.getByText('Intelligent Rubber Computer')).toBeInTheDocument();
  await user.click(deleteButton);

  // getByText가 아니라 queryByText를 사용해야 사라진 요소를 검증할 수 있습니다
  // queryByText: 요소가 존재하지 않아도 에러 X
  // 일반적으로는 getByText를 사용하되 삭제된 요소에 대해서 query~를 사용합니다
  expect(
    screen.queryByText('Intelligent Rubber Computer'),
  ).not.toBeInTheDocument();
});
