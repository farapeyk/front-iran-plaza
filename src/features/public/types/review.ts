export interface ReviewReplyData {
  id: string;
  comment: string;
  isFromOwner: boolean;
  createdAt: string;
}

export interface ReviewData {
  id: string;
  businessId: string;
  rating: number;
  comment: string | null;
  status: string;
  createdAt: string;
  user: { fullName: string | null };
  replies: ReviewReplyData[];
}