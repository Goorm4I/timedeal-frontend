// src/api/address.js

import axios from 'axios';
import { USE_MOCK, API_BASE_URL } from './config';
import { getAuthHeader } from './auth';

// Mock 배송지 저장소
let mockAddresses = [];
let mockIdCounter = 1;

const authHeaders = () => ({
  headers: {
    ...getAuthHeader(),
    'Content-Type': 'application/json',
  },
});

// 배송지 목록 조회
export const getAddresses = async () => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockAddresses];
  }

  const response = await axios.get(
    `${API_BASE_URL}/api/v1/users/me/addresses`,
    authHeaders()
  );
  return response.data.data;
};

// 배송지 등록
export const createAddress = async ({
  recipientName,
  phoneNumber,
  secondaryPhoneNumber = null,
  zipCode,
  baseAddress,
  detailAddress = null,
  requestMessage = null,
  isDefault = false,
}) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newAddress = {
      id: String(mockIdCounter++),
      recipientName,
      phoneNumber,
      secondaryPhoneNumber,
      zipCode,
      baseAddress,
      detailAddress,
      requestMessage,
      isDefault,
      lastUsedAt: new Date().toISOString(),
    };
    if (isDefault) {
      mockAddresses = mockAddresses.map(a => ({ ...a, isDefault: false }));
    }
    mockAddresses.push(newAddress);
    return newAddress;
  }

  const response = await axios.post(
    `${API_BASE_URL}/api/v1/users/me/addresses`,
    { recipientName, phoneNumber, secondaryPhoneNumber, zipCode, baseAddress, detailAddress, requestMessage, isDefault },
    authHeaders()
  );
  return response.data.data;
};

// 배송지 수정
export const updateAddress = async (addressId, payload) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = mockAddresses.findIndex(a => a.id === String(addressId));
    if (idx === -1) throw new Error('배송지를 찾을 수 없습니다.');
    if (payload.isDefault) {
      mockAddresses = mockAddresses.map(a => ({ ...a, isDefault: false }));
    }
    mockAddresses[idx] = { ...mockAddresses[idx], ...payload };
    return mockAddresses[idx];
  }

  const response = await axios.put(
    `${API_BASE_URL}/api/v1/users/me/addresses/${addressId}`,
    payload,
    authHeaders()
  );
  return response.data.data;
};

// 배송지 삭제
export const deleteAddress = async (addressId) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const idx = mockAddresses.findIndex(a => a.id === String(addressId));
    if (idx === -1) throw new Error('배송지를 찾을 수 없습니다.');
    mockAddresses.splice(idx, 1);
    return { success: true };
  }

  const response = await axios.delete(
    `${API_BASE_URL}/api/v1/users/me/addresses/${addressId}`,
    authHeaders()
  );
  return response.data;
};

export default { getAddresses, createAddress, updateAddress, deleteAddress };