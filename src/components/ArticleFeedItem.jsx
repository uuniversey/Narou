import React from "react";

import { styled, Paper, Typography } from "@mui/material"
import { Place, Flight, Loyalty } from "@mui/icons-material";
import useArticleStore from "../store/ArticleStore";

const ListItemContainer = styled('div')`
  margin: 10px;
  padding: 10px;
  display: inline-flex;
  justify-content: center;
`;

const PostFormContainer = styled(Paper)`
  width: 100%;
  border: 1px solid #497CFF;
  padding: 15px;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PostImage = styled('img')`
  width: 350px;
  height: 350px;
  display: flex;
  align-items: center;
  text-align: center;
`;

const PostContentContainer = styled('div')`  
  width: 350px;
  margin-top: 15px;
  background: whitesmoke;
  min-height: 120px;
`;

const PostContentBackground = styled('div')`
  padding: 10px 10px 10px 10px; // 상우하좌
`;

const LocationDiv = styled('div')`
  width: 100%;
  text-align: left;
  margin-bottom: 15px;
  font-size: small;
  display: flex;
  align-items: center;
`

const ArticleFeedItem = ({ feed }) => {
  // const { getData } = useArticleStore()

  return (
    <ListItemContainer>
      <PostFormContainer elevation={2} >

        <LocationDiv>
            {/* <Place /> */}
            <Place sx={{ fontSize: 20 }} style={{ color: "#497CFF", paddingRight: "5px"}}/>
            <span style={{ backgroundColor: "#e1ebff"}}>{feed.location}</span>
        </LocationDiv>
        <hr style={{ width: "350px", margin: "0px 0px 10px 0px", border: "1px solid whitesmoke"}}/>
        {/* <PostImage src={getData.filePath} alt={`Uploaded ${getData.index}`} /> */}
        <PostImage src={feed.filePath} />

        <PostContentContainer>
          <PostContentBackground>
            {feed.content}
          </PostContentBackground>
        </PostContentContainer>

      </PostFormContainer>
    </ListItemContainer>
  );
};

export default ArticleFeedItem;