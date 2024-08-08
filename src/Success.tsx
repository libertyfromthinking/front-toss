import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface PaymentData {
  orderId: string;
  amount: number;
  paymentKey: string;
}

const SuccessPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderId, amount, paymentKey } = state;

  useEffect(() => {
    if (orderId && amount && paymentKey) {
      const paymentData = {
        orderId,
        amount,
        paymentKey,
      };
      const storedPaymentData = localStorage.getItem('paymentDataList');
      const paymentDataList = storedPaymentData
        ? JSON.parse(storedPaymentData)
        : [];

      const isDuplicate = paymentDataList.some(
        (data: PaymentData) => data.paymentKey === paymentKey
      );

      // 중복된 데이터가 없을 경우에만 추가
      if (!isDuplicate) {
        paymentDataList.push(paymentData);
        localStorage.setItem(
          'paymentDataList',
          JSON.stringify(paymentDataList)
        );
        console.log('로컬 스토리지에 저장', paymentDataList);
      }
    }
  }, [orderId, amount, paymentKey]);

  return (
    <div className='result wrapper'>
      <div className='box_section'>
        <h2>결제 성공</h2>
        <p>{`주문번호: ${orderId}`}</p>
        <p>{`결제 금액: ${Number(amount).toLocaleString()}원`}</p>
        <p>{`paymentKey: ${paymentKey}`}</p>
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

export default SuccessPage;
