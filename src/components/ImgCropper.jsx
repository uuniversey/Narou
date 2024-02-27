import React, { useCallback, useState } from 'react';
import { styled } from '@mui/system';
import Cropper from 'react-easy-crop';
import { Button, Slider } from '@mui/material';
import useCreateStore from '../store/CreateStore';
import getCroppedImg from "./ImgCrop";

const TopDiv = styled('div')`
  /* display: flex;
  flex-direction: column; */
`

const CropContainer = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 80px;
`;

const ControlsContainer = styled('div')`
  position: absolute;
  bottom: 20px;
  left: 50%;
  width: 50%;
  transform: translateX(-50%);
  height: 40px;
  display: flex;
  align-items: center;
  &:hover input[type='range']::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px 8px rgba(63, 81, 181, 0.16);
    border-radius: 50%;
  }
  &:hover input[type='range']::-moz-range-thumb {
    box-shadow: 0px 0px 0px 8px rgba(63, 81, 181, 0.16);
  }
`

const ZoomSlider = styled(Slider)`
`;

const SaveButton = styled(Button)`
  display: flex;
  margin-top: auto;
  margin-left: auto;;
  background-color: #497cff;
  &:hover {
    background-color: white;
    color: #497cff;
  }
`;


function ImgCropper({ handleCloseModal, onImgCrop, imgData, imgName }) {
  // 크롭 관련 상태 관리
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const { setCroppedImage, setProfileCropImage, profileImage } = useCreateStore()

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    // console.log(croppedAreaPixels)
    setCroppedAreaPixels(croppedAreaPixels)
  };

  // 모달에서 리사이징을 완료하고 저장시 실행
  // 1. 모달창 닫고,  2. 크롭한 이미지 보여준다.
  const handleSave = useCallback(async () => {
    handleCloseModal();

    const croppedImgUrl = await getCroppedImg(
      imgData, 
      croppedAreaPixels, 
      zoom,
      imgName
      )
      console.log("ImgCropper - croppedImgUrl:", croppedImgUrl);
      
      // 크롭 이미지 저장
      profileImage ? (
        setProfileCropImage(croppedImgUrl)
        ) : (
        setCroppedImage(croppedImgUrl)
        )

      onImgCrop(croppedImgUrl) // 크롭된 이미지 URL을 onImgCrop을 통해 전달
  }, [croppedAreaPixels, zoom])

  return (
      <TopDiv>
        <CropContainer>
          <Cropper
            image={imgData}
            crop={crop}
            zoom={zoom}
            aspect={3 / 3}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </CropContainer>
        <ControlsContainer>
          <ZoomSlider
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => {
              setZoom(e.target.value);
            }}
          />
        </ControlsContainer>
        <SaveButton variant="contained" onClick={handleSave}>
          저장
        </SaveButton>
      </TopDiv>
    );
  }

  export default ImgCropper