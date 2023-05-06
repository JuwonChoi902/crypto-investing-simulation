export interface UserDataType {
  id: number;
  nickname: string;
  description: string | null;
  profileImage: string;
  ranking?: string;
  totalMoney?: number;
  yieldPercent?: number;
  email?: string;
  publishedPost?: number;
  publishedReply?: number;
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

export interface CandleData {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  k: CandleDataDetail;
}

export interface CandleDataDetail {
  t: number; // Kline start time
  T: number; // Kline close time
  s: string; // Symbol
  i: string; // Interval
  f: number; // First trade ID
  L: number; // Last trade ID
  o: string; // Open price
  c: string; // Close price
  h: string; // High price
  l: string; // Low price
  v: string; // Base asset volume
  n: number; // Number of trades
  x: boolean; // Is this kline closed?
  q: string; // Quote asset volume
  V: string; // Taker buy base asset volume
  Q: string; // Taker buy quote asset volume
  B: string; // Ignore
}

export interface SymbolTickerTypes {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // First trade(F)-1 price (first trade before the 24hr rolling window)
  c: string; // Last price
  Q: string; // Last quantity
  b: string; // Best bid price
  B: string; // Best bid quantity
  a: string; // Best ask price
  A: string; // Best ask quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade Id
  n: number; // Total number of trades
}

export interface TradeDataTypes {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  a: number; // Aggregate trade ID
  p: string; // Price
  q: string; // Quantity
  f: number; // First trade ID
  l: number; // Last trade ID
  T: number; // Trade time
  m: boolean; // Is the buyer the market maker?
  M: boolean; // Ignore
}

export interface PopularCrypto {
  id: number;
  name: string;
  nick: string;
  imgURL: string;
  lastPrice: string;
  dayChange: string;
  marketCap: string;
  symbol: string;
}
