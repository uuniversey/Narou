import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'

import { styled, Grid, Button, IconButton, Box } from '@mui/material'
import { Delete } from '@mui/icons-material';

import useArticleStore from '../store/ArticleStore'
import userInfoStore from '../store/LoginStore';

import ArticleDetail from '../components/ArticleDetail'
import ArticleSummury from '../components/ArticleSummury'
import ArticleIcon from '../components/ArticleIcon'

const CustomHr = styled('hr')`
  border: 1px solid whitesmoke;
  margin: 20px 0px 20px 0px;
`

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-left: auto;
`

const DeleteButton = styled(Button)`
  min-width: 50px;
  margin-left: 8px;
`

const UpdateButton = styled(Button)`
  min-width: 50px;
  margin-left: 8px;
`

function Article() {
  const { Token, isLogined } = userInfoStore()
  const { articleId } = useParams()
  const { getArticle, getData, deleteArticle } = useArticleStore();
  // const [articleData, setArticleData] = useState(null);

  const navigate = useNavigate()

  // getArticle 불러오기
  useEffect(() => {
    getArticle(articleId, Token);
  }, [articleId]); // articleId가 변경될 때마다 호출

  // article 삭제 로직
  const handleDelete = () => {
    // 여기서 동적으로 articleId를 사용하도록 수정
    deleteArticle({
      articleId: articleId,
    }, Token);
    // navigate('/profile/user_id');
  };

  return (
    <Grid container>

      <Grid item xs={9}>
        <ArticleSummury />
      </Grid>

      <Grid item xs={3}>
        <ArticleIcon
          articleId={articleId}
        />
      </Grid>

      <Grid item xs={12}>
        <CustomHr />
        <ArticleDetail />
        {/* <ArticleDetail articleData={articleData} /> */}
      </Grid>
      <Grid item xs={12}>
        <CustomHr />
        <ButtonContainer>
          <UpdateButton 
            variant="outlined"
            size="small"
            // startIcon={<Delete />}
            onClick={handleDelete}
            style={{ display: isLogined ? '' : 'none'}}
          >
            수정
            {/* <Delete /> */}
          </UpdateButton>
          <DeleteButton 
            variant="outlined"
            size="small"
            // startIcon={<Delete />}
            onClick={handleDelete}
            style={{ display: isLogined ? '' : 'none'}}
          >
            삭제
            {/* <Delete /> */}
          </DeleteButton>
        </ButtonContainer>
      </Grid>

    </Grid>
  )
}

export default Article