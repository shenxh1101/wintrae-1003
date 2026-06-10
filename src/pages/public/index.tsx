import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import EmptyState from '@/components/EmptyState';
import { publicationCategoryList } from '@/data/publications';
import { Publication } from '@/types';
import { useAppStore } from '@/store';

type RoleMode = 'cadre' | 'public';

const CADRE_STATUS_TABS = [
  { label: '全部', value: 'all' },
  { label: '已发布', value: 'published' },
  { label: '草稿箱', value: 'draft' },
  { label: '已撤回', value: 'withdrawn' }
];

const PUBLIC_STATUS_TABS = [
  { label: '全部', value: 'all' },
  { label: '已发布', value: 'published' }
];

const PublicPage: React.FC = () => {
  const [roleMode, setRoleMode] = useState<RoleMode>('cadre');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const publications = useAppStore((s) => s.publications);

  useDidShow(() => {
    const mode = Taro.getStorageSync('public_role_mode');
    if (mode) {
      setRoleMode(mode);
    }
  });

  const statusTabs = roleMode === 'cadre' ? CADRE_STATUS_TABS : PUBLIC_STATUS_TABS;

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const categoryMatch = activeCategory === 'all' || pub.category === activeCategory;

      let statusMatch = true;
      if (activeStatus !== 'all') {
        statusMatch = pub.status === activeStatus;
      } else if (roleMode === 'public') {
        statusMatch = pub.status === 'published';
      }

      return categoryMatch && statusMatch;
    });
  }, [activeCategory, activeStatus, publications, roleMode]);

  const handleRoleChange = (mode: RoleMode) => {
    setRoleMode(mode);
    setActiveStatus('all');
    Taro.setStorageSync('public_role_mode', mode);
  };

  const handlePublicationClick = (pub: Publication) => {
    if (roleMode === 'public' || pub.status === 'published') {
      Taro.navigateTo({
        url: `/pages/public-detail/index?id=${pub.id}`
      });
    } else {
      Taro.navigateTo({
        url: `/pages/public-edit/index?id=${pub.id}`
      });
    }
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
    switch (status) {
      case 'published':
        return styles.statusPublished;
      case 'draft':
        return styles.statusDraft;
      case 'withdrawn':
        return styles.statusWithdrawn;
      default:
        return styles.statusDraft;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      case 'withdrawn':
        return '已撤回';
      default:
        return '草稿';
    }
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
      <View className={styles.roleSwitch}>
        <View
          className={`${styles.roleTab} ${roleMode === 'cadre' ? styles.roleTabActive : ''}`}
          onClick={() => handleRoleChange('cadre')}
        >
          <Text className={styles.roleIcon}>👨‍💼</Text>
          <Text className={styles.roleText}>村干部工作台</Text>
        </View>
        <View
          className={`${styles.roleTab} ${roleMode === 'public' ? styles.roleTabActive : ''}`}
          onClick={() => handleRoleChange('public')}
        >
          <Text className={styles.roleIcon}>👥</Text>
          <Text className={styles.roleText}>群众浏览</Text>
        </View>
      </View>

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
        {statusTabs.map((tab) => (
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
                <Text className={styles.publishTime}>
                  {pub.status === 'draft' ? '未发布' : pub.publishTime || '未发布'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyWrap}>
            <EmptyState text={roleMode === 'public' ? '暂无公示信息' : '暂无相关公示'} />
          </View>
        )}
      </View>

      {roleMode === 'cadre' && (
        <View className={styles.fab} onClick={handleAddClick}>
          <Text className={styles.fabText}>+</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default PublicPage;
