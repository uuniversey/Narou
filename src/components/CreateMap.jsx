import React, { useEffect } from 'react'

import useMapsStore from '../store/MapStore'

import CreateMapAfter from './CreateMapAfter'
import CreateMapBefore from './CreateMapBefore'

function CreateMap() {

  const { mapData } = useMapsStore()

  useEffect(() => {
  
    console.log(mapData)
    return () => {
    }

  }, [mapData])
  

  return (
    <>
       {mapData ? (
                <CreateMapAfter datas={mapData} />
              ) : (
                <CreateMapBefore />
              )}
    </>
  )
}

export default CreateMap