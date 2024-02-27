import React, { useState, useRef } from "react"

import { upload } from "@testing-library/user-event/dist/upload"

import { Image } from '@mui/icons-material'


function UploadImg(props) {
    const { handleImg, profileStyle } = props
    
    const [imgFile, setImgFile] = useState("")
    const imgRef = useRef()

    // 이미지 업로드 input의 onChange
    const saveImgFile = () => {
        const file = imgRef.current.files[0]
        const reader = new FileReader()
        
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setImgFile(reader.result)
            handleImg(reader.result)
               };
        console.log(`imgData: ${imgFile}`)
    }

    return (
        <form>
            { imgFile
                ? <img
                    src={imgFile ? imgFile :`/images/icon/user.png`}
                    alt="이미지"
                    width={ "288px" }
                    height={ "288px" }
                    style={profileStyle}
                />

                : <label className="signup-profileImg-label" htmlFor="file" 
                        style={{
                            display: "block",
                            width: "288px",
                            height: "288px",
                            position: "relative",
                            backgroundColor: "lightgrey",
                            ...profileStyle,
                            }}
                            >
                        <Image 
                            color="disabled"
                            sx={{ fontSize: 100 }}
                            style={{ 
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)"
                            }}
                        />
                    <input
                        type="file"
                        multiple
                        id="file"
                        onChange={saveImgFile}
                        ref={imgRef}
                        style={{
                            display: "none"
                        }}
                    />
                </label>
            }
        </form>
    )

}

export default UploadImg