import { screen, within } from '@testing-library/react';
import React from 'react';

import data from '@/__mocks__/response/products.json';
import ProductList from '@/pages/home/components/ProductList';
import { formatPrice } from '@/utils/formatter';
import {
  mockUseUserStore,
  mockUseCartStore,
} from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';

const PRODUCT_PAGE_LIMIT = 5;

const navigateFn = vi.fn();

// react-router-dom 모킹
vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => navigateFn,
    useLocation: () => ({
      state: {
        prevPath: 'prevPath',
      },
    }),
  };
});

describe('상품 목록 렌더링 테스트', () => {
  it('로딩이 완료된 경우 상품 리스트가 제대로 모두 노출된다', async () => {
    // 1. 컴포넌트 렌더링
    await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    // 2. 쿼리 적용
    // data-test-id가 product-card인 모든 요소를 찾아서 배열로 반환
    // screen: document.body를 자동으로 쿼리합니다
    // findBy 쿼리: 1초동안 50ms마다 요소가 있는 지 조회합니다
    const productCards = await screen.findAllByTestId('product-card');

    expect(productCards).toHaveLength(PRODUCT_PAGE_LIMIT);

    productCards.forEach((el, index) => {
      const productCard = within(el); // within: RTL에서 특정 요소 내부에서만 쿼리를 실행하고 싶을 때 사용하는 메서드
      const product = data.products[index];

      expect(productCard.getByText(product.title)).toBeInTheDocument(); // toBeInTheDocument: DOM에 존재하는지 검증
      expect(productCard.getByText(product.category.name)).toBeInTheDocument();
      expect(
        productCard.getByText(formatPrice(product.price)),
      ).toBeInTheDocument();
      expect(
        productCard.getByRole('button', { name: '장바구니' }), // 쉼표 뒤에 공백 추가
      ).toBeInTheDocument();
      expect(
        productCard.getByRole('button', { name: '구매' }),
      ).toBeInTheDocument();
    });
  });

  it('보여줄 상품 리스트가 더 있는 경우 show more 버튼이 노출되며, 버튼을 누르면 상품 리스트를 더 가져온다.', async () => {
    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    // show more 버튼의 노출 여부를 정확하게 판단하기 위해
    // findBy 쿼리를 사용해 먼저 첫 페이지에 해당하는 상품 목록이 렌더링되는 것을 기다려야 합니다
    await screen.findAllByTestId('product-card');

    // show more 버튼이 잘 나타나는지 단언
    expect(
      screen.getByRole('button', { name: 'Show more' }),
    ).toBeInTheDocument();

    // show more 버튼을 클릭했을 때, 5개의 데이터를 더 가져오는지 확인
    const moreBtn = screen.getByRole('button', { name: 'Show more' });
    await user.click(moreBtn);

    expect(await screen.findAllByTestId('product-card')).toHaveLength(
      PRODUCT_PAGE_LIMIT * 2, // 5 + 5(show more) = 10
    );
  });

  it('보여줄 상품 리스트가 없는 경우 show more 버튼이 노출되지 않는다.', async () => {
    // 모킹 데이터 20개보다 많은 수인 50으로 limit을 설정: 보여줄 상품 리스트가 없는 경우 테스트가 가능
    await render(<ProductList limit={50} />);

    // findBy 쿼리를 사용해서 먼저 첫 페이지에 해당하는 상품 목록이 렌더링 되는 것을 기다려야 함
    await screen.findAllByTestId('product-card');

    // Show more 버튼이 DOM에 존재하지 않는 지 단언
    expect(screen.queryByText('Show more')).not.toBeInTheDocument();
  });

  describe('로그인 상태일 경우', () => {
    // 로그인 된 상태를 가정
    beforeEach(() => {
      mockUseUserStore({ isLogin: true, user: { id: 10 } });
    });

    it('구매 버튼 클릭시 addCartItem 메서드가 호출되며, "/cart" 경로로 navigate 함수가 호출된다.', async () => {
      // ProductList 컴포넌트에서는 실제 장바구니에 상품이 추가되었는지 알 수 없습니다
      // addCartItemAction을 spy함수로 대체해서 호출 여부를 검증하기 위해 모킹 작업이 필요합니다
      const addCartItemFn = vi.fn();
      mockUseCartStore({ addCartItem: addCartItemFn });

      // 모킹이 완료되었으므로 상품의 구매버튼 클릭을 위해 API에서 데이터를 가져와 모두 렌더링 될 때까지 기다립니다
      const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

      await screen.findAllByTestId('product-card');

      // 첫번째 상품을 대상으로 검증한다.
      const productIndex = 0;
      await user.click(
        screen.getAllByRole('button', { name: '구매' })[productIndex],
      );

      // addCartItemFn이 원하는 인자와 한번 호출되었는지 매처와 함께 단언합니다
      // addCartItemFn 함수가 처음 호출될 때, data.products[productIndex] 상품을 10과 1이라는 추가 파라미터와 함께 호출했는가?
      expect(addCartItemFn).toHaveBeenNthCalledWith(
        1,
        data.products[productIndex],
        10,
        1,
      );
      // 장바구니 페이지로 이동하는지 검증
      expect(navigateFn).toHaveBeenNthCalledWith(1, '/cart');
    });

    it('장바구니 버튼 클릭시 "장바구니 추가 완료!" toast를 노출하며, addCartItem 메서드가 호출된다.', async () => {
      // 장바구니 추가에 대한 액션을 모킹
      const addCartItemFn = vi.fn();
      mockUseCartStore({ addCartItem: addCartItemFn });

      // 상품 목록이 모두 정상적으로 렌더링 될 때까지 기다림
      const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

      await screen.findAllByTestId('product-card');

      // 첫번째 상품을 대상으로 검증한다.
      const productIndex = 0;
      const product = data.products[productIndex];
      await user.click(
        screen.getAllByRole('button', { name: '장바구니' })[productIndex],
      );

      expect(addCartItemFn).toHaveBeenNthCalledWith(1, product, 10, 1);
      expect(
        screen.getByText(`${product.title} 장바구니 추가 완료!`),
      ).toBeInTheDocument();
    });
  });

  describe('로그인이 되어 있지 않은 경우', () => {
    it('구매 버튼 클릭시 "/login" 경로로 navigate 함수가 호출된다.', async () => {
      const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

      await screen.findAllByTestId('product-card');

      // 첫번째 상품을 대상으로 검증한다.
      const productIndex = 0;
      await user.click(
        screen.getAllByRole('button', { name: '구매' })[productIndex],
      );

      expect(navigateFn).toHaveBeenNthCalledWith(1, '/login');
    });

    it('장바구니 버튼 클릭시 "/login" 경로로 navigate 함수가 호출된다.', async () => {
      const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

      await screen.findAllByTestId('product-card');

      // 첫번째 상품을 대상으로 검증한다.
      const productIndex = 0;
      await user.click(
        screen.getAllByRole('button', { name: '장바구니' })[productIndex],
      );

      expect(navigateFn).toHaveBeenNthCalledWith(1, '/login');
    });
  });

  it('상품 클릭시 "/product/:productId" 경로로 navigate 함수가 호출된다.', async () => {
    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    const [firstProduct] = await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    await user.click(firstProduct);

    expect(navigateFn).toHaveBeenNthCalledWith(1, '/product/6');
  });
});
