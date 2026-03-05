// 주문 Mock 데이터

export const mockOrders = {};

let orderCounter = 1;

export const createMockOrder = (timedealId, productName, price) => {
  const orderId = `order-${String(orderCounter++).padStart(3, '0')}`;
  
  return {
    orderId,
    timedealId,
    productName,
    quantity: 1,
    totalPrice: price,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };
};

// Mock 주문 상태 변경 (Saga 시뮬레이션)
export const simulateOrderProcess = (order) => {
  return new Promise((resolve) => {
    // timedealId가 2번이면 무조건 실패 (재고 부족 케이스)
    const isForceFailure = order.timedealId === 2;
    
    // 그 외에는 80% 성공
    const isSuccess = isForceFailure ? false : Math.random() < 0.8;
    
    // 실패 사유 결정
    const getFailReason = () => {
      if (isForceFailure) return '재고 소진';
      const reasons = ['잔액 부족', '결제 승인 거절', '카드사 오류'];
      return reasons[Math.floor(Math.random() * reasons.length)];
    };
    
    setTimeout(() => {
      resolve({
        ...order,
        status: isSuccess ? "COMPLETED" : "FAILED",
        failReason: isSuccess ? null : getFailReason()
      });
    }, 2000);
  });
};

export default mockOrders;
