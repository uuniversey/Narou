import React, { useState, useRef, useEffect } from "react";
import { styled, Modal } from "@mui/material";
import ImgCropper from "./ImgCropper";
import useCreateStore from "../store/CreateStore";
import userProfileStore from "../store/UserProfileStore";

const ModalContainer = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  outline: none;
`;

function ImgUpload(props) {
  // props와 함께 croppedImg 상태를 관리합니다.
  const { userData } = userProfileStore()
  const { handleImg, profileStyle } = props;
  const [imgFile, setImgFile] = useState("");
  const [imgName, setImgName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ profileImg, setProfileImg ] = useState(userData.profileImage)
  const { croppedImage, profileCropImage, profileImage, setProfileImage } = useCreateStore();
  const { setTempFile } = userProfileStore()
  const imgRef = useRef();

  // 사진 첨부시
  // 이미지 파일 저장 -> 모달에 전달할 용도
  // 모달 오픈
  const saveImgFile = async (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setTempFile(file)
      let imageDataUrl = await readFile(file);

      // // apply rotation if needed
      // const orientation = await getOrientation(file);
      // const rotation = ORIENTATION_TO_ANGLE[orientation];
      // if (rotation) {
      //   imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
      // }

      console.log('profileStyle-----------------------', profileStyle)
      setImgFile(imageDataUrl);
      profileStyle && setProfileImage(true);
      setImgName(file.name);
      setIsModalOpen(true);
    }

  };

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }

  // const saveImgFile = (event) => {
  //   const reader = new FileReader();
  //   const file = event.target.files[0];

  //   if (file) {
  //     setIsModalOpen(true);
  //     reader.readAsDataURL(file);

  //     reader.onload = () => {
  //       setImgFile(reader.result);
  //       handleImg(reader.result);
  //     };
  //   }
  // };

  const handleCloseModal = () => {
    setImgFile("");
    setIsModalOpen(false);
    setProfileImage(false);
  };

  const handleImgCrop = (croppedImg) => {
    // console.log(`크롭된 이미지: ${croppedImg}`)
    // console.log(`원래 이미지: ${imgFile}`)
    setImgFile(croppedImg)

  };

  useEffect(() => {
    // console.log("ImgFile 상태 변경:", imgFile);
    
    // 등록버튼 눌렀을 때 부모인 createForm으로 이미지 전달하는 콜백함수
    // 원래는 handleImgCrop에 있었는데 적용이 안 돼서 useEffect에 넣음
    if (profileImage) {
      console.log("cropped 이미지 생성:", profileCropImage);
      handleImg({profileCropImage, imgName})
    
    } else {
      handleImg(croppedImage, imgName);
    }

}, [imgFile, croppedImage, profileCropImage, imgName]);

  return (
    <form>
      {/* 크롭된 이미지가 있다면 */}
          <label
            className="signup-profileImg-label"
            htmlFor="file"
            style={
              profileStyle
                ? {
                    ...profileStyle,
                    display: "block",
                    position: "relative",
                    backgroundColor: "lightgrey",
                    backgroundImage: `url(${profileCropImage ? URL.createObjectURL(profileCropImage) : profileImg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100%',
                  }
                : {
                    display: "block",
                    width: "288px",
                    height: "288px",
                    position: "relative",
                    backgroundColor: "lightgrey",
                    backgroundImage: `url(${croppedImage ? URL.createObjectURL(croppedImage) : '/images/icon/user.png'})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100%',
                  }
            }
          >
          <input
            type="file"
            accept="image/*"
            multiple
            id="file"
            onChange={saveImgFile}
            ref={imgRef}
            style={{
              display: "none",
            }}
          />
        </label>


      {/* 파일을 선택하면 이미지 리사이징할 모달창을 띄울거임 */}
      <Modal 
        open={isModalOpen} 
        onClose={handleCloseModal}>
          <ModalContainer style={{ width: "500px", height: "500px" }}>
            {/* <ImgCropper
              imgData={imgFile}
              handleCloseModal={handleCloseModal}
              onImgCrop={handleImgCrop}
            /> */}
            <ImgCropper
              imgData={imgFile}
              imgName={imgName}
              handleCloseModal={handleCloseModal}
              onImgCrop={handleImgCrop}
            />
        </ModalContainer>
      </Modal>

    </form>
  );
}

export default ImgUpload;
