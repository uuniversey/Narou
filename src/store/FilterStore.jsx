import { create } from 'zustand'
import axios from '../axios.js'

const FilterStore = create((set) => ({

  isSelected: null,
  setIsSelected: (value) => set({ isSelected: value }),

  searchData: [],
  sendSearchData: (urls) => {
    console.log(urls, '나의 서치 데이터')
    return axios.get(urls)
    .then((response) => {
      console.log(response.data.data.content)
      set({ searchData: response.data.data.content })
    })
    .catch((error) => {
      console.log('서치데이터 보내기 실패', error)
    })
  },

  tempSearchData: null,
  setTempSearchData: (value) => set({ tempSearchData: value }),

}))

export default FilterStore