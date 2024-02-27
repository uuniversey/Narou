import React from "react"
import { Link, useNavigate } from 'react-router-dom'
import { styled, Fab } from "@mui/material"
import CreateIcon from "@mui/icons-material/Create"

import userInfoStore from "../store/LoginStore"

const FabContainer = styled('div')({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  display: 'flex',
  flexDirection: 'column',
  marginRight: '20px',
  float: 'right',
  zIndex: 1000,
})

const StyledFab = styled(Fab)({
  marginBottom: '10px',
  backgroundColor: '#497cff',
  color: 'white',

  '&:hover': {
    backgroundColor: 'white',
    color: '#497cff',
  },
})

function FabNav() {

  const { isLogined } = userInfoStore()
  const navigate = useNavigate()

  const moveCreate = () => {
    navigate('/create')
  }

  // const moveCompare = () => {
  //   navigate('/compare');
  // };

  return (
    <FabContainer>
      {/* <StyledFab onClick={moveCompare} aria-label="add">
        비교
      </StyledFab> */}
      <StyledFab
        onClick={moveCreate}
        aria-label="edit"
        style={{ display: isLogined ? '' : 'none' }}
      >
        <CreateIcon />
      </StyledFab>
    </FabContainer>
  );
}

export default FabNav
