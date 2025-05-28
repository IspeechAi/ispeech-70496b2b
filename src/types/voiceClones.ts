
export interface VoiceClone {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  audio_file_url: string;
  status: string; // Changed from union type to string to match database
  created_at: string;
  updated_at: string;
}

export interface VoiceCloneFormData {
  name: string;
  description?: string;
  audioFile: File;
}
