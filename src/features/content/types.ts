export type ArticleStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "PUBLISHED"
  | "ARCHIVED";

export type ArticleSchemaType = "ARTICLE" | "LISTING";

export type RichTextNode = {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  content?: RichTextNode[];
};

export type ArticleTable = {
  headers: string[];
  rows: Array<{ cells: string[]; phone?: string }>;
  showContactColumn?: boolean;
  contactLabel?: string;
};

export type ArticleBlock = {
  id: string;
  type: "paragraph" | "heading" | "image" | "quote" | "callout" | "business-list" | "table";
  text?: string;
  richText?: RichTextNode;
  level?: 2 | 3 | 4;
  imageId?: string;
  imageAlt?: string;
  businessIds?: string[];
  listTitle?: string;
  table?: ArticleTable;
};

export type ArticleBanner = {
  id: string;
  imageId: string;
  title: string;
  altText: string;
  targetUrl: string;
  placement: "TOP" | "SIDEBAR";
  isActive?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ArticleFaq = { id?: string; question: string; answer: string; sortOrder?: number; isActive?: boolean };

export type ContentCategory = {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type ContentBusiness = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string;
  neighborhood: string | null;
  phone: string;
  logoId: string | null;
  planType: "FREE" | "VIP";
  planExpiryDate?: string | null;
  isCip: boolean;
};

export type ArticleBusinessLink = {
  id: string;
  sortOrder: number;
  customTitle: string | null;
  customNote: string | null;
  business: ContentBusiness;
};

export type EditorArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  keyTakeaways: string[];
  primaryKeyword: string | null;
  schemaType: ArticleSchemaType;
  isFeatured: boolean;
  featuredOrder: number | null;
  bodyBlocks: ArticleBlock[];
  status: ArticleStatus;
  reviewNote: string | null;
  categoryId: string | null;
  category: Pick<ContentCategory, "id" | "name" | "slug"> | null;
  coverImageId: string | null;
  coverImageAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  showBanners: boolean;
  readingTimeMin: number;
  revision: number;
  submittedAt: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
  updatedAt: string;
  author: { id: string; fullName: string | null };
  faqs: ArticleFaq[];
  businesses: ArticleBusinessLink[];
};

export type EditorArticleListItem = Pick<
  EditorArticle,
  "id" | "title" | "slug" | "excerpt" | "status" | "revision" | "coverImageId" | "publishedAt" | "updatedAt" | "author" | "category" | "schemaType" | "isFeatured" | "featuredOrder" | "tags"
> & { _count?: { feedback: number; revisions: number } };

export type ArticleListResponse = { data: EditorArticleListItem[]; total: number; page: number; limit: number };

export type PublicArticleListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageId: string | null;
  coverImageAlt: string | null;
  readingTimeMin: number;
  publishedAt: string;
  updatedAt: string;
  author: { fullName: string | null };
  category: { name: string; slug: string } | null;
  rating: number | null;
  ratingCount: number;
};

export type PublicArticleListResponse = { data: PublicArticleListItem[]; total: number; page: number; limit: number };

export type PublicArticle = Omit<EditorArticle, "categoryId" | "status" | "reviewNote" | "revision" | "submittedAt" | "approvedAt"> & {
  status: "PUBLISHED";
  rating: number | null;
  ratingCount: number;
  feedback: Array<{
    id: string;
    rating: number | null;
    comment: string | null;
    createdAt: string;
    user: { fullName: string | null };
  }>;
  banners: ArticleBanner[];
};

export type ContentIdentity = { id: string; fullName: string | null; canWrite: true; canPublish: boolean };

export type ArticleRevision = {
  id: string;
  revision: number;
  title: string;
  status: ArticleStatus;
  changeNote: string | null;
  createdAt: string;
  editor: { id: string; fullName: string | null };
};

export type ContentMediaItem = {
  id: string;
  fileName: string;
  mimeType: string;
  size: string;
  width: number | null;
  height: number | null;
  createdAt: string;
  uploader: { id: string; fullName: string | null };
};

export type ContentMediaResponse = { data: ContentMediaItem[]; total: number; page: number; limit: number };

export type ContentAuthorAssignment = {
  id: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  user: { id: string; phone: string; fullName: string | null; email: string | null; isActive: boolean };
};

export type ArticleFeedbackQueueItem = {
  id: string;
  rating: number | null;
  comment: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  article: { id: string; title: string; slug: string };
  user: { id: string | null; fullName: string | null };
};
