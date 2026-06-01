export type RecommendationAction = "buy" | "hold" | "avoid";
export type TimeHorizon = "short" | "medium" | "long";
export type RiskTolerance = "low" | "medium" | "high";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: AuthUser;
}

export interface Preferences {
  time_horizon: TimeHorizon;
  risk_tolerance: RiskTolerance;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange?: string;
  type?: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
  currency?: string;
  timestamp: string;
}

export interface StockOverview {
  symbol: string;
  name: string;
  exchange?: string;
  sector?: string;
  industry?: string;
  description?: string;
  marketCap?: number;
  quote: StockQuote;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  provider: string;
  cachedAt?: string;
}

export interface AnalysisRecommendation {
  action: RecommendationAction;
  confidence: number;
  explanation: string;
  warnings: string[];
  rulesApplied: string[];
  isInformationalOnly: boolean;
  wasAdjusted: boolean;
}

export interface StockAnalysis {
  symbol: string;
  recommendation: AnalysisRecommendation;
  overview: StockOverview;
  context: {
    time_horizon: TimeHorizon;
    risk_tolerance: RiskTolerance;
  };
  model: {
    version?: string;
    mode: string;
    features_used?: string[];
    raw_action: RecommendationAction;
    raw_confidence: number;
  };
  series: { dataPoints: number; from?: string; to?: string };
  cachedAt?: string;
}

export interface StockHistorySeries {
  symbol: string;
  prices: number[];
  volume: number[];
  timestamps: string[];
  provider: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category?: string;
  imageUrl?: string;
  relatedSymbols?: string[];
}

export interface NewsFeed {
  symbol: string;
  articles: NewsArticle[];
  fetchedAt: string;
}

export type AlertType =
  | "price_above"
  | "price_below"
  | "price_change_percent"
  | "recommendation_change";

export interface Alert {
  id: string;
  symbol: string;
  type: AlertType;
  targetPrice?: number;
  thresholdPercent?: number;
  targetAction?: RecommendationAction;
  isActive: boolean;
  notifyEmail: boolean;
  lastTriggeredAt: string | null;
  createdAt: string | null;
}

export interface CreateAlertInput {
  symbol: string;
  type: AlertType;
  targetPrice?: number;
  thresholdPercent?: number;
  targetAction?: RecommendationAction;
}
