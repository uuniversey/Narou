import React from "react";

import { styled } from '@mui/system';

const MyFooter = styled("div")`
    margin-top: 50px;
    padding: 30px;
    bottom: 0px;
    position: relative;
    font-size: small;
    max-width: 100%;
    height: 100%;
    background-color:#f1f5ff;
`
const CompanyName = styled("p")`
    font-weight: bolder;
`

function Footer() {
    return (
        <MyFooter>
          <CompanyName>(주)NAROU</CompanyName>
          대표: 김갤럭시 | 사업자등록번호: 202-31-12411 | 통신판매업신고: 2023-서울강남-1124 <br />
          E-mail: hello@narou.com | 주소: 서울특별시 강남구 역삼동 테헤란로 212 멀티캠퍼스 <br />
          나만의 루트를 찾아라, NAROU! <br />
        </MyFooter>
    )
}
export default Footer