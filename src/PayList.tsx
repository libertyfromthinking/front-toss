import styled from '@emotion/styled';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';
import uuid from 'react-uuid';
import { useEffect, useState } from 'react';

interface PaymentData {
  orderId: string;
  amount: number;
  paymentKey: string;
}

const PayListPage = () => {
  const navigate = useNavigate();
  const [uuidKey, setUuidKey] = useState('');
  const [encryptKey, setEnchryptKey] = useState('');
  const [paidList, setPaidList] = useState([]);
  const [isCancelModal, setCancelModal] = useState(false);
  const [cancelAmount, setCancelAmount] = useState(0);
  const [cancelKey, setCancelKey] = useState('');

  useEffect(() => {
    setUuidKey(uuid());

    const payList: string = localStorage.getItem('paymentDataList') || '[]';
    setEnchryptKey(
      'Basic ' +
        Buffer.from(import.meta.env.VITE_SECRET_KEY + ':').toString('base64')
    );
    const parsedList = JSON.parse(payList) || [];
    setPaidList(parsedList);
  }, [paidList]);

  const handleCancel = async (paymentKey: string) => {
    try {
      const response = await axios.post(
        `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
        { cancelReason: '고객이 취소를 원함', cancelAmount },
        {
          headers: {
            Authorization: encryptKey,
            'Content-Type': 'application/json',
            'Idempotency-Key': uuidKey,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        const updatedList = paidList.filter(
          (data: PaymentData) => data.paymentKey !== paymentKey
        );

        localStorage.setItem('paymentDataList', JSON.stringify(updatedList));
        setPaidList(updatedList);

        alert('취소 성공!!');
      }
    } catch (error) {
      console.error('취소실패', error);
      alert('취소실패!!!');
    }
  };
  return isCancelModal ? (
    <ModalContainer>
      <CancelInput
        defaultValue={cancelAmount}
        value={cancelAmount}
        onChange={(e) => setCancelAmount(Number(e.target.value))}
      />
      <SubmitBtn onClick={handleCancel.bind(null, cancelKey)}>확인</SubmitBtn>
      <SubmitBtn onClick={() => setCancelModal(false)}>취소</SubmitBtn>
    </ModalContainer>
  ) : (
    <Container>
      {paidList.length > 0 ? (
        paidList.map((item: PaymentData) => {
          return (
            <ItemWrapper>
              <PayItem>
                orderId: {item.orderId} amount: {item.amount} paymentKey:{' '}
                {item.paymentKey}
              </PayItem>
              <CancelBtn
                onClick={() => {
                  setCancelModal(true);
                  setCancelAmount(item.amount);
                  setCancelKey(item.paymentKey);
                }}
              >
                취소하기
              </CancelBtn>
            </ItemWrapper>
          );
        })
      ) : (
        <div>값이 없습니다</div>
      )}
      <button
        onClick={() => {
          navigate('/');
        }}
      >
        홈으로
      </button>
    </Container>
  );
};

const CancelInput = styled.input`
  height: 30%;
`;
const SubmitBtn = styled.button``;

const ModalContainer = styled.div`
  width: 380px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  position: relative;
  left: 50%;
  top: 20%;
  gap: 10px;
`;
const Container = styled.div`
  margin-top: 10%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: flex-start;
  align-items: center;
`;
const PayItem = styled.div``;
const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;
const CancelBtn = styled.button``;
export default PayListPage;
