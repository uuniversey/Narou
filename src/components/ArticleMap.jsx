import React, { useEffect, useState } from 'react'

import useMapsStore from '../store/MapStore'
import useArticleStore from '../store/ArticleStore'

import marker1 from '../assets/images/mark1.png'
import marker2 from '../assets/images/mark2.png'
import marker3 from '../assets/images/mark3.png'
import marker4 from '../assets/images/mark4.png'
import marker5 from '../assets/images/mark5.png'
import marker6 from '../assets/images/mark6.png'
import marker7 from '../assets/images/mark7.png'
import { Box, Grid } from '@mui/material'

import BasicMap from './BasicMap'


const mapDivStyles = {
  width: '100%',
  height: '600px',
  border: '1px solid lightgrey',
};


function CreateMap() {
  const { getData } = useArticleStore()

  const mapData = getData ? [getData] : [];

  console.log(`articleMap의 mapData: ${mapData}`)

    return (
      <>
      <Grid item xs={12}>
          {/* <Box sx={{ border: 1, borderColor: 'grey.500', height: '100vh', borderRadius: '10px'}}> */}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                <BasicMap mapData={ mapData } style={mapDivStyles} />
              </Box>
          {/* </Box> */}
      </Grid>
    </>
    )
}

export default CreateMap