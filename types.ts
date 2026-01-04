export enum GradeLevel {
  GRADE_6 = "Lớp 6",
  GRADE_7 = "Lớp 7",
  GRADE_8 = "Lớp 8",
  GRADE_9 = "Lớp 9",
}

export const SUBJECTS_THCS = [
  "Ngữ văn",
  "Toán",
  "Khoa học tự nhiên",
  "Lịch sử và Địa lí",
  "Giáo dục công dân",
  "Tiếng Anh",
  "Tin học",
  "Công nghệ",
  "Giáo dục thể chất",
  "Nghệ thuật (Âm nhạc, Mĩ thuật)",
  "Hoạt động trải nghiệm, hướng nghiệp",
  "Nội dung giáo dục địa phương"
];

export interface FileAttachment {
  name: string;
  mimeType: string;
  data: string; // Base64 string
}

export interface TeacherInput {
  grade: GradeLevel;
  subject: string;
  topic: string;
  objectives: string;
  attachments: FileAttachment[];
}

export interface LessonPlanResponse {
  subject: string;
  topic: string;
  appendix1: string; // HTML string for Phụ lục 1
  appendix2: string; // HTML string for Phụ lục 2
  appendix3: string; // HTML string for Phụ lục 3 (KHBD)
  generalSuggestions: string;
}
