import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  CheckCircle2, 
  HelpCircle, 
  Check, 
  Clock, 
  ArrowUpRight, 
  Download, 
  Info, 
  ShieldCheck, 
  Smartphone 
} from 'lucide-react';
import { FeeItem } from '../types';

interface FeesCenterProps {
  initialFees: FeeItem[];
  onSave: (updated: FeeItem[]) => void;
}

export default function FeesCenter({ initialFees, onSave }: FeesCenterProps) {
  const [fees, setFees] = useState<FeeItem[]>(JSON.parse(JSON.stringify(initialFees)));
  const [selectedFee, setSelectedFee] = useState<FeeItem | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [payMethod, setPayMethod] = useState<'card' | 'upi'>('upi');
  const [paySuccessMsg, setPaySuccessMsg] = useState(false);

  // Totals
  const totalFees = fees.reduce((acc, f) => acc + f.total, 0);
  const paidFees = fees.reduce((acc, f) => acc + f.paid, 0);
  const pendingFees = totalFees - paidFees;

  const handleOpenPayment = (fee: FeeItem) => {
    setSelectedFee(fee);
    setCardName('');
    setCardNumber('');
    setUpiId('');
    setPaySuccessMsg(false);
  };

  const executeSimulatedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee) return;

    setIsPaying(true);
    setTimeout(() => {
      // Simulate successful full payment of the remaining fee item
      const updated = fees.map(f => {
        if (f.id === selectedFee.id) {
          return {
            ...f,
            paid: f.total,
            status: 'Paid' as const
          };
        }
        return f;
      });

      setFees(updated);
      onSave(updated);
      setIsPaying(false);
      setSelectedFee(null);
      setPaySuccessMsg(true);
      setTimeout(() => setPaySuccessMsg(false), 4000);
    }, 1500);
  };

  const getStatusBadge = (status: FeeItem['status']) => {
    switch (status) {
      case 'Paid':
        return <span className="bg-emerald-50 text-emerald-700 text-[10.5px] font-bold px-2 py-0.5 rounded border border-emerald-100">Paid</span>;
      case 'Partial':
        return <span className="bg-amber-50 text-amber-700 text-[10.5px] font-bold px-2 py-0.5 rounded border border-amber-100">Partial Clearance</span>;
      default:
        return <span className="bg-red-50 text-red-700 text-[10.5px] font-bold px-2 py-0.5 rounded border border-red-100">Pending</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <CreditCard className="h-5.5 w-5.5 text-blue-600" /> Accounts & Fee Settlement
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Review tuitions, institutional bus charges, exam files, and initiate secured online clearing.
        </p>
      </div>

      {paySuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 font-medium">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold block mb-0.5">Online Transaction Successful!</span>
            Payment receipts are being dispatched to parents SMS and email coordinates. Accounts ledger verified.
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total College Fees</span>
          <span className="text-2xl font-black text-slate-800 mt-1 block">₹{totalFees.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Standard approved CTE fee structure</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fees Cleared</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">₹{paidFees.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Validated by accounts desk</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Outstanding Due balance</span>
          <span className={`text-2xl font-black mt-1 block ${pendingFees > 0 ? 'text-red-650' : 'text-emerald-700'}`}>
            ₹{pendingFees.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Net payment needed</span>
        </div>
      </div>

      {/* Main split details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fee items list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-widest text-slate-400">
              Department Ledger Balances
            </h3>

            <div className="divide-y divide-slate-100 space-y-4">
              {fees.map((item) => {
                const outstandingItem = item.total - item.paid;
                return (
                  <div key={item.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-800">{item.category}</span>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Due Date: <span className="font-bold text-slate-600">{item.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right shrink-0">
                      <div className="text-xs font-semibold">
                        <span className="block text-slate-700">Paid: ₹{item.paid.toLocaleString('en-IN')}</span>
                        <span className="block text-slate-400">Total: ₹{item.total.toLocaleString('en-IN')}</span>
                      </div>

                      {outstandingItem > 0 ? (
                        <button
                          onClick={() => handleOpenPayment(item)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                          id={`btn-pay-${item.id}`}
                        >
                          Clear ₹{outstandingItem.toLocaleString('en-IN')}
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Receipt downloaded for ${item.category}!`)}
                          className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-xl cursor-pointer transition-all shrink-0 tooltip"
                          title="Download Invoice"
                          id={`btn-dl-${item.id}`}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info panel instructions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Account Protocols
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              MITE accounts desk coordinates directly with SBI (State Bank of India) Karkala campus branches for bank draft allocations. 
              Always quote student USN credentials when processing physical challans.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-xs">
              <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Fees paid through bank challans will reflect on Contineo within 48 business hours after physical validation by college accountants.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Online gateway popup dialogue simulation */}
      {selectedFee && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-slate-100 shadow-2xl relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">MITE secured transaction gateway</span>
                <h3 className="font-black text-slate-800 text-lg">Clear Outstanding Balance</h3>
              </div>
              <button 
                onClick={() => setSelectedFee(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl mb-4 flex justify-between items-center text-xs">
              <span className="font-bold text-blue-900 truncate max-w-[220px]">{selectedFee.category}</span>
              <span className="font-mono font-black text-blue-900 text-sm">₹{(selectedFee.total - selectedFee.paid).toLocaleString('en-IN')}</span>
            </div>

            {/* Methods tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold text-slate-500">
              <button
                type="button"
                onClick={() => setPayMethod('upi')}
                className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer ${payMethod === 'upi' ? 'bg-white text-blue-600 shadow-sm' : ''}`}
              >
                UPI (GPay / PhonePe)
              </button>
              <button
                type="button"
                onClick={() => setPayMethod('card')}
                className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer ${payMethod === 'card' ? 'bg-white text-blue-600 shadow-sm' : ''}`}
              >
                Credit / Debit Card
              </button>
            </div>

            <form onSubmit={executeSimulatedPayment} className="space-y-4">
              {payMethod === 'upi' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">UPI ID address</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. parent@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-1 focus:ring-blue-500 font-bold"
                    />
                    <Smartphone className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-medium mt-1">A secure request will be sent to your device UPI app.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Holder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Krishnamurthy Rao"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-1 focus:ring-blue-500 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-1 focus:ring-blue-500 font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Expiry</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-1 focus:ring-blue-500 text-center font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="***"
                        className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-1 focus:ring-blue-500 text-center font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isPaying}
                id="btn-confirm-payment-gateway"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer flex justify-center items-center gap-1.5 transition-colors shadow-lg shadow-blue-50"
              >
                {isPaying ? (
                  <>
                    <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Authorizing Ledger Transfer...
                  </>
                ) : (
                  <>
                    Confirm Pay ₹{(selectedFee.total - selectedFee.paid).toLocaleString('en-IN')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
