import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ErrorPage = () => {
  const navigate = useNavigate();
  const handleClickBackButton = () => {
    navigate(-1); // 에러 페이지에서 뒤로가기 버튼을 클릭하면 navigate(-1) 함수가 호출되어야 한다
  };

  return (
    <div id="error-page">
      <h1>읔!</h1>
      <p>예상치 못한 에러가 발생했습니다.</p>
      <button onClick={handleClickBackButton}>뒤로 이동</button>
    </div>
  );
};

export default ErrorPage;
