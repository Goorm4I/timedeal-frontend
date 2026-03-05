import React, { useState } from 'react';
import { getCurrentUser, getAddress } from '../api/auth';

/* ─────────────────────────────────────────────────────────────────
   Mock PG 결제 시뮬레이터
   
   ⚠️ 학습/포트폴리오 목적의 시뮬레이션입니다.
   실제 결제가 진행되지 않습니다.
───────────────────────────────────────────────────────────────── */

const PGSimulator = ({ deal, paymentMethod, onComplete, onCancel }) => {
  const [step, setStep] = useState('info'); // info, auth, processing, done
  const [progress, setProgress] = useState(0);

  // 현재 로그인 유저 정보 (이름/전화번호/주소)
  const user = getCurrentUser();
  const address = getAddress();

  // PG 스타일
  const pgStyles = {
    bboshi: {
      name: '뽀시페이',
      color: 'from-orange-400 to-amber-500',
      bg: 'bg-orange-50',
      icon: <img src="/icon.png" alt="뽀시페이" className="w-12 h-12 rounded-full object-cover" />,
      brand: '뽀시페이',
    },
    kakao: {
      name: '카카오페이',
      color: 'from-yellow-300 to-yellow-400',
      bg: 'bg-yellow-50',
      icon: (
        <div className="w-12 h-12 rounded-full bg-[#FEE500] flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#3A1D1D">
            <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.733 1.617 5.13 4.062 6.54L5.1 20.7a.3.3 0 0 0 .44.327l4.174-2.78A11.6 11.6 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
          </svg>
        </div>
      ),
      brand: '카카오페이',
    },
    toss: {
      name: '토스페이',
      color: 'from-blue-400 to-blue-600',
      bg: 'bg-blue-50',
      icon: (
        <div className="w-12 h-12 rounded-full bg-[#0064FF] flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
            <path d="M12.5 4a1.5 1.5 0 0 0-1.5 1.5v5.586L8.207 8.293a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l4.5-4.5a1 1 0 0 0-1.414-1.414L13 10.586V5.5A1.5 1.5 0 0 0 12.5 4zM6 17a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2H6z"/>
          </svg>
        </div>
      ),
      brand: '토스페이',
    },
    card: {
      name: '신용카드',
      color: 'from-gray-600 to-gray-800',
      bg: 'bg-gray-50',
      icon: (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="1.5"/>
            <rect x="2" y="9" width="20" height="3" fill="white"/>
            <rect x="4" y="15" width="4" height="1.5" rx="0.75" fill="white"/>
          </svg>
        </div>
      ),
      brand: '신용카드',
    },
  };

  const mockBalance = { bboshi: 500000, kakao: 320000, toss: 1200000, card: 999999999 };

  const pg = pgStyles[paymentMethod];
  const userBalance = mockBalance[paymentMethod];
  const canPay = userBalance >= deal.discountPrice;

  const handleAuth = () => {
    setStep('processing');
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStep('done');
        setTimeout(onComplete, 800);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col">
      {/* 헤더 */}
      <header className={`bg-gradient-to-r ${pg.color} text-white flex-shrink-0`}>
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-center">
            <p className="font-bold">{pg.brand}</p>
            <p className="text-xs opacity-80">{pg.name}</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Mock 안내 배너 */}
      <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 flex-shrink-0">
        <p className="text-amber-800 text-xs text-center">
          🎓 <strong>포트폴리오 시연용 Mock 결제창</strong>입니다. 실제 결제가 진행되지 않습니다.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
      <div className="p-4 max-w-md mx-auto pb-16">
        {/* Step 1: 결제 정보 확인 */}
        {step === 'info' && (
          <div className="space-y-4">
            {/* 사용자 정보 (잔액) */}
            <div className={`${pg.bg} rounded-2xl p-4`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow overflow-hidden">
                  {pg.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{user?.name ?? '회원'}님</p>
                  <p className="text-sm text-gray-500">{user?.phone ?? '-'}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">사용 가능 잔액</span>
                  <span className="font-bold text-lg text-gray-800">
                    {paymentMethod === 'card' ? '한도 충분' : `${userBalance.toLocaleString()}원`}
                  </span>
                </div>
              </div>
            </div>

            {/* 배송지 정보 */}
            {address ? (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-sm text-gray-500 mb-2">📦 배송지</p>
                <p className="text-sm font-medium text-gray-800">
                  {user?.name} · {user?.phone}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  ({address.zipcode}) {address.address}
                </p>
                {address.addressDetail && (
                  <p className="text-sm text-gray-600">{address.addressDetail}</p>
                )}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-sm text-amber-700 text-center">
                  📦 배송지가 등록되지 않았습니다.<br />
                  <span className="text-xs">마이페이지에서 배송지를 먼저 등록해주세요.</span>
                </p>
              </div>
            )}

            {/* 결제 상품 정보 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-gray-500 mb-3">결제 상품</p>
              <div className="flex gap-3">
                <img
                  src={deal.productImage}
                  alt={deal.productName}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 line-clamp-2 text-sm">{deal.productName}</p>
                </div>
              </div>
            </div>

            {/* 결제 금액 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500">상품 금액</span>
                <span className="text-gray-800">{deal.discountPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500">배송비</span>
                <span className="text-green-600">무료</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-800">총 결제금액</span>
                <span className="font-bold text-2xl text-primary-500">
                  {deal.discountPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 잔액 부족 경고 */}
            {!canPay && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm text-center">
                  ❌ 잔액이 부족합니다. 충전 후 이용해주세요.
                </p>
              </div>
            )}

            {/* 결제 버튼 */}
            <button
              onClick={() => setStep('auth')}
              disabled={!canPay}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white transition
                bg-gradient-to-r ${pg.color}
                ${canPay ? 'hover:opacity-90 active:scale-[0.98]' : 'opacity-50 cursor-not-allowed'}
              `}
            >
              {deal.discountPrice.toLocaleString()}원 결제하기
            </button>
          </div>
        )}

        {/* Step 2: 인증 */}
        {step === 'auth' && (
          <div className="space-y-6 pt-8">
            <div className="text-center">
              <div className="text-6xl flex justify-center mb-4">{pg.icon}</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">결제 인증</h2>
              <p className="text-gray-500 text-sm">비밀번호를 입력해주세요</p>
            </div>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="w-4 h-4 rounded-full bg-gray-800" />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '←'].map((num, i) => (
                <button
                  key={i}
                  onClick={num !== '' ? handleAuth : undefined}
                  className={`h-14 rounded-xl font-bold text-xl transition
                    ${num === '' ? '' : 'bg-white hover:bg-gray-50 active:bg-gray-100 shadow-sm'}
                  `}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400">
              (아무 버튼이나 누르면 결제가 진행됩니다)
            </p>
          </div>
        )}

        {/* Step 3: 처리 중 */}
        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-6xl flex justify-center mb-6">{pg.icon}</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">결제 처리 중</h2>
            <p className="text-gray-500 text-sm mb-6">잠시만 기다려주세요...</p>
            <div className="w-full max-w-xs">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${pg.color} transition-all duration-100`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-sm text-gray-400 mt-2">{progress}%</p>
            </div>
          </div>
        )}

        {/* Step 4: 완료 */}
        {step === 'done' && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${pg.color} flex items-center justify-center mb-6 shadow-lg`}>
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">결제 완료!</h2>
            <p className="text-gray-500 text-sm">주문 처리 중...</p>
            <div className="mt-6 bg-gray-50 rounded-xl p-4 w-full max-w-xs">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">결제 금액</span>
                <span className="font-bold text-gray-800">{deal.discountPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">결제 수단</span>
                <span className="text-gray-800">{pg.brand}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* 하단 안내 */}
      <div className="flex-shrink-0 bg-white border-t px-4 py-3">
        <p className="text-xs text-gray-400 text-center">
          본 결제창은 포트폴리오 시연 목적으로 제작되었습니다.<br />
          실제 결제 시스템과 무관합니다.
        </p>
      </div>
    </div>
  );
};

export default PGSimulator;
