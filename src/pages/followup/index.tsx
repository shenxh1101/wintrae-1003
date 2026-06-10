import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Picker } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import EmptyState from '@/components/EmptyState';
import { useAppStore } from '@/store';
import { EventItem, EventFollowup } from '@/types';

const SATISFACTION_MAP: Record<string, string> = {
  very_satisfied: '非常满意',
  satisfied: '满意',
  neutral: '一般',
  dissatisfied: '不满意',
  very_dissatisfied: '非常不满意'
};

const SATISFACTION_VALUES: Array<EventFollowup['satisfaction']> = [
  'very_satisfied', 'satisfied', 'neutral', 'dissatisfied', 'very_dissatisfied'
];

const SATISFACTION_OPTIONS = [
  { label: '全部满意度', value: 'all' },
  { label: '非常满意', value: 'very_satisfied' },
  { label: '满意', value: 'satisfied' },
  { label: '一般', value: 'neutral' },
  { label: '不满意', value: 'dissatisfied' },
  { label: '非常不满意', value: 'very_dissatisfied' },
  { label: '未回访', value: 'none' }
];

const TAB_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '已回访', value: 'followed' },
  { label: '待回访', value: 'pending' }
];

const FollowupPage: React.FC = () => {
  const store = useAppStore();
  const events = useAppStore((s) => s.events);
  const addEventFollowup = useAppStore((s) => s.addEventFollowup);

  const [activeTab, setActiveTab] = useState('all');
  const [selectedSatisfaction, setSelectedSatisfaction] = useState('all');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useDidShow(() => {
    Taro.setNavigationBarTitle({ title: '回访台账' });
  });

  const operatorList = useMemo(() => {
    const operators = new Set<string>();
    events.forEach((e) => {
      if (e.followup?.operator) {
        operators.add(e.followup.operator);
      }
    });
    return Array.from(operators);
  }, [events]);

  const operatorOptions = ['全部回访人', ...operatorList];
  const operatorIndex = selectedOperator ? operatorList.indexOf(selectedOperator) + 1 : 0;
  const satisfactionIndex = SATISFACTION_OPTIONS.findIndex((s) => s.value === selectedSatisfaction);

  const completedEvents = useMemo(() => {
    return events.filter((e) => e.status === 'completed');
  }, [events]);

  const filteredEvents = useMemo(() => {
    let result = completedEvents;

    if (activeTab === 'followed') {
      result = result.filter((e) => !!e.followup);
    } else if (activeTab === 'pending') {
      result = result.filter((e) => !e.followup);
    }

    if (selectedSatisfaction !== 'all') {
      if (selectedSatisfaction === 'none') {
        result = result.filter((e) => !e.followup);
      } else {
        result = result.filter((e) => e.followup?.satisfaction === selectedSatisfaction);
      }
    }

    if (selectedOperator) {
      result = result.filter((e) => e.followup?.operator === selectedOperator);
    }

    if (startDate || endDate) {
      result = result.filter((e) => {
        if (!e.followup?.time) return false;
        const followupDate = new Date(e.followup.time.replace(' ', 'T'));
        if (startDate) {
          const start = new Date(startDate + 'T00:00:00');
          if (followupDate < start) return false;
        }
        if (endDate) {
          const end = new Date(endDate + 'T23:59:59');
          if (followupDate > end) return false;
        }
        return true;
      });
    }

    return result;
  }, [completedEvents, activeTab, selectedSatisfaction, selectedOperator, startDate, endDate]);

  const stats = useMemo(() => {
    const total = completedEvents.length;
    const followed = completedEvents.filter((e) => !!e.followup).length;
    const pending = total - followed;
    const rate = total > 0 ? ((followed / total) * 100).toFixed(1) : '0.0';

    const eventsWithFollowup = completedEvents.filter((e) => e.followup);
    const satisfiedCount = eventsWithFollowup.filter(
      (e) => e.followup?.satisfaction === 'very_satisfied' || e.followup?.satisfaction === 'satisfied'
    ).length;
    const satisfactionRate = eventsWithFollowup.length > 0
      ? ((satisfiedCount / eventsWithFollowup.length) * 100).toFixed(1)
      : '0.0';

    return { total, followed, pending, rate, satisfactionRate };
  }, [completedEvents]);

  const handleEventClick = (event: EventItem) => {
    Taro.navigateTo({
      url: `/pages/event-detail/index?id=${event.id}`
    });
  };

  const getCurrentTime = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleQuickFollowup = (eventId: string, e: any) => {
    e.stopPropagation && e.stopPropagation();
    Taro.showActionSheet({
      itemList: SATISFACTION_VALUES.map((v) => SATISFACTION_MAP[v]),
      success: (res) => {
        const satisfaction = SATISFACTION_VALUES[res.tapIndex];
        Taro.showModal({
          title: '回访说明',
          editable: true,
          placeholderText: '请输入回访说明...',
          success: (modalRes) => {
            if (modalRes.confirm) {
              const remark = (modalRes.content || '').trim();
              const time = getCurrentTime();
              addEventFollowup(eventId, {
                satisfaction,
                remark,
                operator: '村委会',
                time
              });
              Taro.showToast({ title: '回访完成', icon: 'success' });
            }
          }
        });
      }
    });
  };

  const handleSatisfactionChange = (e: any) => {
    const index = Number(e.detail.value);
    setSelectedSatisfaction(SATISFACTION_OPTIONS[index].value);
  };

  const handleOperatorChange = (e: any) => {
    const index = Number(e.detail.value);
    setSelectedOperator(index === 0 ? '' : operatorList[index - 1]);
  };

  const getSatisfactionColor = (satisfaction: string): string => {
    const colorMap: Record<string, string> = {
      very_satisfied: '#00B42A',
      satisfied: '#23C343',
      neutral: '#F7BA1E',
      dissatisfied: '#FF7D00',
      very_dissatisfied: '#F53F3F'
    };
    return colorMap[satisfaction] || '#86909C';
  };

  const handleGoBack = () => {
    Taro.navigateBack();
  };

  const hasFilters = selectedSatisfaction !== 'all' || selectedOperator || startDate || endDate;

  const clearFilters = () => {
    setSelectedSatisfaction('all');
    setSelectedOperator('');
    setStartDate('');
    setEndDate('');
  };

  const pendingEvents = completedEvents.filter((e) => !e.followup);

  return (
    <ScrollView className={styles.page} scrollY>
      {pendingEvents.length > 0 && (
        <View className={styles.reminderBanner}>
          <View className={styles.reminderIcon}>🔔</View>
          <View className={styles.reminderContent}>
            <Text className={styles.reminderTitle}>有 {pendingEvents.length} 件待回访</Text>
            <Text className={styles.reminderDesc}>及时回访有助于提升群众满意度</Text>
          </View>
          <View className={styles.reminderAction} onClick={() => setActiveTab('pending')}>
            <Text>查看</Text>
          </View>
        </View>
      )}

      <View className={styles.statsSection}>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{stats.total}</Text>
          <Text className={styles.statLabel}>已完成事件</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{stats.followed}</Text>
          <Text className={styles.statLabel}>已回访</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{stats.pending}</Text>
          <Text className={styles.statLabel}>待回访</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{stats.rate}%</Text>
          <Text className={styles.statLabel}>回访完成率</Text>
        </View>
      </View>

      <View className={styles.filterSection}>
        <View className={styles.filterRow}>
          <View className={styles.filterItem}>
            <Text className={styles.filterLabel}>满意度</Text>
            <Picker
              mode="selector"
              range={SATISFACTION_OPTIONS.map((s) => s.label)}
              value={satisfactionIndex}
              onChange={handleSatisfactionChange}
            >
              <View className={styles.filterPicker}>
                <Text className={styles.pickerValue}>
                  {SATISFACTION_OPTIONS.find((s) => s.value === selectedSatisfaction)?.label}
                </Text>
                <Text className={styles.pickerArrow}>▼</Text>
              </View>
            </Picker>
          </View>
          <View className={styles.filterItem}>
            <Text className={styles.filterLabel}>回访人</Text>
            <Picker
              mode="selector"
              range={operatorOptions}
              value={operatorIndex}
              onChange={handleOperatorChange}
            >
              <View className={styles.filterPicker}>
                <Text className={styles.pickerValue}>
                  {selectedOperator || '全部回访人'}
                </Text>
                <Text className={styles.pickerArrow}>▼</Text>
              </View>
            </Picker>
          </View>
        </View>

        <View className={styles.filterRow}>
          <View className={styles.filterItem}>
            <Text className={styles.filterLabel}>回访时间</Text>
            <View className={styles.dateRange}>
              <Picker
                mode="date"
                value={startDate}
                onChange={(e) => setStartDate(e.detail.value)}
              >
                <View className={styles.datePicker}>{startDate || '开始日期'}</View>
              </Picker>
              <Text className={styles.dateDivider}>至</Text>
              <Picker
                mode="date"
                value={endDate}
                onChange={(e) => setEndDate(e.detail.value)}
              >
                <View className={styles.datePicker}>{endDate || '结束日期'}</View>
              </Picker>
            </View>
          </View>
        </View>

        {hasFilters && (
          <View className={styles.clearRow}>
            <View className={styles.clearBtn} onClick={clearFilters}>
              <Text>清除筛选条件</Text>
            </View>
          </View>
        )}
      </View>

      <View className={styles.tabsBar}>
        {TAB_OPTIONS.map((tab) => (
          <View
            key={tab.value}
            className={`${styles.tabItem} ${activeTab === tab.value ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.value)}
          >
            <Text>{tab.label}</Text>
            <Text className={styles.tabCount}>
              {tab.value === 'all'
                ? stats.total
                : tab.value === 'followed'
                  ? stats.followed
                  : stats.pending}
            </Text>
          </View>
        ))}
      </View>

      <View className={styles.listSection}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const followup = event.followup;
            return (
              <View
                key={event.id}
                className={styles.eventCard}
                onClick={() => handleEventClick(event)}
              >
                <View className={styles.cardHeader}>
                  <Text className={styles.eventTitle}>{event.title}</Text>
                  {followup ? (
                    <View
                      className={styles.satisfactionBadge}
                      style={{ backgroundColor: `${getSatisfactionColor(followup.satisfaction)}20`, color: getSatisfactionColor(followup.satisfaction) }}
                    >
                      <Text>{SATISFACTION_MAP[followup.satisfaction]}</Text>
                    </View>
                  ) : (
                    <View className={styles.pendingBadge}>
                      <Text>待回访</Text>
                    </View>
                  )}
                </View>
                <View className={styles.cardBody}>
                  <View className={styles.eventTags}>
                    <Tag text={event.type} type="info" size="small" />
                    <Tag text={event.reporter} type="default" size="small" />
                  </View>
                  <Text className={styles.eventDesc}>{event.description}</Text>
                </View>
                {followup && (
                  <View className={styles.followupInfo}>
                    <View className={styles.followupRow}>
                      <Text className={styles.followupLabel}>回访人：</Text>
                      <Text className={styles.followupValue}>{followup.operator}</Text>
                    </View>
                    <View className={styles.followupRow}>
                      <Text className={styles.followupLabel}>回访时间：</Text>
                      <Text className={styles.followupValue}>{followup.time}</Text>
                    </View>
                    <View className={styles.followupRow}>
                      <Text className={styles.followupLabel}>回访说明：</Text>
                      <Text className={styles.followupValue}>{followup.remark}</Text>
                    </View>
                  </View>
                )}
                <View className={styles.cardFooter}>
                  <View className={styles.footerLeft}>
                    <Text className={styles.footerText}>📍 {event.location}</Text>
                    <Text className={styles.footerText}>🕐 {event.createTime}</Text>
                  </View>
                  {!followup && (
                    <View
                      className={styles.quickFollowupBtn}
                      onClick={(e) => handleQuickFollowup(event.id, e)}
                    >
                      <Text>📞 立即回访</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <View className={styles.emptyWrap}>
            <EmptyState text={hasFilters ? '当前筛选条件下无数据' : '暂无回访记录'} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default FollowupPage;
