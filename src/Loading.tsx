import styled from '@emotion/styled';
import axios, { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoadingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const requestData = {
      orderId: searchParams.get('orderId'),
      amount: searchParams.get('amount'),
      paymentKey: searchParams.get('paymentKey'),
    };

    async function confirm() {
      try {
        const response = await axios.post(
          'http://127.0.0.1:5000/confirm',
          { ...requestData },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('response', response);
        navigate('/success', { state: { ...requestData } });
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{
          response: {
            data: {
              code: number;
              message: string;
            };
          };
        }>;
        console.log('검증 중 에러 ', error);
        console.log('axiosError?.response?.data', axiosError?.response?.data);
        navigate('/fail', {
          state: { error: axiosError?.response?.data },
        });
        return;
      }
    }

    confirm();
  }, []);

  return <Container>결제 진행 중................................</Container>;
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default LoadingPage;
