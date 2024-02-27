import React, { useEffect, useRef, useState } from 'react'
import HomeStore from '../store/HomeStore'

import { Container, Grid, Typography, styled } from '@mui/material'
import { useNavigate } from 'react-router'
import BasicInfiScroll from './BasicInfiScroll'
import axios from '../axios.js'

const PhotoGrid = styled(Grid)`
  display: flex;
  margin: 20px 20px 0px 15px;
  text-align: center;
  flex-direction: row;
  align-items: center;
`

function HomePhotoPopularList() {

const { getPhoto, photoData } = HomeStore()

const [pins, setPins] = useState([])
const [page, setPage] = useState(0)
const [loading, setLoading] = useState(false)
// true일 경우 무한 스크롤 계속 진행
const [hasMore, setHasMore] = useState(true)

const pageEnd = useRef()
const navigate = useNavigate()

// const fetchPins = async page => {
//   const startIndex = (page - 1) * 20;
//   const endIndex = startIndex + 20;
//   const nextTwentyItems = itemData.slice(startIndex, endIndex);
//   console.log("자자~~~~~~~~~~` 그 다음 20개 호출하겠습니다", page, nextTwentyItems.length, hasMore)
//   // const firstTenItems = photoData
//   setPins(prev => [...prev, ...nextTwentyItems])
//   if (nextTwentyItems.length < 10) {
//     console.log('hi')
//     setHasMore(false)
//   }
// }

  const fetchPins = async page => {
    try {
      const response = await axios.get
      // 게시글 15개 이상일 때만
      // (`article/search?page=${page}`)
      // // 검색어 back에 요청
      ( `article/search?page=${page}&orderBy=true`)
      // (`article/search`)
      console.log(response.data.data);
      const data = await response.data.data.content
      setPins(prev => [...prev, ...data]) 
      setLoading(true)
      // setLoading(true)
      if (data.length < 15) {
      setHasMore(false)
      }
    } 
    catch (error) {
      // 요청이 실패했을 때 처리할 로직
      console.error(error);
      // alert(error.message);
    }
      }

// const loadMore = () => {
//   setPage(prev => prev + 1);
// }

// const fetchPins = async page => {
//   // await getPhoto(`article/read?page=${page}&per_page=10`)
//   await getPhoto(`article/search`)
//   console.log("자자~~~~~~~~~~` 그 다음 20개 호출하겠습니다", page, photoData.length, hasMore)
//   // const firstTenItems = photoData
//   setPins(prev => [...prev, ...photoData])
//   if (photoData.length < 10) {
//     console.log('hi') 
//     setHasMore(false)
//   }
// }

useEffect(() => {
  // console.log(page)
  // 더미 데이터 호출
  fetchPins(page)
  // axios 연결 함수 호출 - 20개씩 가져온다 - 20개씩 가져온게 photoData에 들어있음
  // getPhoto(`article/read?page=${page}&per_page=20`)
  // setPins(prev => [...prev, ...photoData])
}, [page])

const handleGoArticle = articleId => {
  navigate(`/article/${articleId}`);
};

// const [tempData, setTempData] = useState('');

// useEffect(() => {
//   const data = "blob:http://localhost:3000/215d2005-46ec-4e20-a739-a6f8f55b33cb";
//   const blob = new Blob([data], { type: 'image/jpeg' });

//   const reader = new FileReader();
//   reader.onload = () => {
//     const base64data = reader.result;
//     setTempData(base64data); // 이미지를 읽은 후에 tempData 상태를 업데이트
//     console.log(tempData)
//   };
//   reader.readAsDataURL(blob);
// }, [tempData]); // 컴포넌트가 마운트될 때만 실행

// 백엔드로부터 받아온 Blob 데이터
// const reader = new FileReader();
// reader.onload = () => {
//   const base64data = reader.result;
//   console.log(base64data)
// }
// const blobData = "blob:http://localhost:3000/592cbeb4-48e4-47f1-aa82-5bc814410de9" // 백엔드에서 받아온 Blob 데이터

// // Blob 객체 생성
// const blob = new Blob([blobData], { type: 'image/jpeg' }); // Blob 데이터와 MIME 타입을 지정합니다.
// reader.readAsDataURL(blob);
// // Blob 데이터를 가지고 Blob URL 생성
// const blobUrl = URL.createObjectURL(blob);

  // const data = "blob:http://localhost:3000/215d2005-46ec-4e20-a739-a6f8f55b33cb"
  // const blob = new Blob([data], { type: 'image/jpeg' })
  // var tempData = ''
  // const reader = new FileReader();
  // reader.onload = () => {
  //     const base64data = reader.result;
  //     console.log(base64data)
  //     tempData = base64data
  // }
  // console.log(tempData)
  // reader.readAsDataURL(blob)

return (
  <>
  {/* 홈포토파퓰러리스트 */}
  <div>
   </div>
    <Container>
      <Grid container spacing={1}>
        <BasicInfiScroll
          data={pins}
          renderItem={item => (
            // <PhotoGrid key={item.id} item xs={2}>
            //   <img src={`${item.img}?&w=200&h=200&fit=crop&auto=format`} alt="" />
            // </PhotoGrid>
             <PhotoGrid onClick={() => handleGoArticle(item.id)} key={item.id} item xs={2} >
              <img
                src={`${item.thumbnailPath}?&w=200&h=200&fit=crop&auto=format`}
                alt=""
                style={{ width: '200px', height: '200px', cursor: 'pointer' }}
              />
             </PhotoGrid>
          )}
          setPage={setPage}
          endOfListRef={pageEnd}
          hasMore={hasMore}
          loading={loading}
        />
      </Grid>
    </Container>
    <div ref={pageEnd}></div>
  </>
);
}


export default HomePhotoPopularList