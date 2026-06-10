import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import EmptyState from '@/components/EmptyState';
import { eventStatusList } from '@/data/events';
import { EventItem } from '@/types';
import { useAppStore } from '@/store';

const SATISFACTION_MAP: Record<string, string> = {
  very_satisfied: '非常满意',
  satisfied: '满意',
  neutral: '一般',
  dissatisfied: '不满意',
  very_dissatisfied: '非常不满意'
};

const extractGroupName = (event: EventItem, farmers: any[]): string => {
  const reporter = farmers.find((f) => f.name === event.reporter);
  if (reporter && reporter.group) {
    return reporter.group;
  }
  const match = event.location.match(/幸福村([一二三四五六七八九十]+组)/);
  if (match) {
    return match[1];
  }
  const simpleMatch = event.location.match(/([一二三四五六七八九十]+组)/);
  if (simpleMatch) {
    return simpleMatch[1];
  }
  return '其他';
};

const EventPage: React.FC = () => {
  const store = useAppStore();
  const statFilter = useAppStore((s) => s.statFilter);
  const eventList = useAppStore((s) => s.events);
  const farmers = useAppStore((s) => s.farmers);

  const [activeStatus, setActiveStatus] = useState('all');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSatisfaction, setFilterSatisfaction] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadFilterFromStore = () => {
    if (statFilter.status) {
      setActiveStatus(statFilter.status);
    }
    if (statFilter.group) {
      setFilterGroup(statFilter.group);
    }
    if (statFilter.type) {
      setFilterType(statFilter.type);
    }
    if (statFilter.satisfaction) {
      setFilterSatisfaction(statFilter.satisfaction);
    }
    if (statFilter.startDate) {
      setFilterStartDate(statFilter.startDate);
    }
    if (statFilter.endDate) {
      setFilterEndDate(statFilter.endDate);
    }
  };

  useEffect(() => {
    loadFilterFromStore();
  }, []);

  useDidShow(() => {
    loadFilterFromStore();
  });

  const statusCounts = useMemo(() => {
    return {
      all: eventList.length,
      pending: eventList.filter((e) => e.status === 'pending').length,
      processing: eventList.filter((e) => e.status === 'processing').length,
      completed: eventList.filter((e) => e.status === 'completed').length,
      closed: eventList.filter((e) => e.status === 'closed').length
    };
  }, [eventList]);

  const isDateInRange = (dateStr: string): boolean => {
    if (!filterStartDate && !filterEndDate) return true;
    if (!dateStr) return false;
    const eventDate = new Date(dateStr.replace(' ', 'T'));
    if (filterStartDate) {
      const start = new Date(filterStartDate + 'T00:00:00');
      if (eventDate < start) return false;
    }
    if (filterEndDate) {
      const end = new Date(filterEndDate + 'T23:59:59');
      if (eventDate > end) return false;
    }
    return true;
  };

  const filteredEvents = useMemo(() => {
    let result = eventList;
    if (activeStatus !== 'all') {
      result = result.filter((event) => event.status === activeStatus);
    }
    if (filterGroup) {
      result = result.filter((event) => {
        const groupName = extractGroupName(event, farmers);
        return groupName === filterGroup || event.title.includes(filterGroup) || event.location.includes(filterGroup);
      });
    }
    if (filterType) {
      result = result.filter((event) => event.type === filterType);
    }
    if (filterSatisfaction) {
      result = result.filter((event) => event.followup?.satisfaction === filterSatisfaction);
    }
    result = result.filter((event) => isDateInRange(event.createTime));
    return result;
  }, [activeStatus, filterGroup, filterType, filterSatisfaction, filterStartDate, filterEndDate, eventList, farmers]);

  const hasActiveFilters = filterGroup || filterType || filterSatisfaction || filterStartDate || filterEndDate;

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

  const clearFilters = () => {
    setFilterGroup('');
    setFilterType('');
    setFilterSatisfaction('');
    setFilterStartDate('');
    setFilterEndDate('');
    store.clearStatFilter();
    Taro.showToast({ title: '已清除筛选', icon: 'none' });
  };

  const handleStatusTabClick = (status: string) => {
    setActiveStatus(status);
    if (status === 'all') {
      store.setStatFilter({ status: undefined });
    } else {
      store.setStatFilter({ status });
    }
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

  const dateRangeText = filterStartDate && filterEndDate
    ? `${filterStartDate} 至 ${filterEndDate}`
    : filterStartDate
      ? `${filterStartDate} 起`
      : filterEndDate
        ? `至 ${filterEndDate}`
        : '';

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
                onClick={() => handleStatusTabClick(status.value)}
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

      {hasActiveFilters && (
        <View className={styles.filterBar}>
          <View className={styles.filterTags}>
            <Text className={styles.filterLabel}>筛选：</Text>
            {filterGroup && (
              <View className={styles.filterTag} onClick={() => { setFilterGroup(''); store.setStatFilter({ group: undefined }); }}>
                <Text className={styles.filterTagText}>组别：{filterGroup}</Text>
                <Text className={styles.filterTagClose}>×</Text>
              </View>
            )}
            {filterType && (
              <View className={styles.filterTag} onClick={() => { setFilterType(''); store.setStatFilter({ type: undefined }); }}>
                <Text className={styles.filterTagText}>类型：{filterType}</Text>
                <Text className={styles.filterTagClose}>×</Text>
              </View>
            )}
            {filterSatisfaction && (
              <View className={styles.filterTag} onClick={() => { setFilterSatisfaction(''); store.setStatFilter({ satisfaction: undefined }); }}>
                <Text className={styles.filterTagText}>满意度：{SATISFACTION_MAP[filterSatisfaction]}</Text>
                <Text className={styles.filterTagClose}>×</Text>
              </View>
            )}
            {dateRangeText && (
              <View className={styles.filterTag} onClick={() => { setFilterStartDate(''); setFilterEndDate(''); store.setStatFilter({ startDate: undefined, endDate: undefined }); }}>
                <Text className={styles.filterTagText}>时间：{dateRangeText}</Text>
                <Text className={styles.filterTagClose}>×</Text>
              </View>
            )}
          </View>
          <View className={styles.clearFilterBtn} onClick={clearFilters}>
            <Text>清除全部</Text>
          </View>
        </View>
      )}

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
                    {event.followup && (
                      <Tag text={`回访：${SATISFACTION_MAP[event.followup.satisfaction]}`} type="success" size="small" />
                    )}
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
            <EmptyState text={hasActiveFilters ? '当前筛选条件下无事件记录' : '暂无事件记录'} />
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
