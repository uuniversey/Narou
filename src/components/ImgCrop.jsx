import React from "react"
import userProfileStore from "../store/UserProfileStore"



const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */

export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0, imgName) {

  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2);
  // ctx.rotate(getRadianAngle(rotation)); // 자동 회전 들어가서 주석 처리
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

   // As Base64 string
  //  return canvas.toDataURL('image/png')

   // dataURL to file
  //  const convertDataUrlToFile = (name: string) => {
  //   const dataURL = canvasRef.current.toDataURL('image/png');
  //   const decodedURL = dataURL.replace(/^data:image\/\w+;base64,/, '');
  //   const buf = Buffer.from(decodedURL, 'base64');
  //   const blob = new Blob([buf], { type: 'image/png' });
  //   return new File([blob], `${name}.png`, { type: 'image/png' });
  // };


  //  As a blob
  // url 형식이 아닌 blob 그 자체 리턴
   return new Promise((resolve) => {
     canvas.toBlob((file) => {
      //  tempBlobBefore = file
      // resolve(URL.createObjectURL(file))
       resolve(file);
     }, "image/jpeg");
   });


    //  return new Promise((resolve) => {
    //    canvas.toBlob((file) => {
    //      resolve(file);
    //    }, "image/jpeg");
    //  });
  
    // fromData으로 줌
  //   return new Promise((resolve) => {
  //     canvas.toBlob((blob) => {
  //       const formData = new FormData();
  //        URL.revokeObjectURL(url);
  //       formData.append("profile_image", blob, imgName); // 파일 이름을 원본 이미지 파일의 이름으로 설정
  //       resolve(formData);
  //     }, "image/jpeg");
  //   });
 }