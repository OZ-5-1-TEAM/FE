import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import debounce from 'lodash.debounce';
import Button from '../components/Button';

const MainPageWrapper = styled.div`
  padding-top: 130px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  padding-bottom: 63px;
  min-height: 100vh;
`;

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff8e1;
  position: sticky;
  top: 0;
  z-index: 50;
`;

const SearchInput = styled.input`
  flex: 1; /* 검색창이 남은 공간을 채우도록 설정 */
  height: 30px;
  padding: 0 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 15px;

  &:focus {
    outline: none;
    border: 2px solid #ffa000;
  }
`;

const CancelButton = styled(Button)`
  height: 30px;
  padding: 0 15px; /* 글쓰기 버튼 크기에 맞춤 */
  background-color: #ffa000;
  font-size: 15px;
  margin-right: 1rem !important;
`;

const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'show', // show prop이 DOM으로 전달되지 않도록 설정
})`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  flex-direction: column;
  padding: 10px 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px; /* 버튼 간 간격 설정 */
  flex-wrap: wrap; /* 화면이 작아질 경우 자동으로 줄바꿈 */
`;

const Select = styled.select`
  height: 30px; /* 글쓰기 버튼과 동일한 높이 */
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
`;

const SortOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SortLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;

  input {
    margin-right: 5px;
  }
`;

const RefreshButton = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffa000;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const WriteButton = styled(Button)`
  font-size: 15px;
  width: 75px;
  height: 30px;
  background-color: #ffa000;
  color: white;
  border-radius: 5px;
  font-weight: bold;

  &:hover {
    opacity: 0.9;
  }
`;

const PostListContainer = styled.div`
  margin: 20px 0;
`;

const PostItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 10px;
  border-bottom: 1px solid #ddd;
`;

const PostImage = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 5px;
  margin-right: 15px;
  background-color: #f0f0f0;
  background-image: url('/placeholder-image.png');
  background-size: cover;
  background-position: center;
`;

const PostDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostTitle = styled.h4`
  font-size: 16px;
  color: #333;
  margin: 0;
`;

const PostDescription = styled.p`
  font-size: 14px;
  color: #777;
  margin: 5px 0 0 0;
`;

// 더미 데이터 생성
const generateDummyPosts = (startId = 1, count = 10) =>
  Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    title: `제목 ${startId + i}`,
    description: `선정릉 공원에서 산책 같이 하실 분... ㅤㅤ강남구 삼성동, 소형견 2024-11-26`,
    background: `/placeholder-image.jpg`,
  }));

function LikeCommunity() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const observer = useRef();
  const currentPostId = useRef(1);

  // 무한 스크롤 fetch
  const fetchPosts = useCallback(() => {
    setLoading(true);

    setTimeout(() => {
      const newPosts = generateDummyPosts(currentPostId.current, 10);
      currentPostId.current += 10;
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setLoading(false);

      if (currentPostId.current > 100) {
        setHasMore(false);
      }
    }, 1000);
  }, []);

  // Lazy Loading 및 Infinite Scroll 처리
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchPosts]
  );

  // 첫 렌더링 시 더미 데이터 로드
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 검색어 변경 시 자동 검색
  const searchPosts = useCallback(
    debounce((query) => {
      const filteredPosts = generateDummyPosts(1, 100).filter((post) =>
        post.title.includes(query)
      );
      setPosts(filteredPosts);
    }, 500),
    []
  );

  useEffect(() => {
    if (searchQuery) {
      searchPosts(searchQuery);
    } else {
      fetchPosts();
    }
  }, [searchQuery, searchPosts, fetchPosts]);

  const handleCancel = () => {
    setSearchQuery('');
    setPosts([]);
    currentPostId.current = 1;
    fetchPosts();
  };

  return (
    <MainPageWrapper>
      <Header title='좋아요한 게시물' />
      <SearchBarContainer>
        <SearchInput
          type='text'
          placeholder='Search'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FilterControls>
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
        </FilterControls>
      </SearchBarContainer>
      <PostListContainer>
        {posts.map((post, index) => (
          <PostItem
            key={post.id}
            ref={index === posts.length - 1 ? lastPostRef : null}
          >
            <PostImage />
            <PostDetails>
              <PostTitle>{post.title}</PostTitle>
              <PostDescription>{post.description}</PostDescription>
            </PostDetails>
          </PostItem>
        ))}
        {loading &&
          Array.from({ length: 15 }).map((_, i) => (
            <PostItem key={`skeleton-${i}`}>
              <Skeleton
                width={70}
                height={70}
                style={{ marginRight: '15px' }}
              />
              <PostDetails>
                <Skeleton width={200} height={20} />
                <Skeleton
                  width={150}
                  height={15}
                  style={{ marginTop: '5px' }}
                />
              </PostDetails>
            </PostItem>
          ))}
      </PostListContainer>
    </MainPageWrapper>
  );
}

export default LikeCommunity;
