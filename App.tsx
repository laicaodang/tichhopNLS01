import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import PlanDisplay from './components/PlanDisplay';
import { TeacherInput, LessonPlanResponse } from './types';
import { generateLessonPlan } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<LessonPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simple key check
  const hasKey = !!process.env.API_KEY;

  const handleGenerate = async (input: TeacherInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateLessonPlan(input);
      setPlan(result);
      setStep('result');
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo kế hoạch.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('input');
    setPlan(null);
    setError(null);
  };

  if (!hasKey) {
     return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
             <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Chưa cấu hình API Key</h2>
                <p className="text-slate-600 mb-6">Ứng dụng cần có Google Gemini API Key để hoạt động. Vui lòng kiểm tra biến môi trường.</p>
             </div>
        </div>
     )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'input' && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-blue-700 uppercase mb-2 tracking-wide">
                TRƯỜNG THCS CHU VĂN AN
              </h3>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                Công cụ bổ sung Năng lực số vào Kế hoạch giáo dục
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-slate-600">
                Nhập chủ đề bài học của bạn, hệ thống sẽ đề xuất các hoạt động tích hợp năng lực số phù hợp nhất theo chuẩn CV 5512.
              </p>
            </div>
            <InputForm onSubmit={handleGenerate} isLoading={loading} error={error} />
          </div>
        )}

        {step === 'result' && plan && (
          <div className="animate-fade-in">
             <PlanDisplay plan={plan} onReset={handleReset} />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>© 2024 NLS Helper. Designed for Digital Competence Integration.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;