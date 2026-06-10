import React, { useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { useAppStore } from '@/store';
import './app.scss';

function App(props) {
  const initFromStorage = useAppStore((s) => s.initFromStorage);
  const initialized = useAppStore((s) => s.initialized);

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  useDidShow(() => {
    const { initialized, initFromStorage } = useAppStore.getState();
    if (!initialized) initFromStorage();
  });

  useDidHide(() => {});

  if (!initialized) {
    return (
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Text style={{ fontSize: '28rpx', color: '#86909C' }}>加载中...</Text>
      </View>
    );
  }

  return props.children;
}

export default App;
