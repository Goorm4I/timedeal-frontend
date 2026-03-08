import axios from 'axios';
import { USE_MOCK, API_BASE_URL } from './config';
import { mockTimeDeals } from '../mocks/timedeals';
import { getAuthHeader } from './auth';

// Mock 데이터를 런타임에 수정할 수 있도록 별도 배열로 관리
let mockData = [...mockTimeDeals];
let nextId = Math.max(...mockTimeDeals.map(d => d.id)) + 1;

// 타임딜 목록 조회
export const getTimeDeals = async () => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockData];
  }

  const response = await axios.get(`${API_BASE_URL}/time-deals`);
  // 백엔드 응답 구조: { status, success, data: [...], error }
  // response.data 는 ApiResponse 객체 전체이므로
  // 실제 배열은 response.data.data 에 있음
  // ?? [] 는 data가 null/undefined일 때 빈 배열 반환 (deals.filter 오류 방지)
  return response.data.data ?? [];
};

// 타임딜 상세 조회
export const getTimeDeal = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const deal = mockData.find(d => d.id === Number(id));
    if (!deal) throw new Error('타임딜을 찾을 수 없습니다.');
    return deal;
  }

  const response = await axios.get(`${API_BASE_URL}/time-deals/${id}`);
  // 목록과 동일하게 ApiResponse 래퍼에서 실제 딜 객체 꺼냄
  return response.data.data;
};

// 타임딜 등록
export const createTimeDeal = async (payload) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newDeal = { ...payload, id: nextId++ };
    mockData.push(newDeal);
    return newDeal;
  }

  const response = await axios.post(`${API_BASE_URL}/time-deals`, payload, { headers: getAuthHeader() });
  return response.data;
};

// 타임딜 수정
export const updateTimeDeal = async (id, payload) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = mockData.findIndex(d => d.id === Number(id));
    if (idx === -1) throw new Error('타임딜을 찾을 수 없습니다.');
    mockData[idx] = { ...mockData[idx], ...payload };
    return mockData[idx];
  }

  const response = await axios.put(`${API_BASE_URL}/time-deals/${id}`, payload, { headers: getAuthHeader() });
  return response.data;
};

// 타임딜 삭제
export const deleteTimeDeal = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = mockData.findIndex(d => d.id === Number(id));
    if (idx === -1) throw new Error('타임딜을 찾을 수 없습니다.');
    mockData.splice(idx, 1);
    return { success: true };
  }

  const response = await axios.delete(`${API_BASE_URL}/time-deals/${id}`, { headers: getAuthHeader() });
  return response.data;
};

export default { getTimeDeals, getTimeDeal, createTimeDeal, updateTimeDeal, deleteTimeDeal };