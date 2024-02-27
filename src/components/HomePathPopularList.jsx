import React, { useEffect } from 'react'
import HomeStore from '../store/HomeStore'

import { Grid, Container, styled } from '@mui/material'

import MainMap from './MainMap'

const InnerGrid = styled(Grid)`
  display: flex;
  flex-wrap: wrap;
`

function HomePathPopularList() {
  
  const { getPath, pathData } = HomeStore()
  
  console.log(pathData, '패스데이터2')

  // // 초기 Photo 데이터 렌더링
  // useEffect (() => {
  //   console.log('1')
  //   // null 자리에 url 넣어야함
  //   getPath('article/search')
  // }, [])

  return (
    <>
    {/* 홈패스파퓰러리스트 */}
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'30px'}}>        
        <Container>
          <InnerGrid container spacing={4}>
          <MainMap type={'popular'} />
          </InnerGrid>
        </Container>
      </div>
    </>
  )
}

export default HomePathPopularList

