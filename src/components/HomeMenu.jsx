import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Tooltip, IconButton, Drawer, List, ListItem, Avatar } from '@mui/material';
import { Tune, Menu, Home, Chat, ImportContacts, FlightTakeoff } from '@mui/icons-material';

const ToggleButton = styled(IconButton)`
  padding: 0px;
`

const CustomDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    display: flex;
    align-items: center;
    width: 100px; /* 원하는 폭으로 설정하세요 */
  }
`;

const CustomItem = styled(ListItem)`
  margin: auto;
`

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
`;

const CustomMenu = styled(Menu)`
    width: 200px;
`

function HomeMenu() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (path) => {
    navigate(path);
    setIsOpen(false); // 링크 클릭 후 메뉴 닫기
  };

  // 메뉴바 열고 닫기
  const handleIsMenu = () => {
    setIsOpen(!isOpen);
  }

  return (
    <>
    <Tooltip>
      <ToggleButton onClick={handleIsMenu}>
        <Menu edge="start" aria-label="open drawer" sx={{ fontSize: 40, color: 'black' }} />
      </ToggleButton>
    </Tooltip>

      <CustomDrawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
        <List sx={{ textAlign: 'center' }}>
          <CustomItem button sx={{ textAlign: 'center' }} onClick={() => handleLinkClick('/')}>
            <Link to='/'><Home sx={{ fontSize: 30, color: "black" }} /></Link>
          </CustomItem>
          <hr />
          <CustomItem button sx={{ textAlign: 'center' }} onClick={() => handleLinkClick('/chat')}>
            <Link to='/chat'><Chat sx={{ fontSize: 30, color: "black" }} /></Link>
          </CustomItem>
          <CustomItem button sx={{ textAlign: 'center' }} onClick={() => handleLinkClick('/')}>
            <Link to='/'><FlightTakeoff sx={{ fontSize: 30, color: "black" }} /></Link>
          </CustomItem>
          <CustomItem button sx={{ textAlign: 'center' }} onClick={() => handleLinkClick('/compare')}>
            <Link to='/compare'><ImportContacts sx={{ fontSize: 30, color: "black" }} /></Link>
          </CustomItem>
        </List>
      </CustomDrawer>
    </>
  );
}

export default HomeMenu;

