import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import { industryList } from '@/data/industries';
import { IndustryProject } from '@/types';

const IndustryDetailPage: React.FC = () => {
  const router = useRouter();
  const [project, setProject] = useState<IndustryProject | null>(null);

  useEffect(() => {
    const id = router.params.id;
    const found = industryList.find((p) => p.id === id);
    if (found) {
      setProject(found);
    }
  }, [router.params.id]);

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; type: 'primary' | 'success' | 'warning' | 'info' }> = {
      active: { text: '进行中', type: 'primary' },
      completed: { text: '已完成', type: 'success' },
      planning: { text: '规划中', type: 'warning' }
    };
    return statusMap[status] || { text: status, type: 'info' };
  };

  if (!project) {
    return (
      <View className={styles.detailPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const statusInfo = getStatusInfo(project.status);

  return (
    <ScrollView className={styles.detailPage} scrollY>
      <Image
        className={styles.projectImage}
        src={project.image}
        mode="aspectFill"
      />

      <View className={styles.headerInfo}>
        <Text className={styles.projectTitle}>{project.name}</Text>
        <View className={styles.projectMeta}>
          <Tag text={project.type} type="info" size="small" />
          <Tag text={statusInfo.text} type={statusInfo.type} size="small" />
          <Text style={{ fontSize: '24rpx', color: '#86909C' }}>{project.createTime}</Text>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.statBlock}>
            <Text className={styles.statNum}>
              {project.output >= 10000
                ? (project.output / 10000).toFixed(1) + '万'
                : project.output}
            </Text>
            <Text className={styles.statLabel}>{project.outputUnit}</Text>
          </View>
          <View className={styles.statBlock}>
            <Text className={styles.statNum}>
              {(project.subsidyAmount / 10000).toFixed(1)}万
            </Text>
            <Text className={styles.statLabel}>补贴金额</Text>
          </View>
          <View className={styles.statBlock}>
            <Text className={styles.statNum}>{project.salesChannels.length}</Text>
            <Text className={styles.statLabel}>销售渠道</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📋</Text>
          项目信息
        </Text>
        <View className={styles.infoList}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>项目类型</Text>
            <Text className={styles.infoValue}>{project.type}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>项目规模</Text>
            <Text className={styles.infoValue}>{project.scale}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>所属合作社</Text>
            <Text className={styles.infoValue}>{project.cooperative}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>创建时间</Text>
            <Text className={styles.infoValue}>{project.createTime}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>💰</Text>
          产量与补贴
        </Text>
        <View className={styles.infoList}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>年产量</Text>
            <Text className={styles.infoValue}>
              {project.output} {project.outputUnit}
            </Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>补贴金额</Text>
            <Text className={styles.infoValue}>{project.subsidyAmount.toLocaleString()} 元</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>🛒</Text>
          销售渠道
        </Text>
        <View className={styles.channelsList}>
          {project.salesChannels.map((channel, index) => (
            <View key={index} className={styles.channelTag}>
              <Text>{channel}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📝</Text>
          项目介绍
        </Text>
        <Text className={styles.descText}>{project.description}</Text>
      </View>
    </ScrollView>
  );
};

export default IndustryDetailPage;
