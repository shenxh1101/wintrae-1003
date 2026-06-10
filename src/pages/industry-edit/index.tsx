import React, { useState, useEffect } from 'react';
import { View, Text, Input, ScrollView, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import { IndustryProject } from '@/types';

const typeOptions = ['种植业', '养殖业', '乡村旅游'];
const statusOptions = [
  { value: 'active', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'planning', label: '规划中' }
];

const IndustryEditPage: React.FC = () => {
  const router = useRouter();
  const isEdit = !!router.params.id;
  const getIndustry = useAppStore((s) => s.getIndustry);
  const addIndustry = useAppStore((s) => s.addIndustry);
  const updateIndustry = useAppStore((s) => s.updateIndustry);
  const industries = useAppStore((s) => s.industries);

  const [formData, setFormData] = useState({
    name: '',
    type: '种植业',
    scale: '',
    output: '',
    outputUnit: '',
    salesChannels: [] as string[],
    subsidyAmount: '',
    cooperative: '',
    status: 'active' as 'active' | 'completed' | 'planning',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (isEdit) {
      const id = router.params.id;
      const found = getIndustry(id);
      if (found) {
        setFormData({
          name: found.name,
          type: found.type,
          scale: found.scale,
          output: String(found.output),
          outputUnit: found.outputUnit,
          salesChannels: [...found.salesChannels],
          subsidyAmount: String(found.subsidyAmount),
          cooperative: found.cooperative,
          status: found.status,
          description: found.description,
          image: found.image
        });
        Taro.setNavigationBarTitle({ title: '编辑产业项目' });
      }
    }
  }, [isEdit, router.params.id, getIndustry, industries]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeSelect = () => {
    Taro.showActionSheet({
      itemList: typeOptions
    })
      .then((res) => {
        handleInputChange('type', typeOptions[res.tapIndex]);
      })
      .catch(() => {});
  };

  const handleStatusSelect = () => {
    const labels = statusOptions.map((o) => o.label);
    Taro.showActionSheet({
      itemList: labels
    })
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          status: statusOptions[res.tapIndex].value as 'active' | 'completed' | 'planning'
        }));
      })
      .catch(() => {});
  };

  const getStatusLabel = (value: string) => {
    return statusOptions.find((o) => o.value === value)?.label || value;
  };

  const handleChannelChange = (index: number, value: string) => {
    setFormData((prev) => {
      const channels = [...prev.salesChannels];
      channels[index] = value;
      return { ...prev, salesChannels: channels };
    });
  };

  const handleAddChannel = () => {
    setFormData((prev) => ({
      ...prev,
      salesChannels: [...prev.salesChannels, '']
    }));
  };

  const handleDeleteChannel = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      salesChannels: prev.salesChannels.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Taro.showToast({ title: '请输入项目名称', icon: 'none' });
      return;
    }
    if (!formData.type.trim()) {
      Taro.showToast({ title: '请选择项目类型', icon: 'none' });
      return;
    }
    if (!formData.scale.trim()) {
      Taro.showToast({ title: '请输入项目规模', icon: 'none' });
      return;
    }

    const validChannels = formData.salesChannels.filter((c) => c.trim() !== '');

    const projectData: Omit<IndustryProject, 'id'> = {
      name: formData.name.trim(),
      type: formData.type,
      scale: formData.scale.trim(),
      output: Number(formData.output) || 0,
      outputUnit: formData.outputUnit.trim(),
      salesChannels: validChannels,
      subsidyAmount: Number(formData.subsidyAmount) || 0,
      cooperative: formData.cooperative.trim(),
      status: formData.status,
      description: formData.description.trim(),
      createTime: new Date().toISOString().split('T')[0],
      image: formData.image.trim() || `https://picsum.photos/id/${292 + Math.floor(Math.random() * 500)}/750/500`
    };

    if (isEdit) {
      updateIndustry(router.params.id, projectData);
    } else {
      addIndustry(projectData);
    }

    Taro.showToast({
      title: isEdit ? '保存成功' : '添加成功',
      icon: 'success'
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <ScrollView className={styles.editPage} scrollY>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📝</Text>
          基本信息
        </Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>项目名称</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入项目名称"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.name}
            onInput={(e) => handleInputChange('name', e.detail.value)}
          />
        </View>
        <View className={styles.formItem} onClick={handleTypeSelect}>
          <Text className={styles.formLabel}>项目类型</Text>
          <Text className={styles.formInput}>{formData.type}</Text>
          <Text className={styles.arrow}>›</Text>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>项目规模</Text>
          <Input
            className={styles.formInput}
            placeholder="如 200亩 / 5000只"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.scale}
            onInput={(e) => handleInputChange('scale', e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>所属合作社</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入合作社名称"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.cooperative}
            onInput={(e) => handleInputChange('cooperative', e.detail.value)}
          />
        </View>
        <View className={styles.formItem} onClick={handleStatusSelect}>
          <Text className={styles.formLabel}>项目状态</Text>
          <Text className={styles.formInput}>{getStatusLabel(formData.status)}</Text>
          <Text className={styles.arrow}>›</Text>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📊</Text>
          产量与补贴
        </Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>产量</Text>
          <Input
            className={styles.formInput}
            type="digit"
            placeholder="请输入产量数字"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.output}
            onInput={(e) => handleInputChange('output', e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>产量单位</Text>
          <Input
            className={styles.formInput}
            placeholder="如 公斤/年、只/年"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.outputUnit}
            onInput={(e) => handleInputChange('outputUnit', e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>补贴金额</Text>
          <Input
            className={styles.formInput}
            type="digit"
            placeholder="请输入补贴金额(元)"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.subsidyAmount}
            onInput={(e) => handleInputChange('subsidyAmount', e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>🛒</Text>
          销售渠道
        </Text>
        <View className={styles.channelsList}>
          {formData.salesChannels.length > 0 ? (
            formData.salesChannels.map((channel, index) => (
              <View key={index} className={styles.channelItem}>
                <Input
                  className={styles.channelInput}
                  placeholder={`销售渠道 ${index + 1}`}
                  placeholderClass={styles.formInputPlaceholder}
                  value={channel}
                  onInput={(e) => handleChannelChange(index, e.detail.value)}
                />
                <View
                  className={styles.deleteChannelBtn}
                  onClick={() => handleDeleteChannel(index)}
                >
                  <Text>删除</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={{ padding: '24rpx 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '24rpx', color: '#86909C' }}>暂无销售渠道，点击下方添加</Text>
            </View>
          )}
        </View>
        <View className={styles.addChannelBtn} onClick={handleAddChannel}>
          <Text style={{ marginRight: '8rpx' }}>+</Text>
          <Text>添加销售渠道</Text>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📋</Text>
          项目介绍
        </Text>
        <View className={styles.textareaWrap}>
          <Text className={styles.textareaLabel}>项目介绍</Text>
          <Textarea
            className={styles.formTextarea}
            placeholder="请输入项目详细介绍"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.description}
            onInput={(e) => handleInputChange('description', e.detail.value)}
            maxlength={500}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>🖼️</Text>
          图片信息
        </Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>图片URL</Text>
          <Input
            className={styles.formInput}
            placeholder="选填，默认使用随机图片"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.image}
            onInput={(e) => handleInputChange('image', e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.submitBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitBtnText}>保 存</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default IndustryEditPage;
