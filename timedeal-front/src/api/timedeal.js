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

  // GET /api/v1/time-deals
  // 백엔드 응답 구조: { status, success, data: [...], error }
  // response.data 는 ApiResponse 객체 전체이므로 실제 배열은 response.data.data 에 있음
  // ?? [] 는 data가 null/undefined일 때 빈 배열 반환 (deals.filter 오류 방지)
  const response = await axios.get(`${API_BASE_URL}/time-deals`);
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

  // GET /api/v1/time-deals/{id}
  // 목록과 동일하게 ApiResponse 래퍼에서 실제 딜 객체 꺼냄
  const response = await axios.get(`${API_BASE_URL}/time-deals/${id}`);
  return response.data.data;
};

// 타임딜 등록
// POST /api/v1/admin/time-deals/with-product
// 상품과 딜을 동시에 생성하는 엔드포인트 사용
// 백엔드 DTO: CreateRequestWithProduct { product: ProductCreateRequest, dealQuantity, startTime, endTime }
export const createTimeDeal = async (payload) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newDeal = { ...payload, id: nextId++ };
    mockData.push(newDeal);
    return newDeal;
  }

  const requestBody = {
    product: {
      categoryId: 1,           // 기본 카테고리 ID (추후 폼에서 선택하도록 개선 가능)
      name: payload.productName,
      description: payload.description || '',
      brandName: '',
      originPrice: payload.originalPrice,
      salePrice: payload.discountPrice,

      // 백엔드 ProductStatus enum 허용값: HIDDEN, PREPARING, FOR_SALE, OUT_OF_STOCK, DISCONTINUED
      // ACTIVE 는 없으므로 판매중 상태인 FOR_SALE 사용
      status: 'FOR_SALE',

      // 이미지 배열 변환: 첫 번째는 THUMBNAIL, 나머지는 DETAIL
      // 백엔드 ImageType enum: THUMBNAIL, DETAIL
      images: payload.images?.filter(Boolean).map((url, idx) => ({
        imageUrl: url,
        imageType: idx === 0 ? 'THUMBNAIL' : 'DETAIL',
        displayOrder: idx + 1,
      })) || [],

      optionGroups: [], // 옵션 없는 단순 상품

      skus: [{
        skuCode: null,
        // 백엔드 SkuStatus enum 허용값: AVAILABLE, HIDDEN, OUT_OF_STOCK, DISCONTINUED
        // ACTIVE 는 없으므로 판매가능 상태인 AVAILABLE 사용
        status: 'AVAILABLE',
        additionalPrice: 0,
        stockQuantity: payload.totalStock,
        selectedOptionValues: [], // 옵션 없는 단순 상품
      }],
    },

    dealQuantity: payload.totalStock, // 딜 수량 = 총 재고
    startTime: payload.startTime,
    endTime: payload.endTime,
  };

  const response = await axios.post(
    `${API_BASE_URL}/admin/time-deals/with-product`,
    requestBody,
    { headers: getAuthHeader() }
  );
  return response.data.data;
};

// 타임딜 수정
// PUT /api/v1/admin/time-deals/{id}
// 백엔드에 해당 API 없으면 404 에러 발생 - 백엔드에 PUT 엔드포인트 추가 필요
export const updateTimeDeal = async (id, payload) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = mockData.findIndex(d => d.id === Number(id));
    if (idx === -1) throw new Error('타임딜을 찾을 수 없습니다.');
    mockData[idx] = { ...mockData[idx], ...payload };
    return mockData[idx];
  }

  const response = await axios.put(
    `${API_BASE_URL}/admin/time-deals/${id}`,
    payload,
    { headers: getAuthHeader() }
  );
  return response.data.data;
};

// 타임딜 삭제
// DELETE /api/v1/admin/time-deals/{id}
export const deleteTimeDeal = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = mockData.findIndex(d => d.id === Number(id));
    if (idx === -1) throw new Error('타임딜을 찾을 수 없습니다.');
    mockData.splice(idx, 1);
    return { success: true };
  }

  const response = await axios.delete(
    `${API_BASE_URL}/admin/time-deals/${id}`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

const timedealApi = { getTimeDeals, getTimeDeal, createTimeDeal, updateTimeDeal, deleteTimeDeal };
export default timedealApi;