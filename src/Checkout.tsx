import styled from '@emotion/styled';
import {
  loadTossPayments,
  TossPaymentsWidgets,
} from '@tosspayments/tosspayments-sdk';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const customerKey = 'YnM8JTT4La7iNjrg7i2v7';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState({
    currency: 'KRW',
    value: 5000,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [isRender, setRender] = useState(false);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      // ------  결제위젯 초기화 ------
      const tossPayments = await loadTossPayments(
        import.meta.env.VITE_CLIENT_KEY
      );
      // 회원 결제
      const widgets = tossPayments.widgets({
        customerKey,
      });
      // 비회원 결제
      // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

      setWidgets(widgets);
      setReady(true);
    }

    fetchPaymentWidgets();
  }, [import.meta.env.VITE_CLIENT_KEY, customerKey]);

  // useEffect(() => {
  async function renderPaymentWidgets() {
    if (widgets == null) {
      return;
    }
    console.log('widgets', widgets);

    // ------ 주문의 결제 금액 설정 ------

    setRender(true);
    try {
      await widgets.setAmount(amount);
    } catch (error) {
      console.log('에러', error);
    }

    await Promise.all([
      // ------  결제 UI 렌더링 ------
      widgets.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'DEFAULT',
      }),
      // ------  이용약관 UI 렌더링 ------
      widgets.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      }),
    ]);
  }

  //   renderPaymentWidgets();
  // }, [widgets]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }

    widgets.setAmount(amount);
  }, [widgets, amount]);

  return (
    <Container>
      <ListBtn onClick={() => navigate('/paylist')}>결제 리스트</ListBtn>

      {isRender ? (
        <PayWrapper>
          {/* 결제 UI */}
          <div id='payment-method' />
          {/* 이용약관 UI */}
          <div id='agreement' />
          {/* 쿠폰 체크박스 */}
          <div>
            <div>
              <label htmlFor='coupon-box'>
                <input
                  id='coupon-box'
                  type='checkbox'
                  aria-checked='true'
                  disabled={!ready && amount.value > 2000}
                  onChange={(event) => {
                    event.target.checked
                      ? setAmount((prev) => {
                          const newAmount = {
                            ...prev,
                            value: prev.value - 2000,
                          };
                          return newAmount;
                        })
                      : setAmount((prev) => {
                          const newAmount = {
                            ...prev,
                            value: prev.value + 2000,
                          };
                          return newAmount;
                        });
                  }}
                />
                <span>2,000원 쿠폰 적용</span>
              </label>
            </div>
          </div>

          {/* 결제하기 버튼 */}
          <RequestPayBtn
            className='button'
            disabled={!ready}
            onClick={async () => {
              if (!widgets) return;

              const orderId = generateRandomString(20);

              axios.post('http://127.0.0.1:5000/preauth', {
                orderId,
                amount: amount.value,
                orderName: '테스트 상품',
                customerEmail: 'customer123@gmail.com',
              });
              try {
                await widgets.requestPayment({
                  orderId,
                  orderName: '테스트 상품',
                  successUrl: window.location.origin + '/loading',
                  failUrl: window.location.origin + '/fail',
                  customerEmail: 'customer123@gmail.com',
                  customerName: '김토스',
                  customerMobilePhone: '01012341234',
                });
              } catch (error) {
                console.error('결제 중 에러', error);
              }
            }}
          >
            결제하기
          </RequestPayBtn>
        </PayWrapper>
      ) : (
        <>
          <InputBox
            type='number'
            value={amount.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.preventDefault();

              setAmount((prev: { currency: string; value: number }) => {
                const newAmount = { ...prev, value: Number(e.target.value) };
                return newAmount;
              });
            }}
          />
          <RequestWidgetBtn onClick={renderPaymentWidgets}>
            결제
          </RequestWidgetBtn>
        </>
      )}
    </Container>
  );
};

const generateRandomString = (length: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const ListBtn = styled.button``;
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const InputBox = styled.input``;
const RequestWidgetBtn = styled.button``;
const RequestPayBtn = styled.button`
  align-self: center;
`;

const PayWrapper = styled.div`
  width: 600px;
  height: 800px;
  display: flex;
  flex-direction: column;

  /* align-items: center; */
`;

export default CheckoutPage;
