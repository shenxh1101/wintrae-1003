import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import EmptyState from '@/components/EmptyState';
import { publicationList, publicationCategoryList } from '@/data/publications';
import { Publication } from '@/types';

const PublicPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredPublications = useMemo(() => {
    if (activeCategory === 'all') return publicationList;
    return publicationList.filter((pub) => pub.category === activeCategory);
  }, [activeCategory]);

  const handlePublicationClick = (pub: Publication) => {
    Taro.navigateTo({
      url: `/pages/public-detail/index?id=${pub.id}`
    });
  };

  const getCategoryTagType = (category: string): 'primary' | 'info' | 'warning' | 'success' => {
    const typeMap: Record<string, 'primary' | 'info' | 'warning' | 'success'> = {
      notice: 'info',
      meeting: 'primary',
      fund: 'warning',
      policy: 'success'
    };
    return typeMap[category] || 'primary';
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  React.useEffect(() => {
    if (refreshing) {
      handleRefresh();
    }
  }, [refreshing]);

  return (
    <ScrollView
      className={styles.publicPage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={() => setRefreshing(true)}
    >
      <View className={styles.categoryTabs}>
        <ScrollView
          className={styles.tabsScroll}
          scrollX
          showScrollbar={false}
        >
          {publicationCategoryList.map((category) => (
            <View
              key={category.value}
              className={`${styles.tabItem} ${activeCategory === category.value ? styles.tabActive : ''}`}
              onClick={() => setActiveCategory(category.value)}
            >
              <Text>{category.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.listSection}>
        {filteredPublications.length > 0 ? (
          filteredPublications.map((pub) => (
            <View
              key={pub.id}
              className={styles.publicCard}
              onClick={() => handlePublicationClick(pub)}
            >
              <View className={styles.cardHeader}>
                <View className={styles.categoryTag}>
                  <Tag
                    text={publicationCategoryList.find((c) => c.value === pub.category)?.label || '通知'}
                    type={getCategoryTagType(pub.category)}
                    size="small"
                  />
                </View>
                <Text className={styles.publicTitle}>{pub.title}</Text>
              </View>
              <View className={styles.cardBody}>
                <Text className={styles.publicDesc}>{pub.content}</Text>
              </View>
              <View className={styles.cardFooter}>
                <View className={styles.footerLeft}>
                  <View className={styles.footerItem}>
                    <Text className={styles.footerIcon}>👤</Text>
                    <Text>{pub.publisher}</Text>
                  </View>
                  <View className={styles.footerItem}>
                    <Text className={styles.footerIcon}>👁️</Text>
                    <Text>{pub.views}</Text>
                  </View>
                </View>
                <Text className={styles.publishTime}>{pub.publishTime}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyWrap}>
            <EmptyState text="暂无公示信息" />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PublicPage;
