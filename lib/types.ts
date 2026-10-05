// User Types
export interface User {
  id: string;
  email: string;
  institution: string;
  name?: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  institution: string;
  name?: string;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  recipients: Recipient[];
  metadata?: DocumentMetadata;
}

export interface Recipient {
  id: string;
  email: string;
  institution: string;
  status: 'pending' | 'sent' | 'received' | 'failed';
  sentAt?: string;
  receivedAt?: string;
}

export interface DocumentMetadata {
  checksum?: string;
  encrypted: boolean;
  compressionType?: string;
  classification?: 'public' | 'internal' | 'confidential' | 'restricted';
  tags?: string[];
}

// Upload Types
export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface DocumentUploadRequest {
  file: File;
  recipients: string[];
  metadata?: Partial<DocumentMetadata>;
  notification?: boolean;
}

// Institution Types
export interface Institution {
  id: string;
  name: string;
  type: 'bank' | 'microfinance' | 'mobile' | 'insurance' | 'other';
  code: string;
  active: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Dashboard Stats Types
export interface DashboardStats {
  documentsSent: number;
  documentsReceived: number;
  pendingDocuments: number;
  activeRecipients: number;
  storageUsed: number;
  storageLimit: number;
}

// Activity Types
export interface Activity {
  id: string;
  type: 'upload' | 'download' | 'send' | 'receive' | 'delete';
  documentId: string;
  documentName: string;
  userId: string;
  userName: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  details?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}
