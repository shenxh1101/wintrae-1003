import React, { useState } from 'react';
import { View, Text, Input, Textarea, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { eventTypeList } from '@/data/events';

const EventCreatePage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    reporter: '',
    reporterPhone: '',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    photos: [] as string[]
  });

  const typeOptions = eventTypeList.filter((t) => t !== '全部');

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeSelect = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      type: prev.type === type ? '' : type
    }));
  };

  const handlePrioritySelect = (priority: 'low' | 'medium' | 'high') => {
    setFormData((prev) => ({
      ...prev,
      priority
    }));
  };

  const handleGetLocation = () => {
    Taro.getLocation({
      type: 'gcj02'
    })
      .then((res) => {
        console.log('[EventCreate] 获取位置成功', res);
        setFormData((prev) => ({
          ...prev,
          location: `${res.latitude.toFixed(4)}, ${res.longitude.toFixed(4)}`
        }));
        Taro.showToast({ title: '定位成功', icon: 'success' });
      })
      .catch((err) => {
        console.error('[EventCreate] 获取位置失败', err);
        Taro.showToast({ title: '定位失败，请手动输入', icon: 'none' });
      });
  };

  const handleAddPhoto = () => {
    Taro.chooseImage({
      count: 9 - formData.photos.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    })
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, ...res.tempFilePaths]
        }));
      })
      .catch((err) => {
        console.error('[EventCreate] 选择图片失败', err);
      });
  };

  const handleDeletePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Taro.showToast({ title: '请输入事件标题', icon: 'none' });
      return;
    }
    if (!formData.type) {
      Taro.showToast({ title: '请选择事件类型', icon: 'none' });
      return;
    }
    if (!formData.description.trim()) {
      Taro.showToast({ title: '请输入问题描述', icon: 'none' });
      return;
    }

    Taro.showToast({
      title: '提交成功',
      icon: 'success'
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const getPriorityClass = (priority: string) => {
    if (formData.priority !== priority) return '';
    const map: Record<string, string> = {
      high: styles.priorityHighSelected,
      medium: styles.priorityMediumSelected,
      low: styles.priorityLowSelected
    };
    return map[priority] || '';
  };

  return (
    <ScrollView className={styles.createPage} scrollY>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📋</Text>
          基本信息
        </Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>事件标题</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入事件标题"
            placeholderClass={styles.placeholderText}
            value={formData.title}
            onInput={(e) => handleInputChange('title', e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>事件类型</Text>
          <View className={styles.typeSelector}>
            {typeOptions.map((type) => (
              <View
                key={type}
                className={`${styles.typeOption} ${formData.type === type ? styles.typeSelected : ''}`}
                onClick={() => handleTypeSelect(type)}
              >
                <Text>{type}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>优先级</Text>
          <View className={styles.prioritySelector}>
            <View
              className={`${styles.priorityOption} ${getPriorityClass('high')}`}
              onClick={() => handlePrioritySelect('high')}
            >
              <Text>高</Text>
            </View>
            <View
              className={`${styles.priorityOption} ${getPriorityClass('medium')}`}
              onClick={() => handlePrioritySelect('medium')}
            >
              <Text>中</Text>
            </View>
            <View
              className={`${styles.priorityOption} ${getPriorityClass('low')}`}
              onClick={() => handlePrioritySelect('low')}
            >
              <Text>低</Text>
            </View>
          </View>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>问题描述</Text>
          <Textarea
            className={styles.formTextarea}
            placeholder="请详细描述问题情况..."
            placeholderClass={styles.placeholderText}
            value={formData.description}
            onInput={(e) => handleInputChange('description', e.detail.value)}
            maxlength={500}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📞</Text>
          反映人信息
        </Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>姓名</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入反映人姓名"
            placeholderClass={styles.placeholderText}
            value={formData.reporter}
            onInput={(e) => handleInputChange('reporter', e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>电话</Text>
          <Input
            className={styles.formInput}
            type="number"
            placeholder="请输入联系电话"
            placeholderClass={styles.placeholderText}
            value={formData.reporterPhone}
            onInput={(e) => handleInputChange('reporterPhone', e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📍</Text>
          位置信息
        </Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>位置</Text>
          <View className={styles.locationItem}>
            <View className={styles.locationBtn} onClick={handleGetLocation}>
              <Text style={{ marginRight: '8rpx' }}>📍</Text>
              <Text>定位</Text>
            </View>
            {formData.location ? (
              <Text className={styles.locationText}>{formData.location}</Text>
            ) : (
              <Text className={`${styles.formInput} ${styles.placeholderText}`}>点击定位获取位置</Text>
            )}
          </View>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>详细地址</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入详细地址"
            placeholderClass={styles.placeholderText}
            value={formData.location}
            onInput={(e) => handleInputChange('location', e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <View style={{ padding: '32rpx' }}>
          <Text className={styles.sectionTitle} style={{ padding: 0, marginBottom: '24rpx' }}>
            <Text className={styles.titleIcon}>📷</Text>
            现场照片
          </Text>
          <View className={styles.photoGrid}>
            {formData.photos.map((photo, index) => (
              <View key={index} className={styles.photoItem}>
                <Image className={styles.photoImg} src={photo} mode="aspectFill" />
                <View className={styles.photoDelete} onClick={() => handleDeletePhoto(index)}>
                  <Text>×</Text>
                </View>
              </View>
            ))}
            {formData.photos.length < 9 && (
              <View className={styles.addPhoto} onClick={handleAddPhoto}>
                <Text className={styles.addPhotoIcon}>+</Text>
                <Text className={styles.addPhotoText}>拍照</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className={styles.submitBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitBtnText}>提交上报</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default EventCreatePage;
