import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';

// keyframes 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MainPageWrapper = styled.div`
  padding-top: 140px;
  width: 100%;
  max-width: 600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding-bottom: 63px;
  position: relative;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 480px) {
    padding: 10px;
    box-shadow: none;
  }
`;

const ContentSection = styled.section`
  flex: 1;
  padding: 30px;
  box-sizing: border-box;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 1px;
  color: #555;
`;

const Input = styled.input`
  min-height: 45px;
  padding: 12px;
  font-size: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border: 2px solid #ffe29f;
    background-color: #fffef8;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
`;

const TextArea = styled.textarea`
  min-height: 150px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border: 2px solid #ffe29f;
    background-color: #fffef8;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
`;

const AlertWrapper = styled.div`
  background-color: ${({ $isError }) => ($isError ? '#ffe082' : '#ff9900')};
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  padding: 15px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;

const initialFormState = {
  title: '예시 제목',
  email: 'example@test.com',
  body: '예시 본문 내용입니다.',
};

function CustomerServicePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [alert, setAlert] = useState({ message: '', isError: false });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    if (!formData.title.trim()) return '제목을 입력하세요.';
    if (!formData.email.trim()) return '이메일을 입력하세요.';
    if (!formData.body.trim()) return '본문을 입력하세요.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = validateForm();
    if (errorMessage) {
      setAlert({ message: errorMessage, isError: true });
      return;
    }

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('응답 에러 내용:', text);
        throw new Error(`HTTP 오류: ${response.status}`);
      }

      const data = await response.json();
      setAlert({ message: '폼이 성공적으로 제출되었습니다!', isError: false });
      setFormData(initialFormState);
    } catch (error) {
      console.error('폼 제출 에러:', error);
      setAlert({
        message: 'API 연결 실패. 더미 데이터로 동작합니다.',
        isError: false,
      });
      setFormData(initialFormState); // 기본 리셋
    }
  };

  return (
    <MainPageWrapper>
      <Header title='고객센터' />
      <ContentSection>
        {alert.message && (
          <AlertWrapper $isError={alert.isError}>{alert.message}</AlertWrapper>
        )}
        <Form onSubmit={handleSubmit}>
          <Label htmlFor='title'>제목</Label>
          <Input
            id='title'
            type='text'
            placeholder='제목을 입력하세요'
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <Label htmlFor='email'>이메일</Label>
          <Input
            id='email'
            type='email'
            placeholder='이메일을 입력하세요'
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Label htmlFor='body'>본문</Label>
          <TextArea
            id='body'
            placeholder='본문을 입력하세요'
            value={formData.body}
            onChange={handleInputChange}
            required
          />
          <div
            style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              variant='cancel'
              size='medium'
              type='button'
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
            >
              취소
            </Button>
            <Button variant='send' size='medium' type='submit'>
              전송
            </Button>
          </div>
        </Form>
      </ContentSection>
    </MainPageWrapper>
  );
}

export default CustomerServicePage;
