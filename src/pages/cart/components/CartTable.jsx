import { Divider } from '@mui/material';
import React from 'react';

import PageTitle from '@/pages/cart/components/PageTitle';
import PriceSummary from '@/pages/cart/components/PriceSummary';
import ProductInfoTable from '@/pages/cart/components/ProductInfoTable';

// ProductINfoTable, PriceSummary로 나눠서 통합 테스트를 작성합니다
// pageTitle, divider는 단순하 UI 렌더링이기 때문에 테스트를 작성하지 않습니다
// ProductInfoTable, PriceSummary로 나누어 통합 테스트를 작성합니다 -> 장바구니 state를 사용해서 데이터를 렌더링합니다

// CartTable 통합 테스트: 큰 범위의 통합 테스트는 모킹해야 하는 정보가 많아지며 변경에도 깨지기 쉽습니다, 그렇기 때문에 ProductInfoTable, PriceSummary로 나누어 테스트를 작성합니다

// ProductInfoTable, PriceSummary은 각각 별도로 zustand store에서 필요한 state와 action을 가져옵니다
//  독립적으로 분리하면 통합 테스트로 필요한 비즈니스 로직을 검증하기 용이하기 때문입니다
const CartTable = () => {
  return (
    <>
      <PageTitle />
      <ProductInfoTable />
      <Divider sx={{ padding: 2 }} />
      <PriceSummary />
    </>
  );
};

export default CartTable;
