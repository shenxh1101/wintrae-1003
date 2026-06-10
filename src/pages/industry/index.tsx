import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import EmptyState from '@/components/EmptyState';
import { industryTypeList, industryStatusList, cooperativeList } from '@/data/industries';
import { useAppStore } from '@/store';
import { IndustryProject } from '@/types';

const channelList = ['全部', '线下批发', '电商平台', '合作社直供', '农贸市场', '餐饮合作', '线上商城', '超市直供', '社区团购', '中药材市场', '制药企业直供', '土特产店', '礼品定制', '蔬菜批发市场', '餐饮配送', '水产批发市场', '餐馆直供', '垂钓休闲', '线上预订', '旅行社合作', '自驾游客'];

const IndustryPage: React.FC = () => {
  const [activeType, setActiveType] = useState('全部');
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeCooperative, setActiveCooperative] = useState('全部');
  const [activeChannel, setActiveChannel] = useState('全部');
  const [refreshing, setRefreshing] = useState(false);
  const industries = useAppStore((s) => s.industries);

  const filteredProjects = useMemo(() => {
    return industries.filter((project) => {
      const typeMatch = activeType === '全部' || project.type === activeType;
      const statusMatch = activeStatus === 'all' || project.status === activeStatus;
      const cooperativeMatch = activeCooperative === '全部' || project.cooperative === activeCooperative;
      const channelMatch = activeChannel === '全部' || project.salesChannels.includes(activeChannel);
      return typeMatch && statusMatch && cooperativeMatch && channelMatch;
    });
  }, [industries, activeType, activeStatus, activeCooperative, activeChannel]);

  const stats = useMemo(() => {
    const totalSubsidy = filteredProjects.reduce((sum, item) => sum + item.subsidyAmount, 0);
    const totalOutput = filteredProjects.reduce((sum, item) => sum + item.output, 0);
    const activeCount = filteredProjects.filter((item) => item.status === 'active').length;
    return {
      total: filteredProjects.length,
      active: activeCount,
      output: totalOutput,
      subsidy: (totalSubsidy / 10000).toFixed(1)
    };
  }, [filteredProjects]);

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
        <View className={styles.filterLabel}>
          <Text className={styles.filterLabelText}>项目类型</Text>
        </View>
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

      <View className={styles.filterSection}>
        <View className={styles.filterLabel}>
          <Text className={styles.filterLabelText}>项目状态</Text>
        </View>
        <ScrollView
          className={styles.filterScroll}
          scrollX
          showScrollbar={false}
        >
          {industryStatusList.map((status) => (
            <View
              key={status.value}
              className={`${styles.filterItem} ${activeStatus === status.value ? styles.filterActive : ''}`}
              onClick={() => setActiveStatus(status.value)}
            >
              <Text>{status.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.filterSection}>
        <View className={styles.filterLabel}>
          <Text className={styles.filterLabelText}>所属合作社</Text>
        </View>
        <ScrollView
          className={styles.filterScroll}
          scrollX
          showScrollbar={false}
        >
          {cooperativeList.map((coop) => (
            <View
              key={coop}
              className={`${styles.filterItem} ${activeCooperative === coop ? styles.filterActive : ''}`}
              onClick={() => setActiveCooperative(coop)}
            >
              <Text>{coop === '全部' ? coop : coop.replace('幸福村', '').replace('专业合作社', '')}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.filterSection}>
        <View className={styles.filterLabel}>
          <Text className={styles.filterLabelText}>销售渠道</Text>
        </View>
        <ScrollView
          className={styles.filterScroll}
          scrollX
          showScrollbar={false}
        >
          {channelList.map((channel) => (
            <View
              key={channel}
              className={`${styles.filterItem} ${activeChannel === channel ? styles.filterActive : ''}`}
              onClick={() => setActiveChannel(channel)}
            >
              <Text>{channel}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.summarySection}>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryLabel}>筛选后总产量</Text>
          <Text className={styles.summaryValue}>
            {stats.output >= 10000 ? (stats.output / 10000).toFixed(1) + '万' : stats.output}
          </Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryLabel}>筛选后总补贴</Text>
          <Text className={styles.summaryValue}>{stats.subsidy} 万</Text>
        </View>
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
            <EmptyState text="暂无符合条件的产业项目" />
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
