import { useState, useEffect, useRef } from 'react';
import { LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';

export const useScrollIndicator = () => {
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
  };

  useEffect(() => {
    const isScrollable = contentHeight > scrollViewHeight;
    setShowScrollIndicator(isScrollable);
  }, [contentHeight, scrollViewHeight]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    
    if (isAtBottom) {
      setShowScrollIndicator(false);
    } else if (contentHeight > scrollViewHeight) {
      setShowScrollIndicator(true);
    }
  };

  return {
    scrollViewRef,
    showScrollIndicator,
    handleLayout,
    handleContentSizeChange,
    handleScroll,
  };
}; 