import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import Tag from '@/components/Tag';
import { farmerList } from '@/data/farmers';
import { industryList } from '@/data/industries';
import { eventList } from '@/data/events';
import { publicationList } from '@/data/publications';

const HomePage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const stats = useMemo(() => {
    const totalPopulation = farmerList.reduce(
      (sum, farmer) => sum + farmer.familyMembers.length,
      0
    );
    const totalFarmland = farmerList.reduce(
      (sum, farmer) => sum + farmer.farmlandArea,
      0
    );
    const pendingEvents = eventList.filter(
      (e) => e.status === 'pending' || e.status === 'processing'
    ).length;

    return {
      totalFarmers: farmerList.length,
      totalPopulation,
      totalFarmland: totalFarmland.toFixed(1),
      totalProjects: industryList.length,
      pendingEvents
    };
  }, []);

  const latestPublications = useMemo(() => {
    return publicationList.slice(0, 3);
  }, []);

  const quickMenus = [
    { icon: '👨‍👩‍👧', text: '农户档案', color: 'green', path: '/pages/farmer/index' },
    { icon: '🌾', text: '产业项目', color: 'orange', path: '/pages/industry/index' },
    { icon: '📋', text: '事件办理', color: 'blue', path: '/pages/event/index' },
    { icon: '📢', text: '公开公示', color: 'red', path: '/pages/public/index' },
    { icon: '📊', text: '统计查询', color: 'purple', path: '/pages/statistics/index' },
    { icon: '📝', text: '新增农户', color: 'green', path: '/pages/farmer-edit/index' },
    { icon: '➕', text: '上报事件', color: 'blue', path: '/pages/event-create/index' },
    { icon: '💡', text: '政策咨询', color: 'orange', path: '' }
  ];

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekDay = weekDays[today.getDay()];
    return `${year}年${month}月${day}日 ${weekDay}`;
  };

  const handleQuickMenuClick = (path: string) => {
    if (path) {
      if (path.startsWith('/pages/') && path.includes('/pages/') && path.split('/').length === 4) {
        Taro.switchTab({ url: path }).catch(() => {
          Taro.navigateTo({ url: path });
        });
      } else {
        Taro.navigateTo({ url: path });
      }
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' });
    }
  };

  const handleNoticeClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/public-detail/index?id=${id}`
    });
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

  const getCategoryTagType = (category: string): 'primary' | 'info' | 'warning' | 'success' => {
    const typeMap: Record<string, 'primary' | 'info' | 'warning' | 'success'> = {
      notice: 'info',
      meeting: 'primary',
      fund: 'warning',
      policy: 'success'
    };
    return typeMap[category] || 'primary';
  };

  const getCategoryName = (category: string): string => {
    const nameMap: Record<string, string> = {
      notice: '通知',
      meeting: '会议',
      fund: '资金',
      policy: '政策'
    };
    return nameMap[category] || '通知';
  };

  return (
    <ScrollView
      className={styles.homePage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={() => setRefreshing(true)}
    >
      <View className={styles.header}>
        <Text className={styles.villageName}>幸福村</Text>
        <Text className={styles.welcomeText}>数字乡村智慧管理平台</Text>
        <Text className={styles.dateText}>{getTodayDate()}</Text>
      </View>

      <View className={styles.statsSection}>
        <View className={styles.statsRow}>
          <StatCard title="农户总数" value={stats.totalFarmers} unit="户" color="#23C343" />
          <StatCard title="总人口" value={stats.totalPopulation} unit="人" color="#165DFF" />
        </View>
        <View className={styles.statsRow}>
          <StatCard title="耕地面积" value={stats.totalFarmland} unit="亩" color="#FF7D00" />
          <StatCard title="待办事件" value={stats.pendingEvents} unit="件" color="#F53F3F" />
        </View>
      </View>

      <View className={styles.quickSection}>
        <View className={styles.sectionHeader}>
          <View className={styles.sectionTitle}>
            <View className={styles.sectionTitleDot}></View>
            <Text>快捷功能</Text>
          </View>
        </View>
        <View className={styles.quickGrid}>
          {quickMenus.map((menu, index) => (
            <View
              key={index}
              className={styles.quickItem}
              onClick={() => handleQuickMenuClick(menu.path)}
            >
              <View className={`${styles.quickIcon} ${styles['quickIcon' + menu.color.charAt(0).toUpperCase() + menu.color.slice(1)]}`}>
                <Text>{menu.icon}</Text>
              </View>
              <Text className={styles.quickText}>{menu.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.noticeSection}>
        <View className={styles.sectionHeader}>
          <View className={styles.sectionTitle}>
            <View className={styles.sectionTitleDot}></View>
            <Text>最新公告</Text>
          </View>
          <Text
            className={styles.sectionMore}
            onClick={() => Taro.switchTab({ url: '/pages/public/index' })}
          >
            更多
          </Text>
        </View>
        <View className={styles.noticeCard}>
          {latestPublications.map((pub) => (
            <View
              key={pub.id}
              className={styles.noticeItem}
              onClick={() => handleNoticeClick(pub.id)}
            >
              <View className={styles.noticeTag}>
                <Tag text={getCategoryName(pub.category)} type={getCategoryTagType(pub.category)} />
              </View>
              <View className={styles.noticeContent}>
                <Text className={styles.noticeTitle}>{pub.title}</Text>
                <View className={styles.noticeMeta}>
                  <Text className={styles.noticePublisher}>{pub.publisher}</Text>
                  <Text className={styles.noticeDate}>{pub.publishTime}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;
