import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface SectionTitleProps {
  title: string;
  extra?: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, extra }) => {
  return (
    <View className={styles.sectionTitle}>
      <View className={styles.titleBar}>
        <View className={styles.titleDot}></View>
        <Text className={styles.titleText}>{title}</Text>
      </View>
      {extra && <View className={styles.extra}>{extra}</View>}
    </View>
  );
};

export default SectionTitle;
