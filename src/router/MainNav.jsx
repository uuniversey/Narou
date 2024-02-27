import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import Home from '../pages/HomePage'
import Article from '../pages/ArticlePage'
import Compare from '../pages/ComparePage'
import Login from '../pages/LoginPage'
import Signup from '../pages/SignupPage'
import UserProfile from '../pages/UserProfilePage'
import Create from '../pages/CreatePage'
import Chat from '../pages/ChatPage'
import SearchPage from '../pages/SearchPage'

function MainNav() {

  return (
    <>
      {/* 페이지 렌더링 */}
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/article/:articleId' element={<Article />}/>
        <Route path='/compare' element={<Compare />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/profile/:targetId' element={<UserProfile />}/>
        <Route path='/create' element={<Create />}/>
        <Route path='/chat/:roomId' element={<Chat />}/>
        <Route path='/search/:keyword' element={<SearchPage />}/>
      </Routes>

    </>
  )
}

export default MainNav