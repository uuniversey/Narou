import React, { useState, useEffect } from "react";

import { Bookmark, BookmarkBorder, Favorite, FavoriteBorder } from "@mui/icons-material";
import { styled } from '@mui/material'
import userInfoStore from "../store/LoginStore";
import useArticleStore from "../store/ArticleStore";
import userProfileStore from "../store/UserProfileStore";

const IconContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
`

const IconItem = styled('span')`
  margin: 2px;
  cursor: pointer; /* 커서를 포인터로 변경하여 사용자에게 클릭 가능함을 나타냅니다. */
  transition: color 0.3s ease; /* 컬러 변화에 대한 0.3초의 이징 효과를 추가합니다. */
  
  &:hover {
    color: #bebebe; /* 아이콘 위에 마우스를 올렸을 때의 색상을 변경합니다. */
  }
`

const LikeIcon = styled(Favorite)`
  color: #c60e61;
  font-size: xx-large;
`

const UnlikeIcon = styled(FavoriteBorder)`
  color: #c60e61;
  font-size: xx-large;
`

const ScrapIcon = styled(Bookmark)`
  color: #497cff;
  font-size: xx-large;
`

const UnscrapIcon = styled(BookmarkBorder)`
  color: #497cff;
  font-size: xx-large;
`

function ArticleIcon ({articleId}) {
  const { Token, isLogined } = userInfoStore()
  const {postLike, postUnlike, getData, getArticle} = useArticleStore()
  const {userScrap, userUnScrap} = userProfileStore()

  // useEffect(() => {
  //   getArticle(articleId, Token)
  //   .then(() => {
  //     setIsScrap(getData.scraped)
  //     setIsLike(getData.liked)
  //   })
  // }, [articleId])
  
  // 스크랩 & 좋아요
  const [isScrap, setIsScrap] = useState(false)
  const [isLike, setIsLike] = useState(false)

  const handleIsScrap = () => {
    setIsScrap(prevIsScrap => !prevIsScrap) // 이전 상태를 활용하여 토글
    // 스크랩 상태에 따라 적절한 함수 호출
    if (!isScrap) {
      // 스크랩 추가
      userScrap(articleId, Token)
    } else {
      // 스크랩 제거
      userUnScrap(articleId, Token)
    }
  }


  const handleIsLike = () => {
    setIsLike(prevIsLike => !prevIsLike); // 이전 상태를 활용하여 토글
    // 라이크 상태에 따라 적절한 함수 호출
    if (!isLike) {
      // 라이크 추가
      postLike(articleId, Token)
    } else {
      // 라이크 제거
      postUnlike(articleId, Token)
    }
  }
  

  return (
    <IconContainer>
      {/* <IconItem onClick={handleIsLike}> */}
      <IconItem onClick={handleIsLike} style={{ display: isLogined ? '':'none'}}>
        {isLike ? <LikeIcon /> : <UnlikeIcon /> }
      </IconItem>
      {/* <IconItem onClick={handleIsScrap}> */}
      <IconItem onClick={handleIsScrap} style={{ display: isLogined ? '':'none'}}>
        {isScrap ? <ScrapIcon /> : <UnscrapIcon /> }
      </IconItem>
    </IconContainer>
  )
}

export default ArticleIcon