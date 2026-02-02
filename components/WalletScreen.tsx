import React, { useState } from 'react';
import { ArrowRight, Wallet, History, CreditCard, CheckCircle, Clock, Smartphone, Building, User } from 'lucide-react';
import { WITHDRAWAL_METHODS } from '../constants';
import { Transaction } from '../types';
import { Button } from './Button';

interface WalletScreenProps {
  onBack: () => void;
  coins: number;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({ onBack, coins }) => {
  const [activeTab, setActiveTab] = useState<'withdraw' | 'history'>('withdraw');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  
  // Dynamic Form Fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [paymentAddress, setPaymentAddress] = useState(''); // For InstaPay

  const [history] = useState<Transaction[]>([
    { id: 'TX-9821', date: '2024-05-20', amount: 50, egpAmount: 5, method: 'Vodafone Cash', status: 'completed' },
    { id: 'TX-9822', date: '2024-05-18', amount: 100, egpAmount: 10, method: 'InstaPay', status: 'pending' },
  ]);

  const exchangeRate = 0.1; 

  const getMethodType = (id: string) => {
    return WITHDRAWAL_METHODS.find(m => m.id === id)?.type;
  }

  return (
    <div className="w-full h-full min-h-screen bg-[#FFFBF0] flex flex-col text-gray-800 font-[Cairo]">
      
      {/* Header */}
      <div className="bg-gradient-to-b from-green-500 to-green-600 p-6 pb-12 rounded-b-[2.5rem] shadow-xl relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="w-10"></div>
          <h2 className="text-2xl font-black text-white">المحفظة والأرباح</h2>
          <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 text-white">
            <ArrowRight size={24} />
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 flex flex-col items-center shadow-lg mx-2 border border-white/50">
          <span className="text-gray-500 text-sm font-bold mb-1">الرصيد الحالي</span>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-black text-green-600 drop-shadow-sm">{coins.toLocaleString()}</span>
            <span className="text-sm text-green-800 mb-2 font-bold">نقطة</span>
          </div>
          <div className="bg-yellow-100 px-4 py-1.5 rounded-full border border-yellow-200">
            <span className="text-yellow-700 font-bold">≈ {(coins * exchangeRate).toFixed(2)} جنيه مصري</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 mt-6 gap-4">
        <button 
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${activeTab === 'withdraw' ? 'bg-green-600 text-white shadow-green-200' : 'bg-white text-gray-400 border border-gray-100'}`}
        >
          <CreditCard size={18} />
          سحب الرصيد
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${activeTab === 'history' ? 'bg-green-600 text-white shadow-green-200' : 'bg-white text-gray-400 border border-gray-100'}`}
        >
          <History size={18} />
          السجل
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24 scrollbar-hide">
        
        {activeTab === 'withdraw' ? (
          <div className="space-y-6">
            
            {/* Methods Grid */}
            <div className="space-y-3">
              <label className="text-gray-700 text-sm font-bold px-2 border-r-4 border-green-500 mr-1">اختر وسيلة السحب</label>
              <div className="grid grid-cols-2 gap-3">
                {WITHDRAWAL_METHODS.map((m) => (
                  <div 
                    key={m.id}
                    onClick={() => {
                        setSelectedMethod(m.id);
                        setPhoneNumber('');
                        setBankAccount('');
                        setPaymentAddress('');
                    }}
                    className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 ${selectedMethod === m.id ? 'bg-green-50 border-green-500 shadow-md' : 'bg-white border-transparent shadow-sm hover:shadow-md'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm text-white ${m.color}`}>
                      {m.icon}
                    </div>
                    <span className="text-xs font-bold text-gray-600">{m.name}</span>
                    {selectedMethod === m.id && <div className="absolute top-2 right-2 text-green-600"><CheckCircle size={16} /></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Inputs based on Method Type */}
            {selectedMethod && (
                <div className="space-y-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-sm font-black text-gray-800 border-b border-gray-100 pb-2 mb-2">بيانات التحويل</h3>
                    
                    {/* Amount Input (Always shown) */}
                    <div className="space-y-1">
                        <label className="text-gray-500 text-xs font-bold">المبلغ (بالنقاط)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="أدخل النقاط"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-4 pl-12 text-right text-gray-800 font-bold outline-none focus:border-green-500 focus:bg-white transition-all"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">PTS</span>
                        </div>
                        {amount && parseInt(amount) > 0 && (
                             <div className="text-xs text-green-600 font-bold">ستحصل على: {(parseInt(amount) * exchangeRate).toFixed(2)} EGP</div>
                        )}
                    </div>

                    {/* Method Specific Fields */}
                    {getMethodType(selectedMethod) === 'wallet' && (
                        <div className="space-y-3">
                             <div className="space-y-1">
                                <label className="text-gray-500 text-xs font-bold">رقم الموبايل</label>
                                <div className="relative">
                                    <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="01xxxxxxxxx" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-right text-gray-800 outline-none focus:border-green-500 focus:bg-white" />
                                </div>
                             </div>
                             <div className="space-y-1">
                                <label className="text-gray-500 text-xs font-bold">الاسم ثلاثي (للمراجعة)</label>
                                <div className="relative">
                                    <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="اسم صاحب المحفظة" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-right text-gray-800 outline-none focus:border-green-500 focus:bg-white" />
                                </div>
                             </div>
                        </div>
                    )}

                    {getMethodType(selectedMethod) === 'instapay' && (
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-gray-500 text-xs font-bold">عنوان الدفع (IPA)</label>
                                <input type="text" value={paymentAddress} onChange={e => setPaymentAddress(e.target.value)} placeholder="username@instapay" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-right text-gray-800 outline-none focus:border-green-500 focus:bg-white" />
                            </div>
                        </div>
                    )}

                    {getMethodType(selectedMethod) === 'bank' && (
                        <div className="space-y-3">
                             <div className="space-y-1">
                                <label className="text-gray-500 text-xs font-bold">رقم الحساب البنكي / IBAN</label>
                                <div className="relative">
                                    <Building className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input type="text" value={bankAccount} onChange={e => setBankAccount(e.target.value)} placeholder="رقم الحساب" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-right text-gray-800 outline-none focus:border-green-500 focus:bg-white" />
                                </div>
                             </div>
                             <div className="space-y-1">
                                <label className="text-gray-500 text-xs font-bold">الاسم رباعي</label>
                                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="اسم صاحب الحساب" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-right text-gray-800 outline-none focus:border-green-500 focus:bg-white" />
                            </div>
                        </div>
                    )}

                    <Button 
                    variant="gold" 
                    className="w-full py-4 text-lg mt-4 shadow-yellow-200"
                    disabled={!selectedMethod || !amount || parseInt(amount) > coins || parseInt(amount) <= 0}
                    >
                    إرسال طلب السحب
                    </Button>
                </div>
            )}

          </div>
        ) : (
          <div className="space-y-3">
            {history.map((tx) => (
              <div key={tx.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {tx.status === 'completed' ? <CheckCircle size={20} /> : <Clock size={20} />}
                   </div>
                   <div className="flex flex-col">
                     <span className="font-bold text-gray-800 text-sm">{tx.method}</span>
                     <span className="text-xs text-gray-400">{tx.date}</span>
                   </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-gray-800 font-black">{tx.egpAmount} EGP</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${tx.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                    {tx.status === 'completed' ? 'تم الدفع' : 'قيد المراجعة'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};