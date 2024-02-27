import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import userInfoStore from "../store/LoginStore"

import naverlogin from "../assets/images/naverlogin.png"
import kakaologin from "../assets/images/kakaologin.png"
import googlelogin from "../assets/images/googlelogin.png"
import login from "../assets/images/login.png"

import { styled, Button, TextField, Typography } from "@mui/material"


const StyledImg = styled('img')`
  width: 220px;
  height: 50px;
  cursor: pointer;
  margin: 10px;
`

const StyledDiv = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center; /* 중앙 정렬 */
`

const FormContainer = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* 중앙 정렬 */
  margin-bottom: 20px;
`

const InputIDPW = styled(TextField)`
  background-color: white;
  color: #497cff;
  display: block;
  width: 300px;
`

const SignUpLink = styled('a')`
  text-decoration: none;
  color: #497cff;
  margin-top: 10px;
`

const LoginButton = styled(Button)`
  display: block;
  height: 40px;
  width: 300px;
  margin-top: 20px;
  background-color: #497cff;
`

function Login() {

  const navigate = useNavigate()

  const [userID, setUserID] = useState('')
  const [userPW, setUserPW] = useState('')

  const { fetchData, catchCookieK, catchCookieN, catchCookieG, Token } = userInfoStore()
  
  const handleID = (event) => {
    setUserID(event.target.value)
  }

  const handlePW = (event) => {
    setUserPW(event.target.value)
  }

  // 일반 로그인
  const handleLogin = (event) => {
    event.preventDefault()

    const userData =new URLSearchParams()
    userData.append('username', userID)
    userData.append('password', userPW)
    
    fetchData(userData)
  }

  useEffect(() => {
    if (Token !== null) {
      if (Token) {
        navigate('/')
        alert('로그인이 완료되었습니다.')
      } 
    }
  }, [Token])
      
      
  // kakao api
  const KAKAO_LINK = 'https://narou-back.duckdns.org/oauth2/authorization/kakao'

  // naver api
  const NAVER_LINK = 'https://narou-back.duckdns.org/oauth2/authorization/naver'

  // google api
  const GOOGLE_LINK = 'https://narou-back.duckdns.org/oauth2/authorization/google'

  const moveKakao = () => {
    window.location.href = KAKAO_LINK
    catchCookieK(KAKAO_LINK)
    // 리다이렉트
    if (Token !== null) {
      navigate('/')
    }
  }

  const moveNaver = () => {
    window.location.href = NAVER_LINK
    catchCookieN(NAVER_LINK)
    // 리다이렉트
    if (Token !== null) {
      navigate('/')
    }
  }

  const moveGoogle = () => {
    window.location.href = GOOGLE_LINK
    catchCookieG(GOOGLE_LINK)
    // 리다이렉트
    if (Token !== null) {
      navigate('/')
    }
  }

  return (
    <>
      <FormContainer>
        <img src={login} alt="" style={{ width: "200px" }}/>
        <form onSubmit={handleLogin}>
          <InputIDPW
            label="ID"
            variant="outlined" 
            fullWidth
            margin="normal"
            value={userID}
            size="small"
            onChange={handleID}
          />
          <InputIDPW
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            size="small"
            margin="normal"
            value={userPW}
            onChange={handlePW}
          />
          <LoginButton variant="contained" type="submit">
            로그인
          </LoginButton>
        </form>
        <br />
        {/* <Alert severity="success">로그인이 완료되었습니다.</Alert> */}
        <Typography>
          멤버가 아니신가요? <SignUpLink href="/signup">회원가입</SignUpLink>
        </Typography>
      </FormContainer>
      <StyledDiv>
        <StyledImg src={naverlogin} onClick={moveNaver} alt="Naver 로그인" />
        <StyledImg src={kakaologin} onClick={moveKakao} alt="Kakao 로그인" />
        <StyledImg src={googlelogin} onClick={moveGoogle} alt="Google 로그인" />
      </StyledDiv>


    </>
  )
}

export default Login




// // kakao api
// const REDIRECT_URI_K = 'http://localhost:8080/users/login/oauth2/code/kakao'
// const KAKAO_LINK = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_KAKAO_LOGIN_KEY}&redirect_uri=${REDIRECT_URI_K}`
                    
// // naver api
// const REDIRECT_URI_N = 'http://localhost:8080/users/login/oauth2/code/naver'
// const NAVER_LINK = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.REACT_APP_NAVER_LOGIN_KEY}&state=STATE_STRING&redirect_uri=${REDIRECT_URI_N}`

// // google api
// const REDIRECT_URI_G = 'http://localhost:8080/users/login/oauth2/code/google'
// const GOOGLE_LINK = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_LOGIN_KEY}&redirect_uri=${REDIRECT_URI_G}&response_type=code&scope=email profile`
