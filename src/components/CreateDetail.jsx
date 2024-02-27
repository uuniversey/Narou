import React, { useEffect, useState } from "react"
import { format } from 'date-fns'

import { TabContext, TabPanel } from "@mui/lab"
import { Box, Button, Fab, Modal, Tabs, Tab, Zoom, Grid } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import styled from "@emotion/styled"

import useCreateStore from "../store/CreateStore"
import useMapsStore from "../store/MapStore"
import userInfoStore from "../store/LoginStore"

import CreateForm from "./CreateForm"
import CreateList from "./CreateList"
import CreateMainImg from "./CreateMainImg"
import CreateMap from "./CreateMap"

// 탭 관련 스타일
const TopContainer = styled("div")`
  border: 1px solid lightgray;
  width: 100%;
  min-height: 785.5px;
  margin-bottom: 50px;
  overflow: auto;
`

const CustomTabContext = styled(TabContext)`
  width: 50%;
  border: 1px solid black;
`

const TabPanelContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`

// 모달 관련 스타일
const AddFab = styled(Fab)`
  margin-bottom: 10px;
  background-color: white;
  color: #497cff;
  &:hover {
    background-color: #497cff;
    color: white;
  }
`

const CustomModal = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1000px;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 2px solid #000;
  box-shadow: 24px;
  padding-top: 40px;
  padding-bottom: 20px;
  padding-left: 16px;
  padding-right: 16px;
`

// 여행 기간 계산하는 함수
function calculateTravelDuration(depatureDate, arriveDate) {
  const timeDifference = arriveDate.$d.getTime() - depatureDate.$d.getTime()
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

  return {
    nights: daysDifference,
    days: daysDifference + 1,
  }
}

function CreateDetail() {

  const { userInfo } = userInfoStore()
  const { depatureDate, arriveDate, setDepatureDate, setArriveDate, headcount, title, tags, mainImages, setMainImage, wholePost, setWholePost } = useCreateStore()
  const { setMapCreateDay, setMapData } = useMapsStore()

  const { nights, days } = calculateTravelDuration(depatureDate, arriveDate)
  const [openModal, setOpenModal] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const [myPosts, setMyPosts] = useState(Array.from({ length: days }, () => []))
  const [publishPosts, setPublishPosts] = useState([])
  const [mainImagePath, setMainImagePath] = useState("")

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const handlePostCreated = ({ content, imgData, mapTempData, imgName }) => {
    const newPost = {
      'nthDay': mapTempData.day,
      'sequence': myPosts[currentTab].length+1,
      'content': content,
      'latitude': mapTempData.lat,
      'longitude': mapTempData.lng,
      'address': mapTempData.address_name,
      'location': mapTempData.place_name,
      'filePath': imgData,
      'fileName': imgName,
      // 'filePath': "",
      'fileType': '',
    }
    setMyPosts((prevPosts) => {
      const updatedPosts = [...prevPosts]
      // console.log("등록시 전달되는 updatePosts", updatedPosts)
      updatedPosts[currentTab] = [...updatedPosts[currentTab], newPost]
      return updatedPosts
    })
    console.log("등록시 전달되는 myPost", myPosts)

    setPublishPosts((prevPosts) => {
      const updatedPosts = [...prevPosts, newPost]
      return updatedPosts
    })
    console.log("등록시 전달되는 publishPost", publishPosts)

    const tempWholePost = {
      'memberId': userInfo.userId,
      'title': title,
      'tagNames': tags,
      'feeds': [...publishPosts, newPost],
      'thumbnailPath': mainImagePath ? mainImagePath : imgData,
      'startDate': format(depatureDate.$d, 'yyyy-MM-dd'),
      'endDate': format(arriveDate.$d, 'yyyy-MM-dd'),
      'peopleNumber': headcount,
    }
  
    setWholePost(tempWholePost)
    console.log('^^^^^^^^^^^^^^^', wholePost)
    
  }

  useEffect(() => {
  
    return () => {
      setMapData(null)
    }

  }, [])
  

  const handleMainImageChange = (postIndex) => {
    console.log("대표 사진 설정 완료❤")
    console.log(setMainImage)
    setMainImage(currentTab, postIndex)
  }

  return (
    <>
      {/* {`여행 기간: ${format(depatureDate.$d, 'yyyy-MM-dd')} ~ ${format(arriveDate.$d, 'yyyy-MM-dd')}, ${days}일 ${nights}박 ${days}일`} */}
      <Grid container justifyContent="space-between" spacing={5}>
        {/* 맵 자리 */}
        <Grid item xs={5}>
          <CreateMap />
          {/* <br /> */}
          <CreateMainImg 
            myPosts={myPosts} 
            handleMainImageChange={handleMainImageChange}
          />
        </Grid>

        {/* 게시글 자리 */}
        <Grid item xs={7}>
          <TopContainer>
            <CustomTabContext value={currentTab.toString()}>
              <Tabs
                value={currentTab.toString()}
                onChange={(event, newValue) => {
                  setCurrentTab(Number(newValue))
                  setMapCreateDay(Number(newValue) + 1)
                }}
              >
                {Array.from({ length: days }, (_, index) => (
                  <Tab key={index} label={`${index + 1}일`} value={index.toString()} />
                ))}
              </Tabs>

              {Array.from({ length: days }, (_, index) => (
                <TabPanel key={index} value={index.toString()}>
                  <TabPanelContainer>
                    <Zoom in={true}>
                      <AddFab
                        aria-label="add"
                        size="small"
                        onClick={handleOpenModal}
                      >
                        <AddIcon />
                      </AddFab>
                    </Zoom>

                    {/* 모달 등장 */}
                    <Modal
                      open={openModal}
                      onClose={handleCloseModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <CustomModal>
                        <CreateForm
                          handlePostCreated={handlePostCreated}
                          handleCloseModal={handleCloseModal}
                        />
                      </CustomModal>
                    </Modal>

                    <CreateList 
                      myPosts={myPosts} 
                      handleOpenModal={handleOpenModal} 
                      currentTab={currentTab} 
                    />

                  </TabPanelContainer>
                </TabPanel>
              ))}
            </CustomTabContext>
          </TopContainer>         
        </Grid>
      </Grid>
    </>
  )
}

export default CreateDetail
