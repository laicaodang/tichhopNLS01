import React, { useState } from 'react';
import { LessonPlanResponse } from '../types';
import { ArrowLeft, Download, FileText, Table } from 'lucide-react';

// Declare html2pdf for TypeScript since it's loaded via CDN
declare const html2pdf: any;

interface PlanDisplayProps {
  plan: LessonPlanResponse;
  onReset: () => void;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onReset }) => {
  const [activeTab, setActiveTab] = useState<'appendix1' | 'appendix2' | 'appendix3'>('appendix3');

  const exportPDF = (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' } // Landscape for tables
    };

    html2pdf().set(opt).from(element).save();
  };

  const tabs = [
    { id: 'appendix1', label: 'Phụ lục 1: KH Dạy học', content: plan.appendix1, title: 'PHỤ LỤC 1: KẾ HOẠCH DẠY HỌC CỦA TỔ CHUYÊN MÔN' },
    { id: 'appendix2', label: 'Phụ lục 2: KH Tổ chức HĐ', content: plan.appendix2, title: 'PHỤ LỤC 2: KẾ HOẠCH TỔ CHỨC CÁC HOẠT ĐỘNG GIÁO DỤC' },
    { id: 'appendix3', label: 'Phụ lục 3: Kế hoạch bài dạy', content: plan.appendix3, title: 'PHỤ LỤC 3: KẾ HOẠCH BÀI DẠY (KHBD)' },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={onReset}
          className="flex items-center text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Tạo kế hoạch khác
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50">
          <nav className="flex -mb-px" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Table className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
             <div>
                <h3 className="text-lg font-bold text-slate-800">{plan.topic}</h3>
                <p className="text-sm text-slate-500">{plan.subject}</p>
             </div>
             <button
                onClick={() => exportPDF(`pdf-content-${activeTab}`, `${activeTab}_${plan.topic}.pdf`)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Xuất PDF ({activeTab === 'appendix1' ? 'PL1' : activeTab === 'appendix2' ? 'PL2' : 'PL3'})
              </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-bold text-amber-800 mb-1 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Gợi ý từ trợ lý NLS:
            </h4>
            <p className="text-sm text-amber-700">{plan.generalSuggestions}</p>
          </div>

          {/* Render Active Tab Content */}
          <div className="overflow-x-auto bg-white border border-slate-200 p-4 rounded-lg shadow-inner min-h-[500px]">
            {tabs.map((tab) => (
              <div 
                key={tab.id} 
                id={`pdf-content-${tab.id}`} 
                className={`${activeTab === tab.id ? 'block' : 'hidden'}`}
              >
                <div className="mb-4 text-center">
                   <h2 className="text-lg font-bold uppercase">{tab.title}</h2>
                   <p className="text-sm italic text-slate-600">Môn học: {plan.subject}</p>
                </div>
                {/* HTML Table Content from AI */}
                <div 
                  className="ai-generated-table"
                  dangerouslySetInnerHTML={{ __html: tab.content }} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDisplay;
