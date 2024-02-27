import React, { useState } from 'react'
import { styled, Avatar, Menu, MenuItem, Tooltip, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import userInfoStore from '../store/LoginStore'

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
`

const CustomMenu = styled(Menu)`
  width: 200px;
`
const NavigateMenu = styled('div')`
  text-decoration: 'none';
  color: 'inherit';
`

function UserMenu() {

  let userid = null
  
  const { isLogined, setIsLogined, userInfo, setToken } = userInfoStore()

  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const moveLogin = () => {
    navigate('/login')
  }

  const moveSignup = () => {
    navigate('/signup')
  }

  const moveProfile = () => {
    // catchMyInfo(`users/profile/${userInfo.userId}`)
    navigate(`/profile/${userInfo.userId}`)
  }

  const deleteToken = () => {
    sessionStorage.removeItem('accesstoken')
    sessionStorage.removeItem('refreshtoken')
    setIsLogined(false)
    setToken(null)
    alert('성공적으로 로그아웃 되었습니다.')
    navigate('/')
  }


  return (
    <>

    <IconButton>
        <StyledAvatar src="/broken-image.jpg" onClick={handleMenuOpen} /> 
    </IconButton>
    
    <CustomMenu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 5px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        
        { !isLogined ?
        <MenuItem onClick={() => {handleMenuClose(); moveLogin()}}>
          <NavigateMenu>
            로그인
          </NavigateMenu>
        </MenuItem> : ''
        }
        { !isLogined ?
        <MenuItem onClick={() => {handleMenuClose(); moveSignup()}}>
          <NavigateMenu>
            회원가입                  
          </NavigateMenu>
        </MenuItem> : ''
        }
        { isLogined ?
        <MenuItem onClick={() => {handleMenuClose(); deleteToken()}}>
          <NavigateMenu>
            로그아웃                  
          </NavigateMenu>
        </MenuItem> : ''
        }
        { isLogined ?
        <MenuItem onClick={() => {handleMenuClose(); moveProfile()}}>
          <NavigateMenu>
            프로필
          </NavigateMenu>
        </MenuItem> : ''
        }

      </CustomMenu>
    </>
  );
}

export default UserMenu;