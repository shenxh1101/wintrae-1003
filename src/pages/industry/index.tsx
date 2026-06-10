import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import EmptyState from '@/components/EmptyState';
import { industryTypeList } from '@/data/industries';
import { useAppStore } from '@/store';
import { IndustryProject } from '@/types';

const IndustryPage: React.FC = () => {
  const [activeType, setActiveType] = useState('全部');
  const [refreshing, setRefreshing] = useState(false);
  const industries = useAppStore((s) => s.industries);

  const stats = useMemo(() => {
    const totalSubsidy = industries.reduce((sum, item) => sum + item.subsidyAmount, 0);
    const activeCount = industries.filter((item) => item.status === 'active').length;
    return {
      total: industries.length,
      active: activeCount,
      subsidy: (totalSubsidy / 10000).toFixed(1)
    };
  }, [industries]);

  const filteredProjects = useMemo(() => {
    return industries.filter((project) => {
      return activeType === '全部' || project.type === activeType;
    });
  }, [industries, activeType]);

  const handleProjectClick = (project: IndustryProject) => {
    Taro.navigateTo({
      url: `/pages/industry-detail/index?id=${project.id}`
    });
  };

  const handleAddIndustry = () => {
    Taro.navigateTo({
      url: '/pages/industry-edit/index'
    });
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; type: 'primary' | 'success' | 'warning' | 'info' }> = {
      active: { text: '进行中', type: 'primary' },
      completed: { text: '已完成', type: 'success' },
      planning: { text: '规划中', type: 'warning' }
    };
    return statusMap[status] || { text: status, type: 'info' };
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
      className={styles.industryPage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={() => setRefreshing(true)}
    >
      <View className={styles.statsBar}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{stats.total}</Text>
          <Text className={styles.statLabel}>项目总数</Text>
        </View>
        <View className={styles.statDivider}></View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{stats.active}</Text>
          <Text className={styles.statLabel}>进行中</Text>
        </View>
        <View className={styles.statDivider}></View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{stats.subsidy}</Text>
          <Text className={styles.statLabel}>补贴(万元)</Text>
        </View>
      </View>

      <View className={styles.filterSection}>
        <ScrollView
          className={styles.filterScroll}
          scrollX
          showScrollbar={false}
        >
          {industryTypeList.map((type) => (
            <View
              key={type}
              className={`${styles.filterItem} ${activeType === type ? styles.filterActive : ''}`}
              onClick={() => setActiveType(type)}
            >
              <Text>{type}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.listSection}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => {
            const statusInfo = getStatusInfo(project.status);
            return (
              <View
                key={project.id}
                className={styles.projectCard}
                onClick={() => handleProjectClick(project)}
              >
                <Image
                  className={styles.projectImage}
                  src={project.image}
                  mode="aspectFill"
                />
                <View className={styles.projectContent}>
                  <View className={styles.projectHeader}>
                    <Text className={styles.projectName}>{project.name}</Text>
                    <View className={styles.statusTag}>
                      <Tag text={statusInfo.text} type={statusInfo.type} size="small" />
                    </View>
                  </View>
                  <View className={styles.projectMeta}>
                    <View className={styles.metaItem}>
                      <Text className={styles.metaIcon}>📍</Text>
                      <Text>{project.scale}</Text>
                    </View>
                    <View className={styles.metaItem}>
                      <Text className={styles.metaIcon}>🏭</Text>
                      <Text>{project.cooperative.replace('幸福村', '').replace('专业合作社', '')}</Text>
                    </View>
                  </View>
                  <View className={styles.projectStats}>
                    <View className={styles.statBlock}>
                      <Text className={styles.statNum}>
                        {project.output >= 10000
                          ? (project.output / 10000).toFixed(1) + '万'
                          : project.output}
                      </Text>
                      <Text className={styles.statName}>{project.outputUnit}</Text>
                    </View>
                    <View className={styles.statBlock}>
                      <Text className={styles.statNum}>
                        {(project.subsidyAmount / 10000).toFixed(1)}万
                      </Text>
                      <Text className={styles.statName}>补贴金额</Text>
                    </View>
                    <View className={styles.statBlock}>
                      <Text className={styles.statNum}>{project.salesChannels.length}</Text>
                      <Text className={styles.statName}>销售渠道</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View className={styles.emptyWrap}>
            <EmptyState text="暂无产业项目" />
          </View>
        )}
      </View>

      <View className={styles.addBtn} onClick={handleAddIndustry}>
        <Text className={styles.addBtnText}>+</Text>
      </View>
    </ScrollView>
  );
};

export default IndustryPage;
