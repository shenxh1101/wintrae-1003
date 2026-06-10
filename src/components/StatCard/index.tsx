import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, color = '#23C343' }) => {
  return (
    <View className={styles.statCard}>
      <View className={styles.statValue} style={{ color }}>
        <Text className={styles.valueText}>{value}</Text>
        {unit && <Text className={styles.unitText}>{unit}</Text>}
      </View>
      <Text className={styles.statTitle}>{title}</Text>
    </View>
  );
};

export default StatCard;
