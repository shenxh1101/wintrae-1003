import React, { useState, useMemo } from 'react';
import { View, Text, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { farmerList, groupList } from '@/data/farmers';
import { eventList, eventTypeList, eventStatusList } from '@/data/events';
import { industryList } from '@/data/industries';

const StatisticsPage: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState('全部');
  const [selectedType, setSelectedType] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');

  const groupIndex = groupList.indexOf(selectedGroup);
  const typeIndex = eventTypeList.indexOf(selectedType);
  const statusIndex = eventStatusList.findIndex((s) => s.value === selectedStatus);

  const stats = useMemo(() => {
    let filteredFarmers = [...farmerList];
    let filteredEvents = [...eventList];
    let filteredIndustries = [...industryList];

    if (selectedGroup !== '全部') {
      filteredFarmers = filteredFarmers.filter((f) => f.group === selectedGroup);
      filteredEvents = filteredEvents.filter((e) => e.title.includes(selectedGroup));
    }

    if (selectedType !== '全部') {
      filteredEvents = filteredEvents.filter((e) => e.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      filteredEvents = filteredEvents.filter((e) => e.status === selectedStatus);
    }

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

    const groupStats = groupList
      .filter((g) => g !== '全部')
      .map((group) => {
        const groupFarmers = farmerList.filter((f) => f.group === group);
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

    const typeStats = eventTypeList
      .filter((t) => t !== '全部')
      .map((type) => {
        const count = eventList.filter((e) => e.type === type).length;
        return {
          name: type,
          count,
          percent: totalEvents > 0 ? ((count / eventList.length) * 100).toFixed(1) : '0'
        };
      })
      .sort((a, b) => b.count - a.count);

    const statusStats = eventStatusList
      .filter((s) => s.value !== 'all')
      .map((status) => {
        const count = eventList.filter((e) => e.status === status.value).length;
        return {
          name: status.label,
          value: status.value,
          count,
          percent:
            eventList.length > 0
              ? ((count / eventList.length) * 100).toFixed(1)
              : '0'
        };
      });

    const maxFarmers = Math.max(...groupStats.map((g) => g.farmers), 1);

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
      groupStats,
      typeStats,
      statusStats,
      maxFarmers
    };
  }, [selectedGroup, selectedType, selectedStatus]);

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

  const handleReset = () => {
    setSelectedGroup('全部');
    setSelectedType('全部');
    setSelectedStatus('all');
    setStartDate('2024-01-01');
    setEndDate('2024-12-31');
    Taro.showToast({ title: '已重置筛选', icon: 'none' });
  };

  const handleQuery = () => {
    Taro.showToast({ title: '查询成功', icon: 'success' });
  };

  const goToFarmerList = () => {
    Taro.switchTab({ url: '/pages/farmer/index' });
  };

  const goToEventList = () => {
    Taro.switchTab({ url: '/pages/event/index' });
  };

  const goToIndustryList = () => {
    Taro.switchTab({ url: '/pages/industry/index' });
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
          <Text className={styles.overviewTrend}>人均 {(Number(stats.totalFarmland) / Math.max(stats.totalPopulation, 1)).toFixed(2)} 亩</Text>
        </View>

        <View className={styles.overviewCard} onClick={goToEventList}>
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
      </View>

      <View className={styles.statSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📊</Text>
            各组农户分布
          </Text>
          <Text className={styles.moreBtn} onClick={goToFarmerList}>查看详情 →</Text>
        </View>
        <View className={styles.barChart}>
          {stats.groupStats.map((item, index) => (
            <View key={index} className={styles.barItem}>
              <Text className={styles.barLabel}>{item.name}</Text>
              <View className={styles.barTrack}>
                <View
                  className={styles.barFill}
                  style={{ width: `${(item.farmers / stats.maxFarmers) * 100}%` }}
                />
              </View>
              <Text className={styles.barValue}>{item.farmers}户</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.statSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📈</Text>
            事件类型分布
          </Text>
          <Text className={styles.moreBtn} onClick={goToEventList}>查看详情 →</Text>
        </View>
        <View className={styles.pieList}>
          {stats.typeStats.map((item, index) => (
            <View key={index} className={styles.pieItem}>
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
          ))}
        </View>
      </View>

      <View className={styles.statSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📑</Text>
            办理状态统计
          </Text>
          <Text className={styles.moreBtn} onClick={goToEventList}>查看详情 →</Text>
        </View>
        <View className={styles.pieList}>
          {stats.statusStats.map((item, index) => (
            <View key={index} className={styles.pieItem}>
              <View className={styles.pieLeft}>
                <View
                  className={styles.pieDot}
                  style={{ backgroundColor: statusColors[item.value] }}
                />
                <Text className={styles.pieLabel}>{item.name}</Text>
              </View>
              <View className={styles.pieRight}>
                <Text className={styles.pieCount}>{item.count}件</Text>
                <Text className={styles.piePercent}>{item.percent}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default StatisticsPage;
