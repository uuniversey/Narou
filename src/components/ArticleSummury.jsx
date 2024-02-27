import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"

import { styled } from '@mui/material'

import useArticleStore from "../store/ArticleStore";

const Title = styled('h2')`
  margin: 0 0 5px 0;
`

const SmallTitle = styled('span')`
  font-style: italic;
  color: lightgray;
`

const UserInfo = styled('span')`
  font-size: x-small;
  margin: 0 0 10px 0;
`

const TripInfo = styled('p')`
  font-size: small;
  margin: 0 0 0px 0;
`

const TagButton = styled('button')`
  font-size: x-small;
  min-height: 17.6px;
  border-radius: 2px;
  margin-right: 4px; /* 각 버튼 사이의 간격 조정 */
  background-color: #a0bbff; /* 하늘색 배경 적용 */
  color: #fff; /* 텍스트 색상을 흰색으로 설정 */
  border: none; /* 테두리 제거 */
  padding: 2px 6px; /* 내부 여백 조정 */
  cursor: pointer; /* 커서를 포인터로 변경하여 클릭 가능함을 나타냅니다. */
  transition: background-color 0.3s ease; /* 배경 색상 변화에 대한 0.3초의 이징 효과를 추가합니다. */

  &:hover {
    background-color: #d7e3ff; /* 버튼 위에 마우스를 올렸을 때의 배경 색상을 변경합니다. */
  }
`;

function ArticleSummury() {
  const { getData } = useArticleStore()
  // const [likeCount, setLikeCount] = useState(getData.likeCount);
  // const hashtags = getData.hashtags;

  const navigate = useNavigate()

  const goSearch = (tag) => {
    navigate(`search/${tag.tagName}`)
  }

  const handleClick = (userId) => {
    console.log('유저 프로필로 이동!!')
    navigate(`/profile/${userId}`)
  }
  // useEffect(() => {
  //   // getData가 변경되면 likeCount를 업데이트
  //   setLikeCount(getData.likeCount);
  // }, [getData]);  

  return (
<>
      {getData && getData.hashtags && ( // getData가 존재하고, hashtags도 존재할 때 렌더링
        <>
          <Title>{getData.title}</Title>
          <TripInfo>
            <b>인원 </b> {getData.peopleNumber}명 ┃
            <b>일정 </b> {getData.startDate} - {getData.endDate} ({getData.dateDiff -1 }박{getData.dateDiff}일) ┃
            <b>해시태그 </b>           
            {getData.hashtags.map((tag, index) => (
              <TagButton key={index} onClick={() => goSearch(tag.tagName)}>
                {tag.tagName}
              </TagButton>
            ))}
          </TripInfo>

          <UserInfo>
            <SmallTitle>by</SmallTitle> <span style={{ cursor: 'pointer' }} onClick={() => handleClick(getData.member.userId)}>{getData.member.nickname}　·　</span>
            <SmallTitle>조회수</SmallTitle> {getData.viewCount}　·　
            <SmallTitle>좋아요</SmallTitle> {getData.likeCount}　·　
            <SmallTitle>발행일자</SmallTitle> {getData.createdTime}
            
          </UserInfo>
        </>
      )}
    </>

  )
}

export default ArticleSummury