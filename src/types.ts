export type GeneralConfig = {
  companyName: string;
  basePath: string;
};

export type NavBarConfig = {
  discordLink: string;
  navbarButtonText: string;
  navbarButtonLink: string;
  logoLink: string;
};

export type WorkshopStep = {
  title: string;
  text: string;
  slug: string; // Added slug for routing
};

export type MainPageConfig = {
  mainTitle: string;
  subTitle: string;
  heroText: string;
  heroButtonText: string;
  heroButtonLink: string;
  workshopSummarySteps: WorkshopStep[];
};

export type StepData = {
  id: number;
  title: string;
  file?: string;
  content?: string;
};

export type Prerequisite = {
  text: string;
};

export type StepsPageConfig = {
  stepsData: StepData[];
  prerequisites: Prerequisite[];
};

// New types for lab configuration
export type LabConfig = {
  id: string;
  title: string;
  description: string;
  prerequisites: Prerequisite[];
  steps: StepData[];
};

export type Step = {
  id: number;
  title: string;
  content: string | void;
};

// RAMP-specific types
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'ramp-basics' | 'technical' | 'compliance' | 'implementation';
}

export interface RampCapability {
  type: 'OnRamp' | 'OffRamp' | 'Bridge';
  from: AssetReference;
  to: AssetReference;
  orderFlows: OrderFlow[];
  pricingMethods: PricingMethod[];
}

export interface AssetReference {
  assetId?: string;
  nationalCurrencyCode?: string;
  cryptocurrencySymbol?: string;
  transferMethod: string;
}

export interface OrderFlow {
  type: 'Prefunded' | 'Delivery' | 'Convert';
  description: string;
  requirements: string[];
}

export interface PricingMethod {
  type: 'Market' | 'Quote';
  description: string;
  features: string[];
}

export interface RampOrder {
  id: string;
  type: 'OnRamp' | 'OffRamp' | 'Bridge';
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Expired';
  amount: string;
  from: AssetReference;
  to: AssetReference;
  createdAt: string;
  expiresAt?: string;
  paymentInstructions?: PaymentInstructions;
}

export interface PaymentInstructions {
  transferMethod: string;
  details: Record<string, any>;
  referenceId?: string;
}

export interface AccountStructure {
  type: 'Primary' | 'Sub';
  id: string;
  title: string;
  description?: string;
  parentId?: string;
  status: 'active' | 'inactive' | 'suspended';
}