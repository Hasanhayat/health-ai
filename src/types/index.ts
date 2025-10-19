export interface User {
  id: string;
  name: string;
  email: string;
}

export interface FamilyMember {
  _id: string;
  name: string;
  age: number;
  gender: string;
  relationship: string;
  medicalHistory?: MedicalHistory[];
  medications?: Medication[];
  reports?: Report[];
}

export interface MedicalHistory {
  condition: string;
  date: string;
  notes: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface Report {
  _id?: string;
  title: string;
  cloudinaryUrl: string;
  aiAnalysis: string;
  uploadDate?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  message: string;
  timestamp: string;
}
