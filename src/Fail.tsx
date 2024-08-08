import { useLocation, useNavigate } from 'react-router-dom';

const FailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { error } = state;
  console.log('실패 페이지에서 에러', error);

  return (
    <div className='result wrapper'>
      <div className='box_section'>
        <h2>결제 실패</h2>
        <p>{`에러 코드: ${error.code}`}</p>
        <p>{`실패 사유: ${error.message}`}</p>
      </div>
      <button
        onClick={() => {
          navigate('/');
        }}
      >
        홈으로
      </button>
    </div>
  );
};

export default FailPage;
