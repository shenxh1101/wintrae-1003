import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import EmptyState from '@/components/EmptyState';
import { publicationCategoryList } from '@/data/publications';
import { Publication } from '@/types';
import { useAppStore } from '@/store';

const STATUS_TABS = [
  { label: '全部', value: 'all' },
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' }
];

const PublicPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const publications = useAppStore((s) => s.publications);

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const categoryMatch = activeCategory === 'all' || pub.category === activeCategory;
      const statusMatch = activeStatus === 'all'
        ? true
        : activeStatus === 'published'
          ? pub.status === 'published'
          : pub.status === 'draft';
      return categoryMatch && statusMatch;
    });
  }, [activeCategory, activeStatus, publications]);

  const handlePublicationClick = (pub: Publication) => {
    const url = pub.status === 'draft'
      ? `/pages/public-edit/index?id=${pub.id}`
      : `/pages/public-detail/index?id=${pub.id}`;
    Taro.navigateTo({ url });
  };

  const handleAddClick = () => {
    Taro.navigateTo({
      url: '/pages/public-edit/index'
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

  const getStatusBadgeClass = (status: string) => {
    return status === 'published' ? styles.statusPublished : styles.statusDraft;
  };

  const getStatusText = (status: string) => {
    return status === 'published' ? '已发布' : '草稿';
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

      <View className={styles.statusTabs}>
        {STATUS_TABS.map((tab) => (
          <View
            key={tab.value}
            className={`${styles.statusTabItem} ${activeStatus === tab.value ? styles.statusTabActive : ''}`}
            onClick={() => setActiveStatus(tab.value)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
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
                <View className={`${styles.statusBadge} ${getStatusBadgeClass(pub.status)}`}>
                  <Text>{getStatusText(pub.status)}</Text>
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
                <Text className={styles.publishTime}>{pub.status === 'draft' ? '未发布' : pub.publishTime}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyWrap}>
            <EmptyState text="暂无公示信息" />
          </View>
        )}
      </View>

      <View className={styles.fab} onClick={handleAddClick}>
        <Text className={styles.fabText}>+</Text>
      </View>
    </ScrollView>
  );
};

export default PublicPage;
