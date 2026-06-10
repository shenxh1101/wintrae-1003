import React, { useState, useEffect } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { farmerList } from '@/data/farmers';
import { FamilyMember } from '@/types';

const helpTagOptions = ['脱贫户', '低保户', '五保户', '党员户', '种粮大户', '养殖大户', '返乡创业', '巾帼示范户', '独居老人', '普通农户'];

const FarmerEditPage: React.FC = () => {
  const router = useRouter();
  const isEdit = !!router.params.id;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    group: '一组',
    address: '',
    farmlandArea: '',
    helpTags: [] as string[],
    familyMembers: [] as FamilyMember[]
  });

  useEffect(() => {
    if (isEdit) {
      const id = router.params.id;
      const found = farmerList.find((f) => f.id === id);
      if (found) {
        setFormData({
          name: found.name,
          phone: found.phone,
          group: found.group,
          address: found.address,
          farmlandArea: String(found.farmlandArea),
          helpTags: [...found.helpTags],
          familyMembers: [...found.familyMembers]
        });
        Taro.setNavigationBarTitle({ title: '编辑农户' });
      }
    }
  }, [isEdit, router.params.id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => {
      const tags = prev.helpTags.includes(tag)
        ? prev.helpTags.filter((t) => t !== tag)
        : [...prev.helpTags, tag];
      return { ...prev, helpTags: tags };
    });
  };

  const handleAddFamily = () => {
    Taro.showToast({ title: '功能开发中', icon: 'none' });
  };

  const handleGroupSelect = () => {
    const groups = ['一组', '二组', '三组', '四组', '五组'];
    Taro.showActionSheet({
      itemList: groups
    })
      .then((res) => {
        handleInputChange('group', groups[res.tapIndex]);
      })
      .catch(() => {});
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Taro.showToast({ title: '请输入农户姓名', icon: 'none' });
      return;
    }
    if (!formData.phone.trim()) {
      Taro.showToast({ title: '请输入联系电话', icon: 'none' });
      return;
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
          <Text className={styles.formLabel}>姓名</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入姓名"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.name}
            onInput={(e) => handleInputChange('name', e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>电话</Text>
          <Input
            className={styles.formInput}
            type="number"
            placeholder="请输入手机号"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.phone}
            onInput={(e) => handleInputChange('phone', e.detail.value)}
          />
        </View>
        <View className={styles.formItem} onClick={handleGroupSelect}>
          <Text className={styles.formLabel}>组别</Text>
          <Text className={styles.formInput}>{formData.group}</Text>
          <Text className={styles.arrow}>›</Text>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>住址</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入详细地址"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.address}
            onInput={(e) => handleInputChange('address', e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>耕地面积</Text>
          <Input
            className={styles.formInput}
            type="digit"
            placeholder="请输入亩数"
            placeholderClass={styles.formInputPlaceholder}
            value={formData.farmlandArea}
            onInput={(e) => handleInputChange('farmlandArea', e.detail.value)}
          />
          <Text style={{ color: '#86909C', marginLeft: '8rpx', fontSize: '24rpx' }}>亩</Text>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>🏷️</Text>
          帮扶标签
        </Text>
        <View style={{ padding: '0 32rpx 24rpx' }}>
          <View className={styles.tagsSelector}>
            {helpTagOptions.map((tag) => (
              <View
                key={tag}
                className={`${styles.tagOption} ${formData.helpTags.includes(tag) ? styles.tagSelected : ''}`}
                onClick={() => toggleTag(tag)}
              >
                <Text>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>👨‍👩‍👧‍👦</Text>
          家庭成员
        </Text>
        <View className={styles.familyList}>
          {formData.familyMembers.length > 0 ? (
            formData.familyMembers.map((member, index) => (
              <View key={index} className={styles.familyItem}>
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
            ))
          ) : (
            <View style={{ padding: '32rpx 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '24rpx', color: '#86909C' }}>暂无家庭成员信息</Text>
            </View>
          )}
        </View>
        <View className={styles.addFamilyBtn} onClick={handleAddFamily}>
          <Text style={{ marginRight: '8rpx' }}>+</Text>
          <Text>添加家庭成员</Text>
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

export default FarmerEditPage;
