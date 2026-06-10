import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { useAppStore } from '@/store';
import './app.scss';

function App(props) {
  const initFromStorage = useAppStore((s) => s.initFromStorage);

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  useDidShow(() => {
    const { initialized, initFromStorage } = useAppStore.getState();
    if (!initialized) initFromStorage();
  });

  useDidHide(() => {});

  return props.children;
}

export default App;
