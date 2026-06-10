import React, { useState, useEffect } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import { FamilyMember } from '@/types';

const helpTagOptions = ['脱贫户', '低保户', '五保户', '党员户', '种粮大户', '养殖大户', '返乡创业', '巾帼示范户', '独居老人', '普通农户'];

const FarmerEditPage: React.FC = () => {
  const router = useRouter();
  const isEdit = !!router.params.id;
  const addFarmer = useAppStore((s) => s.addFarmer);
  const updateFarmer = useAppStore((s) => s.updateFarmer);
  const getFarmer = useAppStore((s) => s.getFarmer);
  const farmers = useAppStore((s) => s.farmers);

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
      const found = getFarmer(id);
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
  }, [isEdit, router.params.id, getFarmer, farmers]);

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
    const showInput = (title: string, placeholder: string, type?: 'text' | 'number' | 'digit'): Promise<string | null> => {
      return new Promise((resolve) => {
        Taro.showModal({
          title,
          editable: true,
          placeholderText: placeholder,
          confirmText: '下一步',
          cancelText: '取消'
        } as any).then((res) => {
          if (res.confirm) {
            resolve(res.content || '');
          } else {
            resolve(null);
          }
        }).catch(() => resolve(null));
      });
    };

    const addMember = async () => {
      const name = await showInput('成员姓名', '请输入姓名');
      if (name === null) return;
      if (!name.trim()) {
        Taro.showToast({ title: '姓名不能为空', icon: 'none' });
        return;
      }

      const relation = await showInput('与户主关系', '如：配偶、子女、父母等');
      if (relation === null) return;
      if (!relation.trim()) {
        Taro.showToast({ title: '关系不能为空', icon: 'none' });
        return;
      }

      const ageStr = await showInput('年龄', '请输入年龄', 'number');
      if (ageStr === null) return;
      const age = parseInt(ageStr, 10);
      if (!age || age <= 0) {
        Taro.showToast({ title: '请输入有效年龄', icon: 'none' });
        return;
      }

      const phone = await showInput('联系电话（选填）', '请输入电话号码');
      if (phone === null) return;

      const newMember: FamilyMember = {
        name: name.trim(),
        relation: relation.trim(),
        age,
        ...(phone.trim() ? { phone: phone.trim() } : {})
      };

      setFormData((prev) => ({
        ...prev,
        familyMembers: [...prev.familyMembers, newMember]
      }));
      Taro.showToast({ title: '已添加', icon: 'success' });
    };

    addMember();
  };

  const handleDeleteFamily = (index: number) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除该家庭成员吗？',
      confirmText: '删除',
      confirmColor: '#F53F3F'
    }).then((res) => {
      if (res.confirm) {
        setFormData((prev) => ({
          ...prev,
          familyMembers: prev.familyMembers.filter((_, i) => i !== index)
        }));
      }
    }).catch(() => {});
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

    const avatar = `https://picsum.photos/id/${64 + Math.floor(Math.random() * 100)}/200/200`;
    const farmlandArea = parseFloat(formData.farmlandArea) || 0;

    if (isEdit) {
      const id = router.params.id;
      updateFarmer(id, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        group: formData.group,
        address: formData.address.trim(),
        farmlandArea,
        helpTags: formData.helpTags,
        familyMembers: formData.familyMembers
      });
    } else {
      addFarmer({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        group: formData.group,
        address: formData.address.trim(),
        farmlandArea,
        helpTags: formData.helpTags,
        familyMembers: formData.familyMembers,
        avatar
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
                <View
                  style={{
                    padding: '8rpx 16rpx',
                    color: '#F53F3F',
                    fontSize: '24rpx'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFamily(index);
                  }}
                >
                  删除
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
