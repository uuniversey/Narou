import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import userInfoStore from './store/LoginStore'

import MainNav from "./router/MainNav"
import FabNav from "./router/FabNav"

import { styled, createTheme, CssBaseline, Container } from '@mui/material'

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';

import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';

import Footer from './components/Footer'
import HomeMenu from './components/HomeMenu'
import UserMenu from './components/UserMenu'



const MenuStyle = styled('div')`
  position: fixed;
  left: 10px;
  top: 10px;
  z-index: 1001;
`
const ProfileStyle = styled('div')`
  position: fixed;
  right: 10px;
  top: 10px;
  z-index: 1001;
`

function App() {

  // const materialTheme = materialExtendTheme();

  const materialTheme = materialExtendTheme({
    typography: {
      fontFamily: 'Montserrat, sans-serif', 
    },
    palette: {
      primary: {
        main: '#497cff', // 원하는 색상 코드로 변경
      },
      // 기타 색상 및 설정은 필요에 따라 추가 가능
    },
  });
  

  // 프로필 페이지로 이동
  const navigate = useNavigate()
  const moveProfile = () => {
    navigate('/profile')
  }

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        {/* <CssBaseline /> 초기화 스타일 제공 */}
        
        {/* 나머지 앱 컴포넌트들 */}
        {/* 메뉴바와 프로필 */}
        <MenuStyle>
          <HomeMenu /> 
        </MenuStyle>

        <ProfileStyle>
          <UserMenu />
        </ProfileStyle>

        <Container style={{ marginTop: "20px"}}>
          <MainNav />
          <FabNav />
        </Container>

        <Footer />
        </JoyCssVarsProvider>
    </MaterialCssVarsProvider>

  )
}

export default App