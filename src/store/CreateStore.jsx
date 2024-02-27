import { create } from 'zustand'
import axios from '../axios.js'

// get 함수를 매개 변수로 전달
const useCreateStore = create((set, get) => {
  const articleId = null

  const defaultValues = {
    days: '',
    depatureDate: {},
    arriveDate: {},
    headcount: '',
    title: '',
    tags: [],
    
    

    // 크롭한 이미지 변수 추가
    croppedImage: null, 
    // 프로필 크롭한 이미지 변수 추가
    profileCropImage: null,
    // 게시물 크롭인지 프로필 크롭인지 구분을 위한 변수 추가
    profileImage: false,
    
    // 발행 시 전체 게시글을 넘기기 위한 변수
    wholePost: {},
  }

  // 대표 사진과 관련된 상태 추가
  // 배열의 길이는 defaultValues.days 값에 따라 설정
  // 각 요소의 초기값은 null
  // 각 요소는 특정 탭에 해당하는 대표 사진의 인덱스를 나타냄
  const mainImages = Array.from({ length: defaultValues.days }, () => null);

  return {
    ...defaultValues,
    mainImages,

    setDepatureDate: (value) => set({ depatureDate: value }),
    setArriveDate: (value) => set({ arriveDate: value }),
    setHeadcount: (value) => set({ headcount: value }),
    setTitle: (value) => set({ title: value }),
    setTags: (value) => set({ tags: value }),
    // setTags: (value) => set((state) => ({ tags:  })),
    
    // setMainImage 함수는 현재 선택된 탭과 포스트에 대한 메인 이미지를 설정
    setMainImage: (tabIndex, postIndex) => {
      set((state) => {
        // 현재 상태에서 mainImages 배열을 복사
        const updatedMainImages = [...state.mainImages];

        // 주어진 tabIndex에 해당하는 탭의 mainImages 값을 선택된 postIndex로 업데이트
        updatedMainImages[tabIndex] = postIndex;

        // 새로 업데이트된 mainImages 배열을 포함하는 객체를 반환하여 상태를 갱신합니다.
        console.log('이것은 메인 이미지이다!!!!!!!!!!!!11', updatedMainImages)
        return { mainImages: updatedMainImages };
      });
    },
    
    // 게시물 크롭 이미지
    setCroppedImage: (value) => set({ croppedImage: value }),
    // 프로필 크롭 이미지
    setProfileCropImage: (value) => set({ profileCropImage: value }),
    // 프로필 크롭 이미지인지 게시물 크롭이미지인지 구분을 위함
    setProfileImage: (value) => set({ profileImage: value }),
    // 발행 시 전체 게시글을 넘기기 위한 변수
    setWholePost: (value) => set({ wholePost: value }),

    addFeed: (feed) => {
      set((state) => ({ feeds: [...state.feeds, feed] }));
    }, // 피드 정보 추가
   

    // 데이터를 서버에 전송
   // 데이터를 서버에 전송
   publishData: async (userId) => {
    const wholePost = get().wholePost;
    console.log("Whole Post:", wholePost)
    console.log(mainImages)
    try {
      // const formDataArray = [];
  
      // // 게시물 데이터에서 이미지 데이터만 추출하여 FormData로 변환
      // wholePost.feeds.forEach((feed) => {
      //   const formData = new FormData()
      //   feed.filePath.forEach((value, key) => {
      //     formData.append(key, value);
      //   });
      //   formData.append('nthDay', feed.nthDay)
      //   formData.append('sequence', feed.sequence)
      //   formData.append('content', feed.content)
      //   formData.append('latitude', feed.latitude)
      //   formData.append('longitude', feed.longitude)
      //   formData.append('location', feed.location)
      //   formDataArray.push(formData);
      // });

      // const finalWholeData = {
      //   'memberId': 2,
      //   'title': wholePost.title,
      //   'tagNames': wholePost.tagNames,
      //   'feeds': formDataArray,
      //   'thumbnailPath': wholePost.thumbnailPath,
      //   'startDate': wholePost.startDate,
      //   'endDate': wholePost.endDate,
      //   'peopleNumber': wholePost.peopleNumber,
      // }

      // console.log(finalWholeData)
      
      // const finalWholeData = new FormData()
      // wholePost.thumbnailPath.forEach((value, key) => {
      //   finalWholeData.append(key, value);
      // });
      // finalWholeData.append('memberId', 2)
      // finalWholeData.append('title', wholePost.title)
      // finalWholeData.append('tagNames', wholePost.tagNames)
      // // finalWholeData.append('feeds', formDataArray)
      // finalWholeData.append('startDate', wholePost.startDate)
      // finalWholeData.append('endDate', wholePost.endDate)
      // finalWholeData.append('peopleNumber', wholePost.peopleNumber)

      //    // formDataArray의 각 요소의 내용을 콘솔에 출력
      //    formDataArray.forEach((formData, index) => {
      //     formData.forEach((value, key) => {
      //       finalWholeData.append(`feeds`, value);
      //     });
      //   });
        
      //   // finalWholeData 확인
      //   for (const pair of finalWholeData.entries()) {
      //     console.log(pair[0], pair[1]);
      //   }
     
        // const jsonFeeds = JSON.stringify(wholePost.feeds.map(feed => ({
        //   nthDay: feed.nthDay,
        //   sequence: feed.sequence,
        //   content: feed.content,
        //   latitude: feed.latitude,
        //   longitude: feed.longitude,
        //   address: feed.address,
        //   location: feed.location
        // })))

        const jsonNameTags = wholePost.tagNames.map(tag => tag).join(', ');

        const jsonArticle = JSON.stringify({
          // 'memberId': wholePost.memberId,
          'memberId': wholePost.memberId,
          'title': wholePost.title,
          'tagNames': wholePost.tagNames,
          'feeds': wholePost.feeds,
          // 'thumbnailPath': mainImagePath ? mainImagePath : imgData,
          'startDate': wholePost.startDate,
          'endDate': wholePost.endDate,
          'peopleNumber': wholePost.peopleNumber
        })

      // const jsonFiles = JSON.stringify({
        
      // })

      const formData = new FormData()
        formData.append('article', jsonArticle)
        formData.append('thumbnail', wholePost.thumbnailPath, "thumbnail.png");
      
        console.log(wholePost.feeds)
      wholePost.feeds.forEach(feed => {
        console.log(feed)
        formData.append('files', feed.filePath, "feed.png");
      });

      console.log(...formData)
  
      // FormData 배열을 서버에 전송
      const response = await axios.put('article/write', formData, {
        headers: {
          // Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const newArticleId = response.data.data;
      set('articleId', newArticleId)
      
      console.log('글이 성공적으로 등록되었습니다.', response.data);
      
    } catch (error) {
      console.error('글 등록 중 오류가 발생했습니다.', error);
    }
  }

  };
});

export default useCreateStore;