export interface UserDataType {
  id: number;
  nickname: string;
  description: string | null;
}

export interface PostDataType {
  id: number;
  title: string;
  description: string;
  hits: number;
  categoryId: number;
  created_at: string;
  repliesCount: number;
  isLike: boolean;
  likeCount: number;
  unLikeCount: number;
  prevPostId: number | null;
  nextPostId: number | null;
  isPublished?: boolean;
  user: UserDataType;
}

export type IndexObjectType = {
  [index: number]: number;
};

export interface HeadersType {
  'Content-Type': string;
  Authorization?: string;
  [key: string]: string | undefined;
}

export interface SearchResType {
  stringRes: string;
  filterRes: string;
  boardRes: number | null;
}

export interface SearchInputType {
  searchFilter: string;
  searchString: string;
  searchBoard: number | null;
}

export interface CommentDataType {
  id: number;
  comment: string;
  created_at: string;
  deleted_at: string;
  isItNew: boolean;
  replyId: number;
  isThisOrigin: boolean;
  user: UserDetail;
  post?: PostDataType;
}
