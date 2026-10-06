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
  username: string;
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

// =========================================================
// Reports Controller Types (EezySend Local Remit Backend)
// =========================================================
export interface ReportTransaction {
  dateCreated: string;
  status: boolean;
  narrative?: string;
  dateCollected?: string;
  transactionReference: string;
  internalReferenceID?: string;
  transactionType?: string;
  currency: string;
  amount: number;
  receiverFirstName: string;
  receiverMiddleName?: string;
  receiverLastName: string;
  receiverNationalId: string;
  receiverPhone: string;
  receiverAddress?: string;
  receiverTown?: string;
  senderFirstName: string;
  senderMiddleName?: string;
  senderLastName: string;
  senderNationalId: string;
  senderPhone: string;
  senderAddress?: string;
  senderTown?: string;
  senderTeller?: string;
  senderBranch?: string;
  receiverTeller?: string;
  receiverBranch?: string;
  withdrawalReference?: string;
  reported?: boolean;
  charge?: string | number;
  withdrawalReported?: boolean;
  channel?: string;
  tax?: number;
}

export interface ReportDateParams {
  startDate: string;
  endDate: string;
}

export type ReportEndpointType = 'all' | 'byDate' | 'deposits' | 'withdrawals';

// =========================================================
// Transactions Controller Types
// =========================================================
export interface ReversalResponse {
  status: boolean;
  narration?: string;
  transactionModel?: ReportTransaction;
}

export type TransactionLookupType = 'reference' | 'withdrawalRef' | 'depositRef';

// =========================================================
// SMS Controller Types (EezySend SMS Gateway)
// =========================================================
export interface SMSModel {
  transactionReference: string;
  dateCreated: string;
  senderPhone: string;
  senderStatus: boolean;
  receiverPhone: string;
  receiverStatus: boolean;
}

export interface PageSMSModel {
  content: SMSModel[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

// =========================================================
// Health Controller Types (EezySend Health & Diagnostics)
// =========================================================
export interface HealthResponse {
  health: 'UP' | 'DOWN' | string;
}

export interface SubsystemHealth {
  id: string;
  name: string;
  category: string;
  status: 'UP' | 'DEGRADED' | 'DOWN';
  endpoint: string;
  latencyMs: number;
  lastChecked: string;
  description: string;
}

