// msw의 rest 모듈을 활용해 모킹하고 싶은 경로와 REST API 규격에 맞는 메서드를 정의하고, 응답을 설정합니다
import { rest } from 'msw';

import response from '@/__mocks__/response';
import { apiRoutes } from '@/apiRoutes';

const API_DOMAIN = 'http://localhost:3000';

// handlers: 프론트엔드 개발 환경에서 실제 API를 대신하는 가짜 API 서버의 역할을 하는 파일입니다
export const handlers = [
  // 여러 개의 EndPoint에 대한 모킹 GET 요청 핸들러를 한번에 생성합니다

  // apiRoutes들을 배열에 담은 객체가 생성되었을 때, ...(스프래드 연산자)로 각 요소를 꺼내어 map을 돌리는 진행 흐름
  ...[
    apiRoutes.users,
    apiRoutes.product,
    apiRoutes.categories,
    apiRoutes.couponList,
  ].map(path =>
    // msw를 사용해 가짜 API 응답을 만듭니다
    // GET 요청을 처리하는 핸들러를 생성합니다. 요청을 처리하면 상태코드(200)와 미리 준비된 응답 데이터를 반환합니다
    // _: request 객체를 뜻하는 데 사용되지 않아서 _로 표시, res: 응답을 만드는 함수, ctx: 상태 코드나 응답 형식을 지정하는 컨텍스트 객체
    rest.get(`${API_DOMAIN}${path}`, (_, res, ctx) =>
      res(ctx.status(200), ctx.json(response[path])),
    ),
  ),

  // 페이지네이션이 적용된 상품 목록을 가져오는 API를 모킹합니다
  rest.get(`${API_DOMAIN}${apiRoutes.products}`, (req, res, ctx) => {
    const data = response[apiRoutes.products];
    const offset = Number(req.url.searchParams.get('offset')); // 시작 위치
    const limit = Number(req.url.searchParams.get('limit')); // 가져올 개수

    // offset ~ offset+limit 까지의 상품을 선택합니다
    const products = data.products.filter(
      (_, index) => index >= offset && index < offset + limit,
    );

    // 필터링된 상품목록과 현재가 마지막 페이지인지 여부를 함께 반환합니다
    return res(
      ctx.status(200),
      ctx.json({ products, lastPage: data.products.length <= offset + limit }),
    );
  }),

  // 프로필 조회 API
  rest.get(`${API_DOMAIN}${apiRoutes.profile}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(null));
  }),

  // 사용자 생성 API
  rest.post(`${API_DOMAIN}${apiRoutes.users}`, (req, res, ctx) => {
    if (req.body.name === 'FAIL') {
      return res(ctx.status(500));
    }

    return res(ctx.status(200));
  }),

  // 로그인 API
  rest.post(`${API_DOMAIN}${apiRoutes.login}`, (req, res, ctx) => {
    if (req.body.email === 'FAIL@gmail.com') {
      return res(ctx.status(401));
    }

    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'access_token',
      }),
    );
  }),

  // 로그 API
  rest.post(`${API_DOMAIN}${apiRoutes.log}`, (_, res, ctx) => {
    return res(ctx.status(200));
  }),
];
