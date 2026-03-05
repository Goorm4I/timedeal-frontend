// src/api/auth.js

import { USE_MOCK } from './config';

// 목업 유저 데이터
const MOCK_USERS = [
  { id: 'admin', password: '123456', name: '관리자' },
  { id: 'test', password: '1234', name: '테스트유저' },
];

// 로그인
export const login = async ({ id, password, remember }) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = MOCK_USERS.find(u => u.id === id && u.password === password);
    if (!user) throw new Error('아이디 또는 비밀번호가 올바르지 않아요.');
    const userData = { id: user.id, name: user.name, phone: user.phone || '' };
    if (remember) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
    }
    return userData;
  }
  // const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { id, password });
  // return response.data;
};

// 회원가입 (가입 즉시 자동 로그인 - sessionStorage에 저장, 주소 제외)
export const register = async ({ id, password, name, phone }) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const exists = MOCK_USERS.find(u => u.id === id);
    if (exists) throw new Error('이미 사용 중인 아이디예요.');
    MOCK_USERS.push({ id, password, name, phone });
    const userData = { id, name, phone };
    sessionStorage.setItem('user', JSON.stringify(userData));
    return userData;
  }
  // const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { id, password, name, phone });
  // sessionStorage.setItem('user', JSON.stringify(response.data));
  // return response.data;
};

// 배송지 저장 (localStorage에 유저별로 저장)
export const saveAddress = ({ zipcode, address, addressDetail }) => {
  const user = getCurrentUser();
  if (!user) return;
  const addressData = { zipcode, address, addressDetail };
  localStorage.setItem(`address_${user.id}`, JSON.stringify(addressData));
  // 현재 유저 세션에도 반영
  const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
  const updated = { ...user, zipcode, address, addressDetail };
  storage.setItem('user', JSON.stringify(updated));
  return addressData;
};

// 배송지 조회
export const getAddress = () => {
  const user = getCurrentUser();
  if (!user) return null;
  const data = localStorage.getItem(`address_${user.id}`);
  return data ? JSON.parse(data) : null;
};

// 로그아웃 - 찜목록도 함께 초기화
export const logout = () => {
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
};

// 현재 로그인된 유저 가져오기
export const getCurrentUser = () => {
  const data = localStorage.getItem('user') || sessionStorage.getItem('user');
  return data ? JSON.parse(data) : null;
};

export default { login, register, logout, getCurrentUser, saveAddress, getAddress };
