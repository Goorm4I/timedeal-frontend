import axios from 'axios';
import { USE_MOCK, API_BASE_URL } from './config';
import { createMockOrder, simulateOrderProcess } from '../mocks/orders';
import { mockTimeDeals } from '../mocks/timedeals';

// 주문 Mock 저장소
const mockOrderStore = {};

// 주문 생성
export const createOrder = async (timedealId, quantity = 1) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const deal = mockTimeDeals.find(d => d.id === Number(timedealId));
    if (!deal) throw new Error('타임딜을 찾을 수 없습니다.');
    
    const order = createMockOrder(timedealId, deal.productName, deal.discountPrice);
    mockOrderStore[order.orderId] = order;
    
    // 백그라운드에서 주문 처리 시뮬레이션
    simulateOrderProcess(order).then(result => {
      mockOrderStore[order.orderId] = result;
    });
    
    return { orderId: order.orderId, status: order.status };
  }

  const response = await axios.post(`${API_BASE_URL}/api/orders`, {
    timedealId,
    quantity
  });
  return response.data;
};

// 주문 상태 조회
export const getOrder = async (orderId) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const order = mockOrderStore[orderId];
    if (!order) throw new Error('주문을 찾을 수 없습니다.');
    
    return order;
  }

  const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`);
  return response.data;
};

export default { createOrder, getOrder };
