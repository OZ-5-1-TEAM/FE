import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Button from '../components/Button';

const PageWrapper = styled.div`
  padding-top: 90px !important;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
  width: 100%;
  padding-bottom: 63px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledLabel = styled.label`
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  user-select: none;
  cursor: pointer;
`;

const Input = styled.input`
  height: 40px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;

  &:focus {
    outline: none;
    border: 2px solid #ffa000;
  }
`;

const TextArea = styled.textarea`
  height: 400px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  resize: none;

  &:focus {
    outline: none;
    border: 2px solid #ffa000;
  }
`;

const Select = styled.select`
  height: 40px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ImagePlaceholder = styled.div`
  width: 60px;
  height: 60px;
  background-color: #ff9900;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px; /* Navbar와 버튼 사이 margin 추가 */
`;

const PostPage = () => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [district, setDistrict] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    if (images.length < 5) {
      const newImages = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...newImages].slice(0, 5));
    } else {
      alert('최대 5장의 이미지만 업로드할 수 있습니다.');
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('category', category);
    formData.append('title', title);
    formData.append('district', district);
    formData.append('neighborhood', neighborhood);
    formData.append('content', content);
    images.forEach((image, index) =>
      formData.append(`images[${index}]`, image)
    );

    console.log('Form submitted:', {
      category,
      title,
      district,
      neighborhood,
      content,
      images,
    });
    // 백엔드 API 호출 로직 추가
  };

  return (
    <PageWrapper>
      <Form onSubmit={handleSubmit}>
        <StyledLabel htmlFor='categorySelect'>카테고리</StyledLabel>
        <Select
          id='categorySelect'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value=''>커뮤니티 카테고리 선택</option>
          <option value='dog'>강아지 커뮤니티</option>
          <option value='mate'>산책메이트 커뮤니티</option>
        </Select>

        <StyledLabel htmlFor='titleInput'>제목</StyledLabel>
        <Input
          id='titleInput'
          type='text'
          placeholder='제목을 입력하세요'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <StyledLabel htmlFor='districtSelect'>지역</StyledLabel>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Select
            id='districtSelect'
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
          >
            <option value=''>구 선택</option>
            <option value='강남구'>강남구</option>
            <option value='서초구'>서초구</option>
          </Select>
          <Select
            id='neighborhoodSelect'
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            required
          >
            <option value=''>동 선택</option>
            <option value='삼성동'>삼성동</option>
            <option value='역삼동'>역삼동</option>
          </Select>
        </div>

        <StyledLabel htmlFor='imageUpload'>이미지 업로드</StyledLabel>
        <ImageUploadContainer>
          {images.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
              alt={`Uploaded ${index}`}
              style={{ width: '60px', height: '60px', borderRadius: '5px' }}
            />
          ))}
          {images.length < 5 && (
            <ImagePlaceholder onClick={triggerFileInput}>
              <HiddenInput
                id='imageUpload'
                type='file'
                accept='image/*'
                multiple
                ref={fileInputRef} // Attach ref to the hidden input
                onChange={handleImageUpload}
              />
              +
            </ImagePlaceholder>
          )}
        </ImageUploadContainer>

        <StyledLabel htmlFor='contentInput'>본문</StyledLabel>
        <TextArea
          id='contentInput'
          placeholder='본문을 입력하세요'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <ButtonContainer>
          <Button
            variant='cancel'
            size='medium'
            onClick={() => console.log('취소')}
          >
            취소
          </Button>
          <Button variant='send' size='medium' type='submit'>
            저장
          </Button>
        </ButtonContainer>
      </Form>
    </PageWrapper>
  );
};

export default PostPage;
