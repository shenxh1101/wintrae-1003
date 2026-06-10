import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { Publication } from '@/types';
import { useAppStore } from '@/store';

const PublicDetailPage: React.FC = () => {
  const router = useRouter();
  const store = useAppStore();
  const [publication, setPublication] = useState<Publication | null>(null);

  useEffect(() => {
    const id = router.params.id;
    const found = store.getPublication(id);
    if (found) {
      setPublication(found);
    }
  }, [router.params.id, store]);

  const handleEditClick = () => {
    if (publication) {
      Taro.navigateTo({
        url: `/pages/public-edit/index?id=${publication.id}`
      });
    }
  };

  const handleWithdrawClick = () => {
    if (!publication) return;
    Taro.showModal({
      title: '确认撤回',
      content: '撤回后该公示将变为草稿状态，是否继续？',
      success: (res) => {
        if (res.confirm) {
          store.withdrawPublication(publication.id);
          Taro.showToast({ title: '已撤回', icon: 'success' });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1000);
        }
      }
    });
  };

  const handlePublishClick = () => {
    if (!publication) return;
    Taro.showModal({
      title: '确认发布',
      content: '发布后该公示将对外公开，是否继续？',
      success: (res) => {
        if (res.confirm) {
          store.publishPublication(publication.id);
          const updated = store.getPublication(publication.id);
          if (updated) {
            setPublication(updated);
          }
          Taro.showToast({ title: '已发布', icon: 'success' });
        }
      }
    });
  };

  const getCategoryInfo = (category: string) => {
    const categoryMap: Record<string, { text: string; icon: string }> = {
      meeting: { text: '会议纪要', icon: '📋' },
      fund: { text: '资金使用', icon: '💰' },
      notice: { text: '通知公告', icon: '📢' },
      policy: { text: '政策解读', icon: '📜' }
    };
    return categoryMap[category] || { text: category, icon: '📄' };
  };

  const getStatusBadgeClass = (status: string) => {
    return status === 'published' ? styles.statusPublished : styles.statusDraft;
  };

  const getStatusText = (status: string) => {
    return status === 'published' ? '已发布' : '草稿';
  };

  const getPublishTimeText = (pub: Publication) => {
    if (pub.status === 'draft') {
      return '未发布';
    }
    return pub.publishTime || '未发布';
  };

  if (!publication) {
    return (
      <View className={styles.detailPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const categoryInfo = getCategoryInfo(publication.category);
  const isPublished = publication.status === 'published';

  return (
    <ScrollView className={styles.detailPage} scrollY>
      <View className={styles.headerSection}>
        <View className={styles.categoryTag}>
          <Text>{categoryInfo.icon} {categoryInfo.text}</Text>
        </View>
        <View className={styles.titleRow}>
          <Text className={styles.titleText}>{publication.title}</Text>
          <View className={`${styles.statusBadge} ${getStatusBadgeClass(publication.status)}`}>
            <Text>{getStatusText(publication.status)}</Text>
          </View>
        </View>
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
            <Text className={styles.infoLabel}>发布状态</Text>
            <View className={`${styles.infoStatusBadge} ${getStatusBadgeClass(publication.status)}`}>
              <Text>{getStatusText(publication.status)}</Text>
            </View>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>发布时间</Text>
            <Text className={styles.infoValue}>{getPublishTimeText(publication)}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>阅读量</Text>
            <Text className={styles.infoValue}>{publication.views} 次</Text>
          </View>
        </View>
      </View>

      <View className={styles.editBar}>
        {isPublished ? (
          <View className={styles.dangerBtn} onClick={handleWithdrawClick}>
            <Text className={styles.dangerBtnText}>↩️ 撤回</Text>
          </View>
        ) : (
          <>
            <View className={styles.secondaryBtn} onClick={handleEditClick}>
              <Text className={styles.secondaryBtnText}>✏️ 编辑</Text>
            </View>
            <View className={styles.primaryBtn} onClick={handlePublishClick}>
              <Text className={styles.primaryBtnText}>🚀 发布</Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default PublicDetailPage;
