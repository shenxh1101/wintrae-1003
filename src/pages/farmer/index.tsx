import React, { useState, useMemo } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import EmptyState from '@/components/EmptyState';
import { groupList } from '@/data/farmers';
import { useAppStore } from '@/store';
import { Farmer } from '@/types';

const FarmerPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeGroup, setActiveGroup] = useState('全部');
  const [refreshing, setRefreshing] = useState(false);
  const farmers = useAppStore((s) => s.farmers);

  const filteredFarmers = useMemo(() => {
    return farmers.filter((farmer) => {
      const matchSearch =
        !searchText ||
        farmer.name.includes(searchText) ||
        farmer.phone.includes(searchText) ||
        farmer.address.includes(searchText);
      const matchGroup = activeGroup === '全部' || farmer.group === activeGroup;
      return matchSearch && matchGroup;
    });
  }, [farmers, searchText, activeGroup]);

  const handleFarmerClick = (farmer: Farmer) => {
    Taro.navigateTo({
      url: `/pages/farmer-detail/index?id=${farmer.id}`
    });
  };

  const handleAddFarmer = () => {
    Taro.navigateTo({
      url: '/pages/farmer-edit/index'
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

  return (
    <ScrollView
      className={styles.farmerPage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={() => setRefreshing(true)}
    >
      <View className={styles.searchBar}>
        <View className={styles.searchInputWrap}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索农户姓名/电话"
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.filterSection}>
        <ScrollView
          className={styles.filterScroll}
          scrollX
          showScrollbar={false}
        >
          {groupList.map((group) => (
            <View
              key={group}
              className={`${styles.filterItem} ${activeGroup === group ? styles.filterActive : ''}`}
              onClick={() => setActiveGroup(group)}
            >
              <Text>{group}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.listSection}>
        {filteredFarmers.length > 0 ? (
          filteredFarmers.map((farmer) => (
            <View
              key={farmer.id}
              className={styles.farmerCard}
              onClick={() => handleFarmerClick(farmer)}
            >
              <View className={styles.cardHeader}>
                <Image className={styles.avatar} src={farmer.avatar} mode="aspectFill" />
                <View className={styles.farmerInfo}>
                  <Text className={styles.farmerName}>{farmer.name}</Text>
                  <Text className={styles.farmerMeta}>
                    {farmer.group} · {farmer.phone}
                  </Text>
                </View>
              </View>
              <View className={styles.farmerStats}>
                <View className={styles.statItem}>
                  <Text className={styles.statNum}>{farmer.familyMembers.length}</Text>
                  <Text className={styles.statLabel}>口人</Text>
                </View>
                <View className={styles.statItem}>
                  <Text className={styles.statNum}>{farmer.farmlandArea}</Text>
                  <Text className={styles.statLabel}>亩耕地</Text>
                </View>
              </View>
              <View className={styles.tagsWrap}>
                {farmer.helpTags.map((tag, index) => (
                  <Tag
                    key={index}
                    text={tag}
                    type={tag === '脱贫户' || tag === '低保户' || tag === '五保户' ? 'warning' : 'primary'}
                  />
                ))}
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyWrap}>
            <EmptyState text="暂无农户信息" />
          </View>
        )}
      </View>

      <View className={styles.addBtn} onClick={handleAddFarmer}>
        <Text className={styles.addBtnText}>+</Text>
      </View>
    </ScrollView>
  );
};

export default FarmerPage;
