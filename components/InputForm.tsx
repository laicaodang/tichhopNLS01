import React, { useState, useRef } from 'react';
import { GradeLevel, TeacherInput, SUBJECTS_THCS, FileAttachment } from '../types';
import { Loader2, Sparkles, AlertCircle, Upload, FileText, X } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: TeacherInput) => void;
  isLoading: boolean;
  error?: string | null;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, error }) => {
  const [grade, setGrade] = useState<GradeLevel>(GradeLevel.GRADE_6);
  const [subject, setSubject] = useState(SUBJECTS_THCS[0]);
  const [topic, setTopic] = useState('');
  const [objectives, setObjectives] = useState('');
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: FileAttachment[] = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        
        // Check size (limit to 10MB approx)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} quá lớn. Vui lòng chọn file dưới 10MB.`);
          continue;
        }

        const reader = new FileReader();
        const filePromise = new Promise<FileAttachment>((resolve) => {
          reader.onload = (event) => {
            resolve({
              name: file.name,
              mimeType: file.type,
              data: event.target?.result as string
            });
          };
        });
        reader.readAsDataURL(file);
        const fileData = await filePromise;
        newFiles.push(fileData);
      }
      
      setFiles(prev => [...prev, ...newFiles]);
    }
    // Reset input value to allow selecting the same file again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ grade, subject, topic, objectives, attachments: files });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center">
          <Sparkles className="w-5 h-5 text-indigo-600 mr-2" />
          Hỗ trợ xây dựng các phụ lục của CV 5512 có tích hợp NLS
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Nhập thông tin và đính kèm tài liệu để AI hỗ trợ soạn KHBD chi tiết.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start text-sm border border-red-100">
            <AlertCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="grade" className="block text-sm font-medium text-slate-700">
              Khối lớp
            </label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value as GradeLevel)}
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 border bg-white"
              disabled={isLoading}
            >
              {Object.values(GradeLevel).map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
              Môn học (CT GDPT 2018)
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 border bg-white"
              disabled={isLoading}
            >
              {SUBJECTS_THCS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="topic" className="block text-sm font-medium text-slate-700">
            Tên bài học / Chủ đề
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ví dụ: Truyện ngụ ngôn, Tế bào..."
            required
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 border"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="attachments" className="block text-sm font-medium text-slate-700">
            Đính kèm tài liệu mẫu / SGK (PDF, Ảnh)
          </label>
          <div className="flex flex-col gap-3">
            <div 
              onClick={() => !isLoading && fileInputRef.current?.click()}
              className={`border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm text-slate-600 font-medium">Nhấn để tải lên file (Phụ lục 1, 2, 3 hoặc SGK)</span>
              <span className="text-xs text-slate-400 mt-1">Hỗ trợ PDF, JPG, PNG (Tối đa 10MB)</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,image/*" 
              multiple 
              onChange={handleFileChange}
              disabled={isLoading}
            />
            
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                    <div className="flex items-center truncate">
                      <FileText className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-slate-700 truncate">{file.name}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeFile(idx)}
                      disabled={isLoading}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="objectives" className="block text-sm font-medium text-slate-700">
            Mục tiêu/Yêu cầu cần đạt (Tùy chọn)
          </label>
          <textarea
            id="objectives"
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            placeholder="Nếu đã đính kèm file, bạn có thể để trống hoặc ghi chú thêm..."
            rows={3}
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
            disabled={isLoading}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Đang xử lý tài liệu và tạo kế hoạch...
              </>
            ) : (
              'Tạo kế hoạch tích hợp'
            )}
          </button>
          <p className="mt-3 text-xs text-slate-400 italic text-center">
            Sản phẩm được thiết kế bằng công cụ AI của Thầy Lại Cao Đằng
          </p>
        </div>
      </form>
    </div>
  );
};

export default InputForm;