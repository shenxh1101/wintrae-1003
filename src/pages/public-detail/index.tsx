import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { publicationList } from '@/data/publications';
import { Publication } from '@/types';

const PublicDetailPage: React.FC = () => {
  const router = useRouter();
  const [publication, setPublication] = useState<Publication | null>(null);

  useEffect(() => {
    const id = router.params.id;
    const found = publicationList.find((p) => p.id === id);
    if (found) {
      setPublication(found);
    }
  }, [router.params.id]);

  const getCategoryInfo = (category: string) => {
    const categoryMap: Record<string, { text: string; icon: string }> = {
      meeting: { text: '会议纪要', icon: '📋' },
      fund: { text: '资金使用', icon: '💰' },
      notice: { text: '通知公告', icon: '📢' },
      policy: { text: '政策解读', icon: '📜' }
    };
    return categoryMap[category] || { text: category, icon: '📄' };
  };

  if (!publication) {
    return (
      <View className={styles.detailPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const categoryInfo = getCategoryInfo(publication.category);

  return (
    <ScrollView className={styles.detailPage} scrollY>
      <View className={styles.headerSection}>
        <View className={styles.categoryTag}>
          <Text>{categoryInfo.icon} {categoryInfo.text}</Text>
        </View>
        <Text className={styles.titleText}>{publication.title}</Text>
        <View className={styles.metaRow}>
          <View className={styles.metaLeft}>
            <Text>👤 {publication.publisher}</Text>
          </View>
          <View className={styles.metaRight}>
            <Text>👁 {publication.views}</Text>
          </View>
        </View>
      </View>

      <View className={styles.contentCard}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📝</Text>
          公示内容
        </Text>
        <Text className={styles.contentText}>{publication.content}</Text>
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>ℹ️</Text>
          基本信息
        </Text>
        <View className={styles.infoList}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>发布单位</Text>
            <Text className={styles.infoValue}>{publication.publisher}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>发布时间</Text>
            <Text className={styles.infoValue}>{publication.publishTime}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>阅读量</Text>
            <Text className={styles.infoValue}>{publication.views} 次</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default PublicDetailPage;
