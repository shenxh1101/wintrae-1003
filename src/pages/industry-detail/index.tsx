import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import { useAppStore } from '@/store';
import { IndustryProject, IndustryRecord } from '@/types';

const IndustryDetailPage: React.FC = () => {
  const router = useRouter();
  const getIndustry = useAppStore((s) => s.getIndustry);
  const addIndustryRecord = useAppStore((s) => s.addIndustryRecord);
  const industries = useAppStore((s) => s.industries);
  const [project, setProject] = useState<IndustryProject | null>(null);

  useEffect(() => {
    const id = router.params.id;
    const found = getIndustry(id);
    if (found) {
      setProject(found);
    }
  }, [router.params.id, getIndustry, industries]);

  const handleEdit = () => {
    Taro.navigateTo({
      url: `/pages/industry-edit/index?id=${project?.id}`
    });
  };

  const handleAddRecord = async () => {
    if (!project) return;

    try {
      const typeRes = await Taro.showActionSheet({
        itemList: ['产量登记', '补贴发放']
      });
      const type = typeRes.tapIndex === 0 ? 'output' : 'subsidy';

      const amountRes = await Taro.showModal({
        title: type === 'output' ? '请输入产量' : '请输入补贴金额',
        editable: true,
        placeholderText: '请输入数字'
      });
      if (!amountRes.confirm || !amountRes.content) return;
      const amount = parseFloat(amountRes.content);
      if (isNaN(amount) || amount <= 0) {
        Taro.showToast({ title: '请输入有效的数字', icon: 'none' });
        return;
      }

      let unit = '';
      if (type === 'output') {
        const unitRes = await Taro.showModal({
          title: '请输入单位',
          editable: true,
          placeholderText: '如公斤、只、人次等'
        });
        if (!unitRes.confirm || !unitRes.content) return;
        unit = unitRes.content.trim();
      }

      const descRes = await Taro.showModal({
        title: '请输入说明',
        editable: true,
        placeholderText: '请输入记录说明'
      });
      if (!descRes.confirm || !descRes.content) return;
      const description = descRes.content.trim();

      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const time = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

      addIndustryRecord(project.id, {
        type,
        amount,
        unit,
        description,
        operator: '村委会',
        time
      });

      Taro.showToast({ title: '记录成功', icon: 'success' });
    } catch (e) {
      console.log('用户取消操作');
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; type: 'primary' | 'success' | 'warning' | 'info' }> = {
      active: { text: '进行中', type: 'primary' },
      completed: { text: '已完成', type: 'success' },
      planning: { text: '规划中', type: 'warning' }
    };
    return statusMap[status] || { text: status, type: 'info' };
  };

  const getRecordTypeInfo = (type: string) => {
    const typeMap: Record<string, { text: string; className: string }> = {
      output: { text: '产量登记', className: styles.recordTypeOutput },
      subsidy: { text: '补贴发放', className: styles.recordTypeSubsidy }
    };
    return typeMap[type] || { text: type, className: styles.recordTypeOutput };
  };

  const sortedRecords = project?.records
    ? [...project.records].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    : [];

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
      <View className={styles.imageWrap}>
        <Image
          className={styles.projectImage}
          src={project.image}
          mode="aspectFill"
        />
        <View className={styles.editBtn} onClick={handleEdit}>
          <Text>✏️</Text>
          <Text className={styles.editBtnText}>编辑</Text>
        </View>
        <View className={styles.addRecordBtn} onClick={handleAddRecord}>
          <Text>+</Text>
          <Text className={styles.addRecordBtnText}>记一笔</Text>
        </View>
      </View>

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
          <Text className={styles.titleIcon}>📊</Text>
          流水记录
        </Text>
        {sortedRecords.length > 0 ? (
          <View className={styles.recordList}>
            {sortedRecords.map((record: IndustryRecord) => {
              const typeInfo = getRecordTypeInfo(record.type);
              return (
                <View key={record.id} className={styles.recordItem}>
                  <View className={styles.recordHeader}>
                    <Text className={styles.recordTime}>{record.time}</Text>
                    <View className={`${styles.recordType} ${typeInfo.className}`}>
                      <Text>{typeInfo.text}</Text>
                    </View>
                  </View>
                  <Text className={styles.recordDesc}>{record.description}</Text>
                  <View className={styles.recordFooter}>
                    <Text className={styles.recordAmount}>
                      {record.type === 'output' ? '+' : '+'}
                      {record.amount.toLocaleString()}
                      {record.unit ? ` ${record.unit}` : ' 元'}
                    </Text>
                    <Text className={styles.recordOperator}>操作人：{record.operator}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View className={styles.recordEmpty}>
            <Text style={{ fontSize: '24rpx', color: '#86909C' }}>暂无流水记录，点击右上角"记一笔"添加</Text>
          </View>
        )}
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
