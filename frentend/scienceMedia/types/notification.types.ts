export interface Notification {
  id: string;
  name: string;
  action: string;
  time: string;
  read: boolean;
  avatar: string | null;
  iconColor: string;
  icon?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}

// AOUAD ABDELKARIM
