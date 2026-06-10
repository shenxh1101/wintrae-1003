import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

type TagType = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';

interface TagProps {
  text: string;
  type?: TagType;
  size?: 'small' | 'medium';
}

const Tag: React.FC<TagProps> = ({ text, type = 'default', size = 'small' }) => {
  const tagClass = [styles.tag, styles[type], styles[size]].join(' ');
  
  return (
    <View className={tagClass}>
      <Text className={styles.tagText}>{text}</Text>
    </View>
  );
};

export default Tag;
