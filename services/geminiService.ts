import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NLS_CONTEXT_PROMPT } from "../constants";
import { TeacherInput, LessonPlanResponse } from "../types";

const getNLSPlanSchema = (): Schema => {
  return {
    type: Type.OBJECT,
    properties: {
      subject: { type: Type.STRING },
      topic: { type: Type.STRING },
      generalSuggestions: { type: Type.STRING },
      appendix1: { 
        type: Type.STRING, 
        description: "Mã HTML Table cho Phụ lục 1 (Kế hoạch dạy học môn học), có cột Tích hợp NLS" 
      },
      appendix2: { 
        type: Type.STRING, 
        description: "Mã HTML Table cho Phụ lục 2 (Tổ chức hoạt động), có cột Tích hợp NLS" 
      },
      appendix3: { 
        type: Type.STRING, 
        description: "Mã HTML Table cho Phụ lục 3 (Kế hoạch bài dạy - KHBD), có cột Tích hợp NLS" 
      }
    },
    required: ["subject", "topic", "generalSuggestions", "appendix1", "appendix2", "appendix3"]
  };
};

export const generateLessonPlan = async (input: TeacherInput): Promise<LessonPlanResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key chưa được cấu hình.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Xây dựng prompt text
  const textPrompt = `
  THÔNG TIN ĐẦU VÀO:
  - Môn học: ${input.subject}
  - Khối lớp: ${input.grade}
  - Chủ đề/Bài học: ${input.topic}
  - Mục tiêu/Yêu cầu: ${input.objectives}
  
  Hãy tạo nội dung cho 3 phụ lục (1, 2, 3) theo CV 5512 với cột "Tích hợp NLS" được bổ sung.
  Nếu có file đính kèm, hãy ưu tiên sử dụng thông tin từ file.
  `;

  // Xây dựng payload parts (Text + Files)
  const parts: any[] = [{ text: textPrompt }];

  // Thêm file đính kèm vào payload
  if (input.attachments && input.attachments.length > 0) {
    input.attachments.forEach(file => {
      // Gemini API expects base64 without the prefix header (e.g. "data:application/pdf;base64,")
      const base64Data = file.data.split(',')[1]; 
      parts.push({
        inlineData: {
          mimeType: file.mimeType,
          data: base64Data
        }
      });
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Đổi model nếu cần hỗ trợ file tốt hơn (gemini-1.5-pro, gemini-1.5-flash) nhưng gemini-3-flash-preview cũng hỗ trợ multimodal
      contents: [
        { role: "user", parts: parts }
      ],
      config: {
        systemInstruction: NLS_CONTEXT_PROMPT,
        responseMimeType: "application/json",
        responseSchema: getNLSPlanSchema(),
        temperature: 0.5, // Giảm temp để cấu trúc HTML chính xác hơn
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Không nhận được phản hồi từ AI.");
    }

    return JSON.parse(jsonText) as LessonPlanResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
