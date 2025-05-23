export interface Photo {
  id: string;
  url: string; 
  name: string;
  uploadDate: string; // ISO string
  tags: string[];
  suggestedDateTaken?: string; // YYYY-MM-DD format
  aiError?: string; 
}
