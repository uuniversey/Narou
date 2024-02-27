import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { Place } from '@mui/icons-material';
import { TextField, InputAdornment, Button, Container, Grid } from '@mui/material';
import ModalMap from "./ModalMap";
import ImgUpload from "./ImgUpload";
import useMapsStore from "../store/MapStore";
import useCreateStore from "../store/CreateStore";

const StyledForm = styled.form`
  width: 100%;
  display: inline-flex;
  justify-content: center;
  justify-content: space-around;
  align-items: center;
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const PlaceTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 10px;
`;

const ContentTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 10px;
  margin-top: 15px;
  margin-bottom: 10px;
`;

const StyledButton = styled(Button)`
  display: flex;
  margin-top: auto;
  margin-left: auto;
  color: #497cff;
`;

const CreateForm = (props) => {
  const { handlePostCreated, handleCloseModal } = props;
  const [content, setContent] = useState('');
  const [imgData, setImgData] = useState('');
  const [imgName, setImgName] = useState('');
  const [mapTempData, setMapTempData] = useState(null);
  const { selectedMarkerItem, setSelectedMarkerItem, mapData, setMapData } = useMapsStore();
  const { setCroppedImage } = useCreateStore()
  const [error, setError] = useState('');

  const createMyPost = () => {
    console.log(`imgData: ${imgData}`)
    if (!selectedMarkerItem) {
      setError('장소를 선택해 주세요!');
      return;
    }

    if (!imgData) {
      setError('사진을 첨부해 주세요!');
      return;
    }

    setError('');
    handlePostCreated({ content, imgData, imgName, mapTempData, mapData });
    handleCloseModal();
    // console.log("포스트 버튼 클릭시 맵 인포 추가", mapTempData);
    setMapData(mapTempData);
    setSelectedMarkerItem(null)
    setCroppedImage(null)
  };

  const inputContent = (event) => {
    setContent(event.target.value);
  };
  
  const handleImgData = (imgData, imgName) => {
    setImgData(imgData);
    setImgName(imgName)
  };
  

  const handleMapTempData = (selectedMarkerInfo) => {
    // console.log(selectedMarkerInfo);
    setMapTempData(selectedMarkerInfo);
    // console.log("전달받은 임시 맵 인포", mapTempData);
  };

  return (
    <StyledForm>
      <ContentContainer>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <ModalMap handleMapTempData={handleMapTempData} />
            </Grid>
            <Grid item xs={4}>

              <PlaceTextField
                id="input-with-icon-textfield"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Place /> {selectedMarkerItem && selectedMarkerItem.place_name}
                    </InputAdornment>
                  ),
                }}
                variant="standard"
                style={{
                  // width: "300px",
                  marginBottom: "10px",
                }}
                error={!!error}
                // helperText={error}
              />
              
              <ImgUpload handleImg={handleImgData} />
              
              <ContentTextField
                onChange={inputContent}
                id="outlined-multiline-static"
                label="내용"
                multiline
                rows={4}
                placeholder="문구를 입력해 주세요..."
                error={false}
                helperText={false}
              />

            </Grid>
          </Grid>

          <StyledButton
            onClick={createMyPost}
            variant="outlined"
            size="small"
          >
            등록
          </StyledButton>
        </Container>
      </ContentContainer>
    </StyledForm>
  );
};

export default CreateForm;