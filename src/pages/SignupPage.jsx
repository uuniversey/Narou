import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import SignUpStore from '../store/SignUpStore'

import signup from "../assets/images/signup.png"

import { styled, Button, TextField, Grid } from "@mui/material"

const ImgContainer = styled(Grid)`
  display: flex;
  align-items: center; /* 중앙 정렬 */
  margin-bottom: 20px;
  margin-left: 30px;
`

const FormContainer = styled(Grid)`
  margin-top: 50px;
  /* width: 50%; */
  display: flex;
  flex-direction: column;
  align-items: center; /* 중앙 정렬 */
  margin-bottom: 20px;
  min-height: 500px;
`

const InputIDPW = styled(TextField)`
  color: #497cff;
  display: block;
  width: 300px;
  height: inherit;
`

const LoginButton = styled(Button)`
  display: block;
  width: 300px;
  height: 40px;
  background-color: #497cff;
`

const WarningMSG = styled('p')`
  color: red;
  font-size: 12px;
`

const SmallBtn = styled(Button)`
  height: auto;
  width: 100px;
  height: 40px;
  white-space: nowrap;
`

const LinkDiv = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 10px;
`


function Signup() {

  const navigate = useNavigate()

  const { register, handleSubmit, getValues } = useForm({
    mode: 'onBlur'
  })
  const { codeData, code, nickNameData, dupcheck, errorMessage, setErrorMessage, signupData } = SignUpStore()
  
  const [ isChecked, setIsChecked ] = useState(
    {
      certification: false,
      nickname: false,
      password: false,
    }
  )

  // isChecked 관측
  useEffect(() => {
    if (dupcheck === true) {
      setIsChecked((prev) => ({
        ...prev,
        nickname: true,
      }))
    }
  }, [dupcheck])

  // 인증번호 발송
  const sendCodeNo = (event) => {
    event.preventDefault()
    const data = {
      email: getValues('email')
    }
  
    const urls = 'auth/email/sendcode'
    codeData(urls, data)
    alert('인증번호가 발송 되었습니다.')
  
  }

  // 인증번호 확인
  const checkCertification = (event) => {
    event.preventDefault()
    console.log(getValues('certification'))
    console.log(code)
    if (code === getValues('certification')) {
      setIsChecked((prev) => ({
        ...prev,
        certification: true,
      }))
      alert('인증번호가 올바르게 확인되었습니다.')
    }

  }

  // 닉네임 중복 확인
  const sendNickname = (event) => {
    event.preventDefault()
    const data = { 
      nickname: getValues('nickname')
    }
    const urls = `users/profile/dupcheck/${data.nickname}`

    nickNameData(data, urls)
  }

  // 비밀번호 유효성 체크 - 설정한 조건에 맞는 비밀번호인지
  const isPWValid = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(getValues('password'))
  
  // 설정한 조건에 맞는 비밀번호인지 에러메세지 설정
  const checkPWValid = (event) => {
    if (!isPWValid) {
      setErrorMessage('!영문 소문자, 숫자와 특수기호를 조합한 8자리 이상 비밀번호를 사용 해야 합니다.')
    } 
    if (!getValues('password')) {
      setErrorMessage('')
    }
  }
  
  // 비밀번호 유효성 체크 - pw/pw2 일치하는지
  const checkPW = (event) => {
    if (getValues('password') && getValues('password') === getValues('password2')) {
      setIsChecked((prev) => ({
        ...prev,
        password: true,
      }))
      setErrorMessage('!사용 가능한 비밀번호입니다.')
      
    } else if (!getValues('password2')) {
      setErrorMessage('')
      
    } else {
      setIsChecked((prev) => ({
        ...prev,
        password: false,
      }))
      setErrorMessage('!비밀번호가 일치하지 않습니다.')
    }
    if (getValues('password') && !isPWValid) {
      setErrorMessage('!영문 소문자, 숫자와 특수기호를 조합한 8자리 이상 비밀번호를 사용 해야 합니다.')
      return
    }
  }

  // 회원가입
  const handleSignup= () =>{
    const urls = 'auth/join'
    const data = {
      email: getValues('email'),
      password: getValues('password'),
      nickname: getValues('nickname')
    }

    signupData(urls, data)
    alert('회원가입이 완료되었습니다.')
    navigate('/')
  }

  return (
    <Grid container spacing={12}>
      <ImgContainer item sx={6}>
        <img src={signup} alt="" style={{ width: "250px" }}/>
      </ImgContainer>
      <FormContainer item sx={6}>
        <form onSubmit={handleSubmit((userInfo) => {
          console.log(userInfo, 'dasdadasdd')
        })}>
        <LinkDiv>
          <InputIDPW
            label="Email"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            {...register('email')}
          />
          <SmallBtn variant='outlined' onClick={sendCodeNo}>인증번호발송</SmallBtn>
        </LinkDiv>


        <LinkDiv>
          <InputIDPW
            label="인증번호"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            {...register('certification')}
          />
          <SmallBtn variant='outlined' onClick={checkCertification}>확인</SmallBtn>
        </LinkDiv>

        <InputIDPW
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          size="small"
          margin="normal"
          {...register('password', { onBlur: checkPWValid })}
        />

        <InputIDPW
          label="Password2"
          variant="outlined"
          type="password"
          fullWidth
          size="small"
          margin="normal"
          {...register('password2', { onBlur: checkPW })}
        />
        <WarningMSG>{ errorMessage }</WarningMSG>
          

        <LinkDiv>
          <InputIDPW
            label="닉네임"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            {...register('nickname')}
          />
          <SmallBtn variant='outlined' onClick={sendNickname}>중복확인</SmallBtn>
        </LinkDiv>

          <br />
          <LoginButton 
            variant='contained'
            disabled={ Object.values(isChecked).every(value => value) ? false : true }
            onClick={handleSignup}
          >
            회원가입
          </LoginButton>
        </form>
      </FormContainer>
      
    </Grid>
  )
}

export default Signup

