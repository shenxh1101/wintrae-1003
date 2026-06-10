import React, { useState, useEffect } from 'react';
import { View, Text, Input, Textarea, ScrollView, Picker } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import { Publication } from '@/types';

const categoryOptions = [
  { label: '通知公告', value: 'notice' },
  { label: '会议纪要', value: 'meeting' },
  { label: '资金使用', value: 'fund' },
  { label: '政策解读', value: 'policy' }
];

const getToday = () => new Date().toISOString().split('T')[0];

const PublicEditPage: React.FC = () => {
  const router = useRouter();
  const store = useAppStore();
  const isEdit = !!router.params.id;
  const [originalPublication, setOriginalPublication] = useState<Publication | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'notice',
    publisher: '',
    content: ''
  });

  const categoryIndex = categoryOptions.findIndex((c) => c.value === formData.category);

  const loadData = () => {
    if (isEdit) {
      const id = router.params.id;
      const found = store.getPublication(id);
      if (found) {
        setOriginalPublication(found);
        setFormData({
          title: found.title,
          category: found.category,
          publisher: found.publisher,
          content: found.content
        });
        Taro.setNavigationBarTitle({ title: '编辑公示' });
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [isEdit, router.params.id, store]);

  useDidShow(() => {
    loadData();
  });

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

  const validateForm = () => {
    if (!formData.title.trim()) {
      Taro.showToast({ title: '请输入标题', icon: 'none' });
      return false;
    }
    if (!formData.publisher.trim()) {
      Taro.showToast({ title: '请输入发布人', icon: 'none' });
      return false;
    }
    if (!formData.content.trim()) {
      Taro.showToast({ title: '请输入内容', icon: 'none' });
      return false;
    }
    return true;
  };

  const getBasePayload = () => ({
    title: formData.title.trim(),
    category: formData.category as any,
    publisher: formData.publisher.trim(),
    content: formData.content.trim()
  });

  const handleSaveDraft = () => {
    if (!validateForm()) return;

    const payload = getBasePayload();

    if (isEdit) {
      store.updatePublication(router.params.id, {
        ...payload,
        status: 'draft'
      });
      Taro.showToast({ title: '已保存为草稿', icon: 'success' });
    } else {
      store.addPublication(payload);
      const newPub = store.publications[0];
      if (newPub) {
        store.updatePublication(newPub.id, {
          publishTime: ''
        });
      }
      Taro.showToast({ title: '已保存为草稿', icon: 'success' });
    }

    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  };

  const handlePublish = () => {
    if (!validateForm()) return;

    const payload = getBasePayload();

    if (isEdit) {
      store.updatePublication(router.params.id, payload);
      store.publishPublication(router.params.id);
      Taro.showToast({ title: '已发布', icon: 'success' });
    } else {
      store.addPublication({
        ...payload,
        status: 'draft',
        publishTime: ''
      });
      const newPub = store.publications[0];
      if (newPub) {
        store.publishPublication(newPub.id);
      }
      Taro.showToast({ title: '已发布', icon: 'success' });
    }

    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  };

  const handleSavePublished = () => {
    if (!validateForm()) return;

    const payload = getBasePayload();

    store.savePublishedPublication(router.params.id, {
      ...payload,
      publishTime: getToday()
    });

    Taro.showToast({ title: '已保存修改', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  };

  const handleWithdrawToDraft = () => {
    if (!validateForm()) return;

    Taro.showModal({
      title: '确认撤回为草稿',
      content: '撤回后该公示将从群众端移除，变为已撤回状态，是否继续？',
      success: (res) => {
        if (res.confirm) {
          const payload = getBasePayload();
          store.updatePublication(router.params.id, payload);
          store.withdrawPublication(router.params.id);
          Taro.showToast({ title: '已撤回', icon: 'success' });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1000);
        }
      }
    });
  };

  const isEditingPublished = isEdit && originalPublication?.status === 'published';
  const isEditingWithdrawn = isEdit && originalPublication?.status === 'withdrawn';

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
        {isEditingPublished ? (
          <>
            <View className={styles.secondaryBtn} onClick={handleSavePublished}>
              <Text className={styles.secondaryBtnText}>💾 保存修改</Text>
            </View>
            <View className={styles.dangerBtn} onClick={handleWithdrawToDraft}>
              <Text className={styles.dangerBtnText}>↩️ 撤回</Text>
            </View>
          </>
        ) : (
          <>
            <View className={styles.secondaryBtn} onClick={handleSaveDraft}>
              <Text className={styles.secondaryBtnText}>📄 存草稿</Text>
            </View>
            <View className={styles.primaryBtn} onClick={handlePublish}>
              <Text className={styles.primaryBtnText}>
                {isEditingWithdrawn ? '🚀 重新发布' : '🚀 发布'}
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default PublicEditPage;
