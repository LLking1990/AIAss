export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  type?: 'general' | 'drafting' | 'contract_review' | 'case_comparison';
  attachments?: Attachment[];
  metadata?: {
    document?: LegalDocument;
    contractReview?: ContractReviewResult;
    caseComparison?: CaseComparisonResult;
    reasoning?: string;
  };
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  content?: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  docType: '诉讼文书' | '合同协议' | '函件通知' | '公司决议' | '合规备忘录';
  caseType: string;
  parties: {
    role: string;
    name: string;
    detail?: string;
  }[];
  demands: string[];
  factsAndReasons: string;
  clauses?: {
    title: string;
    content: string;
  }[];
  legalBasis: string[];
  signatureDate: string;
  fullText: string;
}

export interface RedlineItem {
  id: string;
  clauseNumber: string;
  clauseTitle: string;
  originalText: string;
  revisedText: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskTitle: string;
  legalReason: string;
  statuteReference: string;
  applied?: boolean;
}

export interface ContractReviewResult {
  id: string;
  contractName: string;
  summary: string;
  overallScore: number;
  stats: {
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
    totalClauses: number;
  };
  keyFindings: string[];
  redlines: RedlineItem[];
  suggestedAction: string;
}

export interface CasePrecedent {
  id: string;
  caseName: string;
  caseNumber: string;
  court: string;
  judgmentDate: string;
  similarity: number; // e.g. 96%
  disputeFocus: string;
  verdictSummary: string;
  judgeReasoning: string;
  applicableLaw: string[];
  significance: string;
}

export interface CaseComparisonResult {
  id: string;
  queryTopic: string;
  statutes: {
    lawName: string;
    article: string;
    content: string;
    interpretation: string;
  }[];
  precedents: CasePrecedent[];
  legalAdvice: string;
  litigationStrategy: string[];
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  isPinned?: boolean;
  category?: 'draft' | 'pinned' | 'recent';
  messages: Message[];
}
