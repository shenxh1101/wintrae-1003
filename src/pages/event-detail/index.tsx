import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import { eventList } from '@/data/events';
import { EventItem } from '@/types';

const EventDetailPage: React.FC = () => {
  const router = useRouter();
  const [event, setEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    const id = router.params.id;
    const found = eventList.find((e) => e.id === id);
    if (found) {
      setEvent(found);
    }
  }, [router.params.id]);

  const getPriorityClass = (priority: string) => {
    const map: Record<string, string> = {
      high: styles.priorityHigh,
      medium: styles.priorityMedium,
      low: styles.priorityLow
    };
    return map[priority] || styles.priorityLow;
  };

  const getPriorityText = (priority: string) => {
    const map: Record<string, string> = {
      high: '高优先级',
      medium: '中优先级',
      low: '低优先级'
    };
    return map[priority] || priority;
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      pending: styles.statusPending,
      processing: styles.statusProcessing,
      completed: styles.statusCompleted,
      closed: styles.statusClosed
    };
    return map[status] || styles.statusPending;
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: '待处理',
      processing: '处理中',
      completed: '已完成',
      closed: '已关闭'
    };
    return map[status] || status;
  };

  const handleCall = () => {
    if (event?.reporterPhone) {
      Taro.makePhoneCall({
        phoneNumber: event.reporterPhone
      }).catch((err) => {
        console.error('[EventDetail] 拨打电话失败', err);
      });
    }
  };

  const handleDispatch = () => {
    Taro.showToast({ title: '派单功能开发中', icon: 'none' });
  };

  const handlePhotoPreview = (url: string) => {
    if (event?.photos) {
      Taro.previewImage({
        current: url,
        urls: event.photos
      });
    }
  };

  if (!event) {
    return (
      <View className={styles.detailPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const canDispatch = event.status === 'pending';
  const canComplete = event.status === 'processing';

  return (
    <ScrollView className={styles.detailPage} scrollY>
      <View className={styles.headerCard}>
        <Text className={styles.eventTitle}>{event.title}</Text>
        <View className={styles.eventMeta}>
          <View className={`${styles.priorityBadge} ${getPriorityClass(event.priority)}`}>
            <Text>{getPriorityText(event.priority)}</Text>
          </View>
          <View className={`${styles.statusBadge} ${getStatusClass(event.status)}`}>
            <Text>{getStatusText(event.status)}</Text>
          </View>
          <Tag text={event.type} type="info" size="small" />
        </View>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>反映人</Text>
            <Text className={styles.infoValue}>{event.reporter}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>联系电话</Text>
            <Text className={styles.infoValue}>{event.reporterPhone}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>上报时间</Text>
            <Text className={styles.infoValue}>{event.createTime}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>更新时间</Text>
            <Text className={styles.infoValue}>{event.updateTime}</Text>
          </View>
        </View>
        {event.assignee && (
          <View className={styles.infoGrid} style={{ marginTop: '24rpx', paddingTop: '24rpx' }}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>处理人</Text>
              <Text className={styles.infoValue}>{event.assignee}</Text>
            </View>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📍</Text>
          事件位置
        </Text>
        <View className={styles.locationItem}>
          <Text className={styles.locationIcon}>📍</Text>
          <Text>{event.location}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📝</Text>
          问题描述
        </Text>
        <Text className={styles.descText}>{event.description}</Text>
      </View>

      {event.photos.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📷</Text>
            现场照片
          </Text>
          <View className={styles.photoList}>
            {event.photos.map((photo, index) => (
              <View
                key={index}
                className={styles.photoItem}
                onClick={() => handlePhotoPreview(photo)}
              >
                <Image
                  className={styles.photoImg}
                  src={photo}
                  mode="aspectFill"
                />
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📊</Text>
          处理进度
        </Text>
        <View className={styles.progressList}>
          {event.progress.map((item) => (
            <View key={item.id} className={styles.progressItem}>
              <Text className={styles.progressContent}>{item.content}</Text>
              <View className={styles.progressMeta}>
                <Text>{item.operator}</Text>
                <Text>{item.time}</Text>
              </View>
              {item.photos && item.photos.length > 0 && (
                <View className={styles.progressPhotos}>
                  {item.photos.map((photo, idx) => (
                    <View key={idx} className={styles.progressPhoto}>
                      <Image
                        src={photo}
                        mode="aspectFill"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.secondaryBtn} onClick={handleCall}>
          <Text className={styles.secondaryBtnText}>联系反映人</Text>
        </View>
        {canDispatch && (
          <View className={styles.primaryBtn} onClick={handleDispatch}>
            <Text className={styles.primaryBtnText}>立即派单</Text>
          </View>
        )}
        {canComplete && (
          <View className={styles.primaryBtn} onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
            <Text className={styles.primaryBtnText}>确认完成</Text>
          </View>
        )}
        {!canDispatch && !canComplete && (
          <View className={styles.primaryBtn} onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
            <Text className={styles.primaryBtnText}>添加进度</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default EventDetailPage;
