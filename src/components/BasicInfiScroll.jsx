import React, { useState, useEffect, useRef } from 'react';

function BasicInfiScroll({ data, renderItem, endOfListRef, setPage, hasMore, loading }) {
  // const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setPage(prev => prev + 1)
  };

  useEffect(() => {
    console.log(hasMore, loading)
    if (loading && hasMore) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            console.log('이게 왜 되니??')
            loadMore();
          }
        },
        { threshold: 1 }
      );
      observer.observe(endOfListRef.current)
      return () => {
        observer.disconnect()
      }
    }
  }, [loading, hasMore])

  // useEffect(() => {
  //   setLoading(true);
  // }, []);

  return (
    <>
      {data.map((item, index) => renderItem(item, index))}
      <div ref={endOfListRef} style={{ height: '10px', background: 'transparent' }} />
    </>
  );
}

export default BasicInfiScroll;