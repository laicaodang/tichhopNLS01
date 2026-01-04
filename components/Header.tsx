import React from 'react';
import { BrainCircuit, BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">NLS Helper</h1>
            <p className="text-xs text-slate-500 font-medium">Trợ lý Tích hợp Năng lực số (THCS)</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-sm font-medium text-slate-600">
          <span className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>Dựa trên CV 5512</span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
