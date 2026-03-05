import axios from 'axios';
import { USE_MOCK, API_BASE_URL } from './config';
import { mockTimeDeals } from '../mocks/timedeals';

// 타임딜 목록 조회
export const getTimeDeals = async () => {
  if (USE_MOCK) {
    // Mock: 약간의 딜레이 추가
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTimeDeals;
  }

  const response = await axios.get(`${API_BASE_URL}/api/timedeals`);
  return response.data;
};

// 타임딜 상세 조회
export const getTimeDeal = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const deal = mockTimeDeals.find(d => d.id === Number(id));
    if (!deal) throw new Error('타임딜을 찾을 수 없습니다.');
    return deal;
  }

  const response = await axios.get(`${API_BASE_URL}/api/timedeals/${id}`);
  return response.data;
};

export default { getTimeDeals, getTimeDeal };
