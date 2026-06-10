import React, { useState, useEffect } from 'react';
import { View, Text, Input, Textarea, ScrollView, Picker } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store';

const categoryOptions = [
  { label: '通知公告', value: 'notice' },
  { label: '会议纪要', value: 'meeting' },
  { label: '资金使用', value: 'fund' },
  { label: '政策解读', value: 'policy' }
];

const PublicEditPage: React.FC = () => {
  const router = useRouter();
  const store = useAppStore();
  const isEdit = !!router.params.id;

  const [formData, setFormData] = useState({
    title: '',
    category: 'notice',
    publisher: '',
    content: ''
  });

  const categoryIndex = categoryOptions.findIndex((c) => c.value === formData.category);

  useEffect(() => {
    if (isEdit) {
      const id = router.params.id;
      const found = store.getPublication(id);
      if (found) {
        setFormData({
          title: found.title,
          category: found.category,
          publisher: found.publisher,
          content: found.content
        });
        Taro.setNavigationBarTitle({ title: '编辑公示' });
      }
    }
  }, [isEdit, router.params.id, store]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (e: any) => {
    const index = Number(e.detail.value);
    handleInputChange('category', categoryOptions[index].value);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Taro.showToast({ title: '请输入标题', icon: 'none' });
      return;
    }
    if (!formData.publisher.trim()) {
      Taro.showToast({ title: '请输入发布人', icon: 'none' });
      return;
    }
    if (!formData.content.trim()) {
      Taro.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    if (isEdit) {
      store.updatePublication(router.params.id, {
        title: formData.title.trim(),
        category: formData.category as any,
        publisher: formData.publisher.trim(),
        content: formData.content.trim()
      });
    } else {
      store.addPublication({
        title: formData.title.trim(),
        category: formData.category as any,
        publisher: formData.publisher.trim(),
        content: formData.content.trim()
      });
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
          公示信息
        </Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>标题</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入标题"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.title}
            onInput={(e) => handleInputChange('title', e.detail.value)}
          />
        </View>
        <Picker
          mode="selector"
          range={categoryOptions.map((c) => c.label)}
          value={categoryIndex}
          onChange={handleCategoryChange}
        >
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>分类</Text>
            <Text className={styles.formInput}>
              {categoryOptions.find((c) => c.value === formData.category)?.label}
            </Text>
            <Text className={styles.arrow}>›</Text>
          </View>
        </Picker>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>发布人</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入发布人"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.publisher}
            onInput={(e) => handleInputChange('publisher', e.detail.value)}
          />
        </View>
        <View className={styles.formTextareaWrap}>
          <Text className={styles.formTextareaLabel}>内容</Text>
          <Textarea
            className={styles.formTextarea}
            placeholder="请输入公示内容"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.content}
            onInput={(e) => handleInputChange('content', e.detail.value)}
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

export default PublicEditPage;
