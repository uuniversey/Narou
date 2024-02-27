import { create } from 'zustand';
import axios from '../axios.js';

const useCommentStore = create((set, get) => {

  return {
    comments: [], // 댓글 목록을 저장하는 배열

    // 댓글 작성
    postComment: async (commentData, token) => {
      try {
        const response = await axios.post(`/comment/write/${commentData.articleId}`, commentData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // 서버로부터 응답을 받은 후 댓글 목록을 업데이트
        set((state) => ({ comments: [...state.comments, response.data] }));
        // set((state) => {
        //   console.log('이전 상태:', state);
        //   const newComments = [...state.comments, response.data];
        //   console.log('새로운 댓글 목록:', newComments);
        //   return { comments: newComments };
        // });
        console.log("댓글 전송 성공:", response.data);
      } catch (error) {
        // 에러 처리
        console.error("댓글 전송 에러:", error);
      }
    },

    // 댓글 조회
    comments: null,
    loading: false, // 로딩 상태 추가
    getComments: async (articleId) => {
      try {
        set({ loading: true }); // 로딩 시작
        const response = await axios.get(`/comment/read/${articleId}`);
        set({ comments: response.data, loading: false }); // 로딩 완료
      } catch (error) {
        console.error("댓글 조회 중 에러:", error);
        set({ loading: false }); // 에러 발생 시 로딩 완료
      }
    },


    // 댓글 수정
    updateComment: async (commentData, token) => {
      try {
        console.log("댓글 수정 요청 시작!");
        const response = await axios.put(`/comment/modify/${commentData.commentId}`, commentData, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      console.log("댓글 수정 응답:", response.data); // 추가된 로그
      // 기존 comments 배열에서 수정된 댓글을 찾아서 업데이트
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment.commentId === commentData.commentId ? response.data : comment
        ),
      }));
      } catch (error) {
        // 에러 처리
        console.error("댓글 수정 중 에러:", error);
      }
    },

    // 댓글 삭제
    deleteComment: async (commentData, token) => {
      try {
          console.log('axios 요청 전:', commentData, token);
          // 서버로 삭제 요청을 보내는 부분
          const response = await axios.delete(`/comment/delete/${commentData.commentId}`, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
          // 성공적으로 삭제되었다면 상태 업데이트
          set((state) => ({
              comments: state.comments.filter(comment => comment.commentId !== commentData.commentId)
          }));
          console.log("댓글 삭제 요청 성공");
      } catch (error) {
          console.error("댓글 삭제 중 에러:", error);
      }
    },


  };
});

export default useCommentStore;
