import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CreateStart from '../components/CreateStart'
import CreateDetail from '../components/CreateDetail'

import useCreateStore from '../store/CreateStore'
import useArticleStore from '../store/ArticleStore'
import userInfoStore from '../store/LoginStore'
import useMapStore from '../store/MapStore'

import { styled, IconButton, Snackbar, Alert, Button, } from "@mui/material"
import { NavigateNext, NavigateBefore } from '@mui/icons-material'


const PrevBtn = styled(IconButton)`
  /* display: inline-block; */
`;

const NextBtn = styled(IconButton)`
  display: inline-block;
`;

const PublishButton = styled(Button)`
  margin-left: auto;
  color: #497cff;
`;

const CustomContainer = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;  // 수정된 부분
  margin-bottom: 5px;
`;


function Create() {
  const { Token, userInfo, getUserData } = userInfoStore()
  const { getArticle } = useArticleStore()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1);
  const [isInfoComplete, setInfoComplete] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const  { wholePost, articleId } = useCreateStore()
  const store = useCreateStore();
  const  { setMapCreateDay } = useMapStore()

  const goToNextStep = () => {
    if (currentStep === 1 && !isInfoComplete) {
      setSnackbarOpen(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // const handlePublish = async () => {
  //   // store에 있는 Axios 함수 가져오기
  //   const publishData = store.publishData;
  //   // Axios 함수 사용
  //   publishData()

  //   navigate(`/article/${articleId}`)
  //   // navigate('/')
  // }

  const handlePublish = async () => {
    // store에 있는 Axios 함수 가져오기
    const publishData = store.publishData;
  
    try {
      // Axios 함수 사용
      publishData();

      // publishData() 함수가 완료된 후에 navigate 실행
      navigate('/');
    } catch (error) {
      console.error("아티클 아이디 좀 넘겨주라^^", error);
    }
  }

  useEffect(() => {
  
    return () => {
      setMapCreateDay(1)
    }
  }, [])

  return (
    <>
      {currentStep === 1 && (
        <>
          <CreateStart
            onNextStep={goToNextStep}
            onComplete={(complete) => setInfoComplete(complete)}
          />
          <NextBtn
            onClick={goToNextStep}
            variant="contained"
            style={{
              display: "flex",
              marginLeft: "auto"
            }}
          >
            <NavigateNext fontSize="large" />
          </NextBtn>
        </>
      )}
      {currentStep === 2 && (
        <>
          <CustomContainer>
            <PrevBtn
              onClick={goToPrevStep}
              variant="contained"
            >
              <NavigateBefore fontSize="large" />
            </PrevBtn>
            <PublishButton
              variant="outlined"
              size="medium"
              // onClick={() => console.log('쉿! 게시글 등록 중😘')}
              onClick={handlePublish}
            >
              발행
            </PublishButton>
          </CustomContainer>
          <CreateDetail />
        </>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          sx={{ width: '100%' }}
        >
          글 정보를 전부 입력해 주세요.
        </Alert>
      </Snackbar>
    </>
  )
}

export default Create

