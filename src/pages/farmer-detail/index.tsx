import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import { farmerList } from '@/data/farmers';
import { Farmer } from '@/types';

const FarmerDetailPage: React.FC = () => {
  const router = useRouter();
  const [farmer, setFarmer] = useState<Farmer | null>(null);

  useEffect(() => {
    const id = router.params.id;
    const found = farmerList.find((f) => f.id === id);
    if (found) {
      setFarmer(found);
    }
  }, [router.params.id]);

  const handleCall = () => {
    if (farmer?.phone) {
      Taro.makePhoneCall({
        phoneNumber: farmer.phone
      }).catch((err) => {
        console.error('[FarmerDetail] 拨打电话失败', err);
      });
    }
  };

  const handleEdit = () => {
    Taro.navigateTo({
      url: `/pages/farmer-edit/index?id=${farmer?.id}`
    });
  };

  if (!farmer) {
    return (
      <View className={styles.detailPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView className={styles.detailPage} scrollY>
      <View className={styles.headerCard}>
        <View className={styles.editBtn} onClick={handleEdit}>
          <Text>✏️</Text>
          <Text className={styles.editBtnText}>编辑</Text>
        </View>
        <View className={styles.headerContent}>
          <Image className={styles.avatar} src={farmer.avatar} mode="aspectFill" />
          <View className={styles.farmerInfo}>
            <Text className={styles.farmerName}>{farmer.name}</Text>
            <Text className={styles.farmerMeta}>
              {farmer.group} · {farmer.phone}
            </Text>
            <Text className={styles.farmerMeta}>{farmer.address}</Text>
            <View className={styles.tagsWrap}>
              {farmer.helpTags.map((tag, index) => (
                <Tag
                  key={index}
                  text={tag}
                  type={tag === '脱贫户' || tag === '低保户' || tag === '五保户' ? 'warning' : 'primary'}
                  size="small"
                />
              ))}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>👨‍👩‍👧‍👦</Text>
          家庭成员（{farmer.familyMembers.length}口人）
        </Text>
        <View className={styles.familyList}>
          {farmer.familyMembers.map((member, index) => (
            <View key={index} className={styles.familyItem}>
              <View className={styles.familyAvatar}>
                <Text>👤</Text>
              </View>
              <View className={styles.familyInfo}>
                <Text className={styles.familyName}>
                  {member.name}
                  <Text style={{ fontSize: '24rpx', color: '#86909C', marginLeft: '12rpx' }}>
                    {member.relation}
                  </Text>
                </Text>
                <Text className={styles.familyDesc}>
                  {member.age}岁{member.phone ? ` · ${member.phone}` : ''}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>🌾</Text>
          耕地信息
        </Text>
        <View className={styles.infoList}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>耕地面积</Text>
            <Text className={styles.infoValue}>{farmer.farmlandArea} 亩</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>耕地位置</Text>
            <Text className={styles.infoValue}>{farmer.group}耕地</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>主要作物</Text>
            <Text className={styles.infoValue}>水稻、小麦</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📞</Text>
          联系方式
        </Text>
        <View className={styles.infoList}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>联系电话</Text>
            <Text className={styles.infoValue}>{farmer.phone}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>家庭住址</Text>
            <Text className={styles.infoValue}>{farmer.address}</Text>
          </View>
        </View>
      </View>

      <View className={styles.contactBtn} onClick={handleCall}>
        <Text>📞</Text>
        <Text className={styles.contactBtnText}>拨打电话</Text>
      </View>
    </ScrollView>
  );
};

export default FarmerDetailPage;
