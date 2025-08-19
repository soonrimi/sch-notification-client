const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const getWindowDimensions = () => {
  if (typeof window === 'undefined') {
    // 서버사이드 렌더링 시 안전하게 처리
    return { width: guidelineBaseWidth, height: guidelineBaseHeight };
  }
  return { width: window.innerWidth, height: window.innerHeight };
};

const scale = (size: number) => {
  const { width } = getWindowDimensions();
  return (width / guidelineBaseWidth) * size;
};

const verticalScale = (size: number) => {
  const { height } = getWindowDimensions();
  return (height / guidelineBaseHeight) * size;
};

const moderateScale = (size: number, factor: number = 0.5) => {
  return size + (scale(size) - size) * factor;
};

export { scale, verticalScale, moderateScale };
