import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { Publication, PublicationView } from '@/types';
import { useAppStore } from '@/store';

const CADRE_KEY = 'public_role';

const PublicDetailPage: React.FC = () => {
  const router = useRouter();
  const store = useAppStore();
  const getPublication = useAppStore((s) => s.getPublication);
  const publications = useAppStore((s) => s.publications);
  const incrementPublicationViews = useAppStore((s) => s.incrementPublicationViews);
  const [publication, setPublication] = useState<Publication | null>(null);
  const [isCadre, setIsCadre] = useState(true);
  const [viewCounted, setViewCounted] = useState(false);

  const loadRole = () => {
    try {
      const role = Taro.getStorageSync(CADRE_KEY);
      setIsCadre(role === 'cadre' || !role);
    } catch (e) {
      setIsCadre(true);
    }
  };

  const loadPublication = () => {
    const id = router.params.id;
    const found = getPublication(id);
    if (found) {
      setPublication(found);
      if (!isCadre && found.status === 'published' && !viewCounted) {
        incrementPublicationViews(id, '群众');
        setViewCounted(true);
      }
    }
  };

  useDidShow(() => {
    loadRole();
    loadPublication();
  });

  useEffect(() => {
    loadRole();
  }, []);

  useEffect(() => {
    loadPublication();
  }, [router.params.id, getPublication, publications, isCadre]);

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
      content: '撤回后该公示将从群众端移除，变为已撤回状态，是否继续？',
      success: (res) => {
        if (res.confirm) {
          store.withdrawPublication(publication.id);
          const updated = store.getPublication(publication.id);
          if (updated) {
            setPublication(updated);
          }
          Taro.showToast({ title: '已撤回', icon: 'success' });
        }
      }
    });
  };

  const handlePublishClick = () => {
    if (!publication) return;
    Taro.showModal({
      title: '确认发布',
      content: '发布后该公示将对外公开，发布时间会更新为今天，是否继续？',
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

  const getPublishTimeText = (pub: Publication) => {
    if (pub.status === 'draft') {
      return '未发布';
    }
    return pub.publishTime || '未发布';
  };

  const viewTrend = useMemo(() => {
    if (!publication?.viewRecords || publication.viewRecords.length === 0) {
      return { days: [], maxCount: 1 };
    }
    const dayMap = new Map<string, number>();
    publication.viewRecords.forEach((r: PublicationView) => {
      const day = r.time.split(' ')[0];
      dayMap.set(day, (dayMap.get(day) || 0) + 1);
    });
    const days = Array.from(dayMap.entries())
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => a.day.localeCompare(b.day))
      .slice(-7);
    const maxCount = Math.max(...days.map((d) => d.count), 1);
    return { days, maxCount };
  }, [publication]);

  const recentViews = useMemo(() => {
    if (!publication?.viewRecords) return [];
    return [...publication.viewRecords]
      .sort((a, b) => b.time.localeCompare(a.time))
      .slice(0, 5);
  }, [publication]);

  if (!publication) {
    return (
      <View className={styles.detailPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const categoryInfo = getCategoryInfo(publication.category);
  const isPublished = publication.status === 'published';
  const isWithdrawn = publication.status === 'withdrawn';
  const showAdminBar = isCadre;

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

      {isCadre && (
        <View className={styles.infoCard}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📊</Text>
            阅读情况
          </Text>

          <View className={styles.viewTrendSection}>
            <Text className={styles.subTitle}>近7日浏览趋势</Text>
            {viewTrend.days.length > 0 ? (
              <View className={styles.trendChart}>
                {viewTrend.days.map((item) => (
                  <View key={item.day} className={styles.trendItem}>
                    <View className={styles.trendBar}>
                      <View
                        className={styles.trendBarFill}
                        style={{ height: `${(item.count / viewTrend.maxCount) * 100}%` }}
                      />
                    </View>
                    <Text className={styles.trendCount}>{item.count}</Text>
                    <Text className={styles.trendDay}>{item.day.slice(5)}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className={styles.emptyText}>暂无浏览记录</Text>
            )}
          </View>

          <View className={styles.viewRecordsSection}>
            <Text className={styles.subTitle}>最近阅读记录</Text>
            {recentViews.length > 0 ? (
              <View className={styles.viewRecordsList}>
                {recentViews.map((r: PublicationView) => (
                  <View key={r.id} className={styles.viewRecordItem}>
                    <View className={styles.viewRecordAvatar}>
                      <Text>👤</Text>
                    </View>
                    <View className={styles.viewRecordInfo}>
                      <Text className={styles.viewRecordReader}>{r.reader}</Text>
                      <Text className={styles.viewRecordTime}>{r.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text className={styles.emptyText}>暂无阅读记录</Text>
            )}
          </View>
        </View>
      )}

      {showAdminBar && (
        <View className={styles.editBar}>
          {isPublished ? (
            <>
              <View className={styles.secondaryBtn} onClick={handleEditClick}>
                <Text className={styles.secondaryBtnText}>✏️ 编辑内容</Text>
              </View>
              <View className={styles.dangerBtn} onClick={handleWithdrawClick}>
                <Text className={styles.dangerBtnText}>↩️ 撤回</Text>
              </View>
            </>
          ) : (
            <>
              <View className={styles.secondaryBtn} onClick={handleEditClick}>
                <Text className={styles.secondaryBtnText}>✏️ 编辑</Text>
              </View>
              <View className={styles.primaryBtn} onClick={handlePublishClick}>
                <Text className={styles.primaryBtnText}>
                  {isWithdrawn ? '🚀 重新发布' : '🚀 发布'}
                </Text>
              </View>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default PublicDetailPage;
