import { useWindowDimensions } from 'react-native';

export const getBreakpoint = (width) => {
  const isPhone = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const isDesktop = width >= 1024;
  const isTabletUp = width >= 600;
  
  let numCols = 2;
  if (width >= 1400) numCols = 6;
  else if (width >= 1100) numCols = 5;
  else if (width >= 600) numCols = 4;
  else if (width >= 420) numCols = 3;
  
  return { width, isPhone, isTablet, isDesktop, isTabletUp, numCols };
};

export const useBP = () => {
  const { width, height } = useWindowDimensions();
  return { ...getBreakpoint(width), height };
};
