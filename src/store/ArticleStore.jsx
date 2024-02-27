import { create } from 'zustand';
import axios from '../axios.js';

const useArticleStore = create((set, get) => {
  return { 
    getData: null,

    // 게시글 조회
    getArticle: async (articleId, token) => {
      try {
        const response = await axios.get(`article/read/${articleId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // 응답 데이터 확인
        // console.log(response.data);
        console.log(response.data.data);
        console.log(response.data.data.title)

        // 가져온 게시글 데이터 담기
        set({ getData: response.data.data })
        
      } catch (error) {
        // 에러 처리
        console.error('게시글 조회 중 오류 발생:', error);
      }
    },

    // 게시글 수정 (보류)

    // 게시글 삭제
    deleteArticle: async (articleId, token) => {
      try {
        const response = await axios.delete(`article/delete/${articleId}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
        // 응답 데이터 확인
        console.log(response.data);
      } catch (error) {
        // 에러 처리
        console.error('게시글 삭제 중 오류 발생:', error);
      }
    },

    postLike: (articleId, token) => {
      return axios.post(`article/like/${articleId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
        })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log('유저 라이크 실패', error)
      })
    },
  
    postUnlike: (articleId, token) => {
      return axios.post(`article/cancellike/${articleId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
        })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log('유저 언라이크 실패', error)
      })
    },
    
  };
});

export default useArticleStore;