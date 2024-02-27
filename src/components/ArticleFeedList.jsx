import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import ArticleFeedItem from "./ArticleFeedItem";
import { Typography } from "@mui/material";
import empty from "../assets/images/empty.png"
import useArticleStore from "../store/ArticleStore";
import { csCZ } from "@mui/x-date-pickers";

const ListContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  margin: 10px;
  padding: 10px;
  justify-content: center;
`

const EmptyDiv = styled.div`
  padding: 20px;
  text-align: center;
`

const ArticleFeedList = ({ currentTab }) => {
  const { getData } = useArticleStore()
  const [feedsByDay, setFeedsByDay] = useState([]);
  
  currentTab = currentTab + 1

  // feedData가 들어온 경우 zipDataByDay 함수를 호출하여 feedsByDay 업데이트
  useEffect(() => {
    if (getData && getData.feeds) {
      const updatedFeedsByDay = zipDataByDay(getData);
      setFeedsByDay(updatedFeedsByDay);
    }
  }, [getData]);


  // 날짜별 데이터 묶기
  const zipDataByDay = (feedData) => {
    const feedsByDay = []

    feedData.feeds.forEach((feed) => {
      const { nthDay, sequence, content, latitude, longitude, address, location, filePath } = feed;
  
      if (!feedsByDay[nthDay]) {
        feedsByDay[nthDay] = [];
      }

      feedsByDay[nthDay].push({ content, location, filePath });
    });

    feedsByDay.forEach((dayArray, nthDay) => {
      console.log(`nthDay: ${nthDay}, Length: ${dayArray.length}`);
    });

    console.log("Feeds by day:", feedsByDay)
    console.log(`length: ${ feedsByDay.length }`)

    return feedsByDay;
  };

  return (
    <ListContainer>
      {/* 여기부터 시작 */}
    {(feedsByDay.length === 0 || !feedsByDay[currentTab] || feedsByDay[currentTab].length === 0) && (
      // feedsByDay 배열이 하나도 없거나 currentTab에 해당하는 배열이 존재하지 않거나 길이가 0인 경우
      <EmptyDiv>
        <img src={empty} alt="" style={{ width: "30%" }} />
        <br />
        <Typography>
          등록된 포스트가 없습니다
        </Typography>
      </EmptyDiv>
    )}

    {feedsByDay.length > 0 && feedsByDay[currentTab] && feedsByDay[currentTab].length > 0 && (
      // feedsByDay 배열이 하나 이상 있고 currentTab에 해당하는 배열의 길이가 1 이상인 경우
      feedsByDay[currentTab].map((feed, index) => (
        <ArticleFeedItem
          key={index}
          feed={feed}
        />
      ))
    )}
    </ListContainer>
  );
};

export default ArticleFeedList;