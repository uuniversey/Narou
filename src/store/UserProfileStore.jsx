import { create } from 'zustand'
import axios from '../axios.js'

const userProfileStore = create((set) => ({

  userData: [],
  userArticle: [],
  followList: [],
  followerList: [],
  scrapList: [],
  tempFile: null,
  setTempFile: (value) => set((prevState) => ({ tempFile: value })),

  getUserData: (userId, token) => {
    return axios.get(`users/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
      })
    .then((response) => {
      console.log('유저데이터 새로 받기', response.data.data)
      set({ userData: response.data.data })
    })
    .catch((error) => {
      console.log('유저 데이터 받아오기 실패', error)
    })
  },

  getUserArticle: (nickname) => {
    return axios.get(`article/search?nickname=${nickname}`)
    .then((response) => {
      console.log(response.data.data.content, '겟유저아티클정보')
      set({ userArticle: response.data.data.content })
    })
    .catch((error) => {
      console.log('유저 게시글 받아오기 실패', error)
    })
  },

  getScrapData: (userId) => {
    return axios.get(`article/scrap/list/${userId}`)
    .then((response) => {
      console.log('스크랩 데이터 받기 성공', response.data.data.content)
      set({ scrapList: response.data.data.content })
    })
    .catch((error) => {
      console.log('스크랩 데이터 받아오기 실패', error)
    })
  },

  userScrap: (articleId, token) => {
    return axios.post(`article/scrap/${articleId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
      })
    .then((response) => {
      console.log(response, '스크랩!')
    })
    .catch((error) => {
      console.log(`articleId: ${articleId}`)
      console.log('유저 스크랩 실패', error)
      console.log(`error 메세지 속 Token: ${token}`)
    })
  },

  userUnScrap: (articleId, token) => {
    return axios.post(`article/cancelscrap/${articleId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
      })
    .then((response) => {
      console.log(response, '언스크랩!')
    })
    .catch((error) => {
      console.log('유저 언스크랩 실패', error)
    })
  },

  userFollowing: (id, token) => {
    const data = {
      followed_id : id
    }
    return axios.post('users/follow', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
      })
    .then((response) => {
      console.log('유저 팔로잉 성공', response)
    })
    .catch((error) => {
      console.log('유저 팔로잉 실패', error)
    })
  },

  userUnFollow: (id, token) => {
    const data = {
      followed_id : id
    }
    return axios.post('users/unfollow', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
      })
    .then((response) => {
      console.log('유저 언팔로우 성공', response)
    })
    .catch((error) => {
      console.log('유저 언팔로잉 실패', error)
    })
  },

  getFollowList: (followerId) => {
    return axios.get(`users/profile/read/following/list/${followerId}`)
    .then((response) => {
      console.log('팔로우 리스트', response.data.data.userProfileList)
      set({ followList: response.data.data.userProfileList })
    })
    .catch((error) => {
      console.log('팔로우 리스트 받아오기 실패', error)
    })
  },

  getFollowerList: (userId) => {
    return axios.get(`users/profile/read/follower/list/${userId}`)
    .then((response) => {
      console.log('팔로워 리스트', response.data.data.userProfileList)
      set({ followerList: response.data.data.userProfileList })
    })
    .catch((error) => {
      console.log('팔로워 리스트 받아오기 실패', error)
    })
  },
  
  userIntroEdit: (profile_image, token) => {
    return axios.patch('users/profile/edit', profile_image, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data; charset=utf-8'
      }
      })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log('유저 소개 편집 실패', error)
    })
  },

}))

export default userProfileStore