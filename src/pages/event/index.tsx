import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import EmptyState from '@/components/EmptyState';
import { eventList, eventStatusList } from '@/data/events';
import { EventItem } from '@/types';

const EventPage: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const statusCounts = useMemo(() => {
    return {
      all: eventList.length,
      pending: eventList.filter((e) => e.status === 'pending').length,
      processing: eventList.filter((e) => e.status === 'processing').length,
      completed: eventList.filter((e) => e.status === 'completed').length,
      closed: eventList.filter((e) => e.status === 'closed').length
    };
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeStatus === 'all') return eventList;
    return eventList.filter((event) => event.status === activeStatus);
  }, [activeStatus]);

  const handleEventClick = (event: EventItem) => {
    Taro.navigateTo({
      url: `/pages/event-detail/index?id=${event.id}`
    });
  };

  const handleCreateEvent = () => {
    Taro.navigateTo({
      url: '/pages/event-create/index'
    });
  };

  const getPriorityInfo = (priority: string) => {
    const priorityMap: Record<string, { text: string; className: string }> = {
      high: { text: '高优先级', className: styles.priorityHigh },
      medium: { text: '中优先级', className: styles.priorityMedium },
      low: { text: '低优先级', className: styles.priorityLow }
    };
    return priorityMap[priority] || { text: priority, className: styles.priorityLow };
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      pending: { text: '待处理', className: styles.statusPending },
      processing: { text: '处理中', className: styles.statusProcessing },
      completed: { text: '已完成', className: styles.statusCompleted },
      closed: { text: '已关闭', className: styles.statusClosed }
    };
    return statusMap[status] || { text: status, className: styles.statusPending };
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
      className={styles.eventPage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={() => setRefreshing(true)}
    >
      <View className={styles.tabsBar}>
        <ScrollView
          className={styles.tabsScroll}
          scrollX
          showScrollbar={false}
        >
          {eventStatusList.map((status) => {
            const count = statusCounts[status.value as keyof typeof statusCounts] || 0;
            const showBadge = status.value === 'pending' && count > 0;
            return (
              <View
                key={status.value}
                className={`${styles.tabItem} ${activeStatus === status.value ? styles.tabActive : ''}`}
                onClick={() => setActiveStatus(status.value)}
              >
                <Text>{status.label}</Text>
                {showBadge && (
                  <View className={styles.tabBadge}>
                    <Text>{count}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View className={styles.listSection}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const priorityInfo = getPriorityInfo(event.priority);
            const statusInfo = getStatusInfo(event.status);
            return (
              <View
                key={event.id}
                className={styles.eventCard}
                onClick={() => handleEventClick(event)}
              >
                <View className={styles.cardHeader}>
                  <Text className={styles.eventTitle}>{event.title}</Text>
                  <View className={`${styles.priorityBadge} ${priorityInfo.className}`}>
                    <Text>{priorityInfo.text}</Text>
                  </View>
                </View>
                <View className={styles.cardBody}>
                  <Text className={styles.eventDesc}>{event.description}</Text>
                  <View className={styles.eventTags}>
                    <Tag text={event.type} type="info" size="small" />
                    <Tag text={event.reporter} type="default" size="small" />
                  </View>
                </View>
                <View className={styles.eventMeta}>
                  <View className={styles.metaLeft}>
                    <View className={styles.metaItem}>
                      <Text className={styles.metaIcon}>📍</Text>
                      <Text>{event.location}</Text>
                    </View>
                    <View className={styles.metaItem}>
                      <Text className={styles.metaIcon}>🕐</Text>
                      <Text>{event.createTime}</Text>
                    </View>
                  </View>
                  <View className={`${styles.statusBadge} ${statusInfo.className}`}>
                    <Text>{statusInfo.text}</Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View className={styles.emptyWrap}>
            <EmptyState text="暂无事件记录" />
          </View>
        )}
      </View>

      <View className={styles.addBtn} onClick={handleCreateEvent}>
        <Text className={styles.addBtnText}>+</Text>
      </View>
    </ScrollView>
  );
};

export default EventPage;
