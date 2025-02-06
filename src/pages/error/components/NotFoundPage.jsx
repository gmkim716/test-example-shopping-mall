import React from 'react';
import { useNavigate } from 'react-router-dom';

import { pageRoutes } from '@/apiRoutes';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const handleClickNavigateHomeButton = () => {
    // NotFoundPage에서 Home으로 이동하는 버튼을 클릭하면 navigate(pageRoutes.main, { replace: true }) 함수가 호출되어야 한다
    // ErrorPage와 달리 replace 인자가 있다
    navigate(pageRoutes.main, { replace: true });
  };

  return (
    <div id="error-page">
      <h1>404</h1>
      <p>페이지 경로가 잘못 되었습니다!</p>
      <button onClick={handleClickNavigateHomeButton}>Home으로 이동</button>
    </div>
  );
};

export default NotFoundPage;
