import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import { format } from 'date-fns';

import { TabContext, TabPanel } from "@mui/lab";
import { Box, Button, Fab, Modal, Tabs, Tab, Zoom, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styled from "@emotion/styled";

import ArticleMap from "./ArticleMap";
import CommentList from "./CommentList";
import CommentCreate from "./CommentCreate";
import ArticleFeedList from "./ArticleFeedList";

import useArticleStore from "../store/ArticleStore";
import { ArticleOutlined } from "@mui/icons-material";

// 탭 관련 스타일
const TopContainer = styled("div")`
  border: 1px solid lightgray;
  width: 100%;
  min-height: 782px;
  margin-bottom: 50px;
  overflow: auto;
`;

const CustomTabContext = styled(TabContext)`
  width: 50%;
  border: 1px solid black;
`;

const TabPanelContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const CommentContainer = styled('div')`
  /* border: 1px solid #f4f7ff; */
  background-color: #eef3ff;
  border-radius: 10px;
  padding: 20px;
`

const Title = styled('h3')`
  margin: 0;
  font-weight: bold;
  color: #497CFF;
`

function ArticleDetail() {
  const { getData } = useArticleStore()
  const [ articleData, setArticleData] = useState(null);
  const [days, setDays] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const { articleId } = useParams()

  useEffect(() => {
    if (getData) {
      // 여기서 getData로부터 필요한 값을 추출하여 사용하도록 수정
      const dateDiff = getData.dateDiff || 7;

      setDays(dateDiff);

      // 나머지 필요한 작업 수행
      console.log(`새로운 days 값: ${dateDiff}`);
    }
  }, [getData]);

  const [myPosts, setMyPosts] = useState(Array.from({ length: days }, () => []))

  // const feedData = getData ? [getData] : [];

  // console.log(`getData.dateDiff: ${getData.dateDiff}`)
  console.log(days)
  console.log(`articledetail의 getData: ${getData}`)
  // console.log(`articledetail의 feedData: ${feedData}`)

  return (
    <>
      {/* {`여행 기간: ${format(depatureDate.$d, 'yyyy-MM-dd')} ~ ${format(arriveDate.$d, 'yyyy-MM-dd')}, ${days}일 ${nights}박 ${days}일`} */}
      <Grid container justifyContent="space-between" spacing={5}>
        {/* 맵 자리 */}
        <Grid item xs={5}>
          <ArticleMap />
          <br />
          {/* 댓글창 */}
          <CommentContainer>
            <Title>Comment</Title>
            
            {/* 댓글 작성 */}
            <CommentCreate />

            {/* 댓글 조회 */}
            <CommentList 
              articleId={articleId}
            />
          </CommentContainer>
        </Grid>

        {/* 게시글 자리 */}
        <Grid item xs={7}>
          <TopContainer>
            <CustomTabContext value={currentTab.toString()}>
              <Tabs
                value={currentTab.toString()}
                onChange={(event, newValue) => {
                  setCurrentTab(Number(newValue));
                  // setMapCreateDay(Number(newValue) + 1);
                }}
              >
                {Array.from({ length: days }, (_, index) => (
                  <Tab key={index} label={`${index + 1}일`} value={index.toString()} />
                ))}
              </Tabs>

              {Array.from({ length: days }, (_, index) => (
                <TabPanel key={index} value={index.toString()}>
                  <TabPanelContainer>
                    <ArticleFeedList
                      // myPosts={myPosts} 
                      currentTab={currentTab}
                    />
                  </TabPanelContainer>
                </TabPanel>
              ))}
            </CustomTabContext>
          </TopContainer>         
        </Grid>
      </Grid>
    </>
  );
}

export default ArticleDetail;


