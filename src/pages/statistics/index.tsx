import React, { useState, useMemo } from 'react';
import { View, Text, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import { groupList } from '@/data/farmers';
import { eventTypeList, eventStatusList } from '@/data/events';
import { EventItem } from '@/types';

const SATISFACTION_MAP: Record<string, string> = {
  very_satisfied: '非常满意',
  satisfied: '满意',
  neutral: '一般',
  dissatisfied: '不满意',
  very_dissatisfied: '非常不满意'
};

const SATISFACTION_ORDER = ['very_satisfied', 'satisfied', 'neutral', 'dissatisfied', 'very_dissatisfied'];

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

const StatisticsPage: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState('全部');
  const [selectedType, setSelectedType] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSatisfaction, setSelectedSatisfaction] = useState('');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');

  const farmers = useAppStore((s) => s.farmers);
  const events = useAppStore((s) => s.events);
  const industries = useAppStore((s) => s.industries);

  useDidShow(() => {
    const filter = Taro.getStorageSync('stat_filter');
    if (filter) {
      if (filter.group) setSelectedGroup(filter.group);
      if (filter.type) setSelectedType(filter.type);
      if (filter.status) setSelectedStatus(filter.status);
      if (filter.satisfaction) setSelectedSatisfaction(filter.satisfaction);
      Taro.removeStorageSync('stat_filter');
    }
  });

  const groupIndex = groupList.indexOf(selectedGroup);
  const typeIndex = eventTypeList.indexOf(selectedType);
  const statusIndex = eventStatusList.findIndex((s) => s.value === selectedStatus);

  const isEventDateInRange = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const eventDate = new Date(dateStr.replace(' ', 'T'));
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T23:59:59');
    return eventDate >= start && eventDate <= end;
  };

  const isProjectDateInRange = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const eventDate = new Date(dateStr);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return eventDate >= start && eventDate <= end;
  };

  const stats = useMemo(() => {
    let filteredFarmers = [...farmers];
    let filteredEvents = [...events];
    let filteredIndustries = [...industries];

    if (selectedGroup !== '全部') {
      filteredFarmers = filteredFarmers.filter((f) => f.group === selectedGroup);
      filteredEvents = filteredEvents.filter((e) => {
        const groupName = extractGroupName(e, farmers);
        return groupName === selectedGroup || e.title.includes(selectedGroup) || e.location.includes(selectedGroup);
      });
    }

    if (selectedType !== '全部') {
      filteredEvents = filteredEvents.filter((e) => e.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      filteredEvents = filteredEvents.filter((e) => e.status === selectedStatus);
    }

    if (selectedSatisfaction) {
      filteredEvents = filteredEvents.filter((e) => e.followup?.satisfaction === selectedSatisfaction);
    }

    filteredEvents = filteredEvents.filter((e) => isEventDateInRange(e.createTime));
    filteredIndustries = filteredIndustries.filter((p) => isProjectDateInRange(p.createTime));

    const totalFarmers = filteredFarmers.length;
    const totalPopulation = filteredFarmers.reduce(
      (sum, f) => sum + f.familyMembers.length,
      0
    );
    const totalFarmland = filteredFarmers.reduce(
      (sum, f) => sum + f.farmlandArea,
      0
    );
    const totalEvents = filteredEvents.length;
    const pendingEvents = filteredEvents.filter(
      (e) => e.status === 'pending'
    ).length;
    const processingEvents = filteredEvents.filter(
      (e) => e.status === 'processing'
    ).length;
    const completedEvents = filteredEvents.filter(
      (e) => e.status === 'completed'
    ).length;
    const totalProjects = filteredIndustries.length;
    const totalSubsidy = filteredIndustries.reduce(
      (sum, p) => sum + p.subsidyAmount,
      0
    );

    const completedWithFollowup = filteredEvents.filter(
      (e) => e.status === 'completed' && e.followup
    ).length;
    const followupRate = completedEvents > 0
      ? ((completedWithFollowup / completedEvents) * 100).toFixed(1)
      : '0.0';

    const eventsWithFollowup = filteredEvents.filter((e) => e.followup);
    const totalFollowup = eventsWithFollowup.length;
    const satisfiedCount = eventsWithFollowup.filter(
      (e) => e.followup?.satisfaction === 'very_satisfied' || e.followup?.satisfaction === 'satisfied'
    ).length;
    const satisfactionRate = totalFollowup > 0
      ? ((satisfiedCount / totalFollowup) * 100).toFixed(1)
      : '0.0';

    const groupStatsMap = new Map<string, number>();
    filteredEvents.forEach((event) => {
      const groupName = extractGroupName(event, farmers);
      groupStatsMap.set(groupName, (groupStatsMap.get(groupName) || 0) + 1);
    });
    const eventGroupStats = Array.from(groupStatsMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        percent: totalEvents > 0 ? ((count / totalEvents) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.count - a.count);
    const maxGroupCount = Math.max(...eventGroupStats.map((g) => g.count), 1);

    const farmerGroupStats = groupList
      .filter((g) => g !== '全部')
      .map((group) => {
        const groupFarmers = farmers.filter((f) => f.group === group);
        return {
          name: group,
          farmers: groupFarmers.length,
          population: groupFarmers.reduce(
            (sum, f) => sum + f.familyMembers.length,
            0
          ),
          farmland: groupFarmers.reduce((sum, f) => sum + f.farmlandArea, 0)
        };
      });
    const maxFarmers = Math.max(...farmerGroupStats.map((g) => g.farmers), 1);

    const typeStats = eventTypeList
      .filter((t) => t !== '全部')
      .map((type) => {
        const count = filteredEvents.filter((e) => e.type === type).length;
        return {
          name: type,
          count,
          percent:
            totalEvents > 0
              ? ((count / totalEvents) * 100).toFixed(1)
              : '0'
        };
      })
      .sort((a, b) => b.count - a.count)
      .filter((t) => t.count > 0);

    const statusStats = eventStatusList
      .filter((s) => s.value !== 'all')
      .map((status) => {
        const count = filteredEvents.filter((e) => e.status === status.value).length;
        return {
          name: status.label,
          value: status.value,
          count,
          percent:
            totalEvents > 0
              ? ((count / totalEvents) * 100).toFixed(1)
              : '0'
        };
      });
    const maxStatusCount = Math.max(...statusStats.map((s) => s.count), 1);

    const satisfactionStats = SATISFACTION_ORDER.map((value) => {
      const count = eventsWithFollowup.filter((e) => e.followup?.satisfaction === value).length;
      return {
        name: SATISFACTION_MAP[value],
        value,
        count,
        percent: totalFollowup > 0 ? ((count / totalFollowup) * 100).toFixed(1) : '0'
      };
    }).filter((s) => s.count > 0);

    return {
      totalFarmers,
      totalPopulation,
      totalFarmland: totalFarmland.toFixed(1),
      totalEvents,
      pendingEvents,
      processingEvents,
      completedEvents,
      totalProjects,
      totalSubsidy,
      followupRate,
      satisfactionRate,
      eventGroupStats,
      maxGroupCount,
      farmerGroupStats,
      maxFarmers,
      typeStats,
      statusStats,
      maxStatusCount,
      satisfactionStats,
      totalFollowup
    };
  }, [farmers, events, industries, selectedGroup, selectedType, selectedStatus, selectedSatisfaction, startDate, endDate]);

  const statusColors: Record<string, string> = {
    pending: '#FF7D00',
    processing: '#165DFF',
    completed: '#00B42A',
    closed: '#86909C'
  };

  const typeColors = [
    '#23C343',
    '#165DFF',
    '#FF7D00',
    '#F53F3F',
    '#722ED1',
    '#14C9C9',
    '#F7BA1E'
  ];

  const satisfactionColors: Record<string, string> = {
    very_satisfied: '#00B42A',
    satisfied: '#23C343',
    neutral: '#F7BA1E',
    dissatisfied: '#FF7D00',
    very_dissatisfied: '#F53F3F'
  };

  const handleReset = () => {
    setSelectedGroup('全部');
    setSelectedType('全部');
    setSelectedStatus('all');
    setSelectedSatisfaction('');
    setStartDate('2024-01-01');
    setEndDate('2024-12-31');
    Taro.removeStorageSync('stat_filter');
    Taro.showToast({ title: '已重置筛选', icon: 'none' });
  };

  const handleQuery = () => {
    Taro.showToast({ title: '查询成功', icon: 'success' });
  };

  const goToFarmerList = () => {
    Taro.switchTab({ url: '/pages/farmer/index' }).catch(() => {});
  };

  const goToEventListWithFilter = (filter: Record<string, any>) => {
    Taro.setStorageSync('stat_filter', filter);
    Taro.switchTab({ url: '/pages/event/index' }).catch(() => {
      Taro.navigateTo({ url: '/pages/event/index' });
    });
  };

  const handleGroupClick = (groupName: string) => {
    setSelectedGroup(groupName);
    goToEventListWithFilter({ group: groupName });
  };

  const handleTypeClick = (typeName: string) => {
    setSelectedType(typeName);
    goToEventListWithFilter({ type: typeName });
  };

  const handleStatusClick = (statusValue: string) => {
    setSelectedStatus(statusValue);
    goToEventListWithFilter({ status: statusValue });
  };

  const handleSatisfactionClick = (satisfactionValue: string) => {
    setSelectedSatisfaction(satisfactionValue);
    Taro.showToast({ title: '已按满意度筛选', icon: 'none' });
    goToEventListWithFilter({ satisfaction: satisfactionValue });
  };

  const goToIndustryList = () => {
    Taro.switchTab({ url: '/pages/industry/index' }).catch(() => {});
  };

  return (
    <View className={styles.page}>
      <View className={styles.filterSection}>
        <View className={styles.filterRow}>
          <View className={styles.filterItem}>
            <Text className={styles.filterLabel}>所在组别</Text>
            <Picker
              mode="selector"
              range={groupList}
              value={groupIndex}
              onChange={(e) => setSelectedGroup(groupList[e.detail.value])}
            >
              <View className={styles.filterPicker}>
                <Text className={styles.pickerValue}>{selectedGroup}</Text>
                <Text className={styles.pickerArrow}>▼</Text>
              </View>
            </Picker>
          </View>
          <View className={styles.filterItem}>
            <Text className={styles.filterLabel}>事项类型</Text>
            <Picker
              mode="selector"
              range={eventTypeList}
              value={typeIndex}
              onChange={(e) => setSelectedType(eventTypeList[e.detail.value])}
            >
              <View className={styles.filterPicker}>
                <Text className={styles.pickerValue}>{selectedType}</Text>
                <Text className={styles.pickerArrow}>▼</Text>
              </View>
            </Picker>
          </View>
        </View>

        <View className={styles.filterRow}>
          <View className={styles.filterItem}>
            <Text className={styles.filterLabel}>办理状态</Text>
            <Picker
              mode="selector"
              range={eventStatusList.map((s) => s.label)}
              value={statusIndex}
              onChange={(e) =>
                setSelectedStatus(eventStatusList[e.detail.value].value)
              }
            >
              <View className={styles.filterPicker}>
                <Text className={styles.pickerValue}>
                  {eventStatusList.find((s) => s.value === selectedStatus)?.label}
                </Text>
                <Text className={styles.pickerArrow}>▼</Text>
              </View>
            </Picker>
          </View>
        </View>

        <View className={styles.filterRow}>
          <View className={styles.filterItem}>
            <Text className={styles.filterLabel}>时间范围</Text>
            <View className={styles.dateRange}>
              <Picker
                mode="date"
                value={startDate}
                onChange={(e) => setStartDate(e.detail.value)}
              >
                <View className={styles.datePicker}>{startDate}</View>
              </Picker>
              <Text className={styles.dateDivider}>至</Text>
              <Picker
                mode="date"
                value={endDate}
                onChange={(e) => setEndDate(e.detail.value)}
              >
                <View className={styles.datePicker}>{endDate}</View>
              </Picker>
            </View>
          </View>
        </View>

        <View className={styles.actionBar}>
          <View className={styles.resetBtn} onClick={handleReset}>
            <Text>重置</Text>
          </View>
          <View className={styles.submitBtn} onClick={handleQuery}>
            <Text>查询统计</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsOverview}>
        <View className={styles.overviewCard} onClick={goToFarmerList}>
          <Text className={styles.overviewIcon}>👨‍👩‍👧‍👦</Text>
          <Text className={styles.overviewValue}>{stats.totalFarmers}</Text>
          <Text className={styles.overviewLabel}>农户总数</Text>
          <Text className={styles.overviewTrend}>人口 {stats.totalPopulation} 人</Text>
        </View>

        <View className={styles.overviewCard}>
          <Text className={styles.overviewIcon}>🌾</Text>
          <Text className={styles.overviewValue}>{stats.totalFarmland}</Text>
          <Text className={styles.overviewLabel}>耕地面积（亩）</Text>
          <Text className={styles.overviewTrend}>
            人均 {(Number(stats.totalFarmland) / Math.max(stats.totalPopulation, 1)).toFixed(2)} 亩
          </Text>
        </View>

        <View className={styles.overviewCard} onClick={() => goToEventListWithFilter({})}>
          <Text className={styles.overviewIcon}>📋</Text>
          <Text className={styles.overviewValue}>{stats.totalEvents}</Text>
          <Text className={styles.overviewLabel}>事件总数</Text>
          <Text className={styles.overviewTrend}>
            待处理 {stats.pendingEvents} · 处理中 {stats.processingEvents}
          </Text>
        </View>

        <View className={styles.overviewCard} onClick={goToIndustryList}>
          <Text className={styles.overviewIcon}>🚜</Text>
          <Text className={styles.overviewValue}>{stats.totalProjects}</Text>
          <Text className={styles.overviewLabel}>产业项目</Text>
          <Text className={styles.overviewTrend}>
            补贴 {(stats.totalSubsidy / 10000).toFixed(1)} 万
          </Text>
        </View>

        <View className={styles.overviewCard}>
          <Text className={styles.overviewIcon}>✅</Text>
          <Text className={styles.overviewValue}>{stats.followupRate}%</Text>
          <Text className={styles.overviewLabel}>回访完成率</Text>
          <Text className={styles.overviewTrend}>
            已回访 {stats.completedEvents > 0 ? Math.round((Number(stats.followupRate) / 100) * stats.completedEvents) : 0} / 已完成 {stats.completedEvents}
          </Text>
        </View>

        <View className={styles.overviewCard}>
          <Text className={styles.overviewIcon}>😊</Text>
          <Text className={styles.overviewValue}>{stats.satisfactionRate}%</Text>
          <Text className={styles.overviewLabel}>群众满意度</Text>
          <Text className={styles.overviewTrend}>
            满意 {Math.round((Number(stats.satisfactionRate) / 100) * stats.totalFollowup)} / 已回访 {stats.totalFollowup}
          </Text>
        </View>
      </View>

      <View className={styles.statSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>🏘️</Text>
            各组事件分布
          </Text>
          <Text className={styles.moreBtn} onClick={() => goToEventListWithFilter({})}>查看详情 →</Text>
        </View>
        <View className={styles.barChart}>
          {stats.eventGroupStats.length > 0 ? (
            stats.eventGroupStats.map((item, index) => (
              <View
                key={index}
                className={`${styles.barItem} ${styles.clickable}`}
                onClick={() => handleGroupClick(item.name)}
              >
                <Text className={styles.barLabel}>{item.name}</Text>
                <View className={styles.barTrack}>
                  <View
                    className={styles.barFill}
                    style={{ width: `${(item.count / stats.maxGroupCount) * 100}%` }}
                  />
                </View>
                <Text className={styles.barValue}>{item.count}件</Text>
              </View>
            ))
          ) : (
            <View style={{ padding: '24rpx', textAlign: 'center' }}>
              <Text style={{ fontSize: '24rpx', color: '#86909C' }}>当前筛选条件下无数据</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.statSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📈</Text>
            事项类型分布
          </Text>
          <Text className={styles.moreBtn} onClick={() => goToEventListWithFilter({})}>查看详情 →</Text>
        </View>
        <View className={styles.pieList}>
          {stats.typeStats.length > 0 ? (
            stats.typeStats.map((item, index) => (
              <View
                key={index}
                className={`${styles.pieItem} ${styles.clickable}`}
                onClick={() => handleTypeClick(item.name)}
              >
                <View className={styles.pieLeft}>
                  <View
                    className={styles.pieDot}
                    style={{ backgroundColor: typeColors[index % typeColors.length] }}
                  />
                  <Text className={styles.pieLabel}>{item.name}</Text>
                </View>
                <View className={styles.pieRight}>
                  <Text className={styles.pieCount}>{item.count}件</Text>
                  <Text className={styles.piePercent}>{item.percent}%</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={{ padding: '24rpx', textAlign: 'center' }}>
              <Text style={{ fontSize: '24rpx', color: '#86909C' }}>当前筛选条件下无数据</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.statSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📑</Text>
            办理状态分布
          </Text>
          <Text className={styles.moreBtn} onClick={() => goToEventListWithFilter({})}>查看详情 →</Text>
        </View>
        <View className={styles.barChart}>
          {stats.statusStats.map((item, index) => (
            <View
              key={index}
              className={`${styles.barItem} ${styles.clickable}`}
              onClick={() => handleStatusClick(item.value)}
            >
              <Text className={styles.barLabel}>{item.name}</Text>
              <View className={styles.barTrack}>
                <View
                  className={styles.barFill}
                  style={{
                    width: `${(item.count / stats.maxStatusCount) * 100}%`,
                    background: `linear-gradient(90deg, ${statusColors[item.value]}88 0%, ${statusColors[item.value]} 100%)`
                  }}
                />
              </View>
              <Text className={styles.barValue}>{item.count}件</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.statSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>⭐</Text>
            满意度分布
          </Text>
          <Text className={styles.moreBtn} onClick={() => goToEventListWithFilter({})}>查看详情 →</Text>
        </View>
        <View className={styles.pieList}>
          {stats.satisfactionStats.length > 0 ? (
            stats.satisfactionStats.map((item, index) => (
              <View
                key={index}
                className={`${styles.pieItem} ${styles.clickable}`}
                onClick={() => handleSatisfactionClick(item.value)}
              >
                <View className={styles.pieLeft}>
                  <View
                    className={styles.pieDot}
                    style={{ backgroundColor: satisfactionColors[item.value] }}
                  />
                  <Text className={styles.pieLabel}>{item.name}</Text>
                </View>
                <View className={styles.pieRight}>
                  <Text className={styles.pieCount}>{item.count}件</Text>
                  <Text className={styles.piePercent}>{item.percent}%</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={{ padding: '24rpx', textAlign: 'center' }}>
              <Text style={{ fontSize: '24rpx', color: '#86909C' }}>暂无回访数据</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default StatisticsPage;
