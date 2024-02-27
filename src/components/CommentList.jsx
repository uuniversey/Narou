import React, { useEffect } from "react";
import { styled } from '@mui/material'
import CommentListItem from "./CommentListItem";

import useCommentStore from "../store/CommentStore";

function CommentList({ articleId }) {
  const { getComments, comments, loading } = useCommentStore()

  useEffect(() => {
    const fetchData = async () => {
      await getComments(articleId);
    };

    if (!comments && !loading) {
      fetchData();
    }
  }, [articleId, comments, loading, getComments]);

  useEffect(() => {
    return () => {
      // comments 함수 호출이 아닌 comments 상태 초기화로 변경
      // comments([]);
    };
  }, []); // 빈 배열을 전달하여 처음 한 번만 실행되도록 설정

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {comments && comments.map((comment) => (
        <CommentListItem
          key={comment.commentId}
          comment={comment}
          articleId={articleId}
        />
      ))}
    </>
  );
}

export default CommentList;
