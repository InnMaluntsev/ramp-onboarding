interface QuizOption {
  letter: string;
  text: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
  learnMoreUrl?: string;
  learnMoreText?: string;
  category?: string;
}

// RAMP Knowledge Questions for Step 2 (Updated with progressive difficulty and varied answers)
const BASIC_RAMP_QUESTIONS: QuizQuestion[] = [
  // Questions 1-3: Basic concepts (Easy)
  {
    id: 1,
    question: "What is the primary purpose of RAMP in the Fireblocks ecosystem?",
    options: [
      { letter: 'A', text: 'Bridge traditional finance and cryptocurrency for institutional clients' },
      { letter: 'B', text: 'Provide cryptocurrency mining services' },
      { letter: 'C', text: 'Create new blockchain networks' },
      { letter: 'D', text: 'Manage digital wallet security' }
    ],
    correctAnswer: 'A',
    explanation: "RAMP (Rapid Asset Movement Protocol) is specifically designed to bridge traditional finance and cryptocurrency, enabling seamless conversion between fiat and digital assets for institutional clients. It focuses on payment flows like on-ramp, off-ramp, and crypto-to-crypto bridging, not mining (B), blockchain creation (C), or wallet security (D).",
    category: 'ramp-basics'
  },
  {
    id: 2,
    question: "Which of these is NOT one of the four core RAMP capabilities?",
    options: [
      { letter: 'A', text: 'Crypto-to-crypto bridging' },
      { letter: 'B', text: 'Off-ramp (crypto to fiat)' },
      { letter: 'C', text: 'Cryptocurrency mining operations' },
      { letter: 'D', text: 'On-ramp (fiat to crypto)' }
    ],
    correctAnswer: 'C',
    explanation: "The four core RAMP capabilities are: On-ramp (D), Off-ramp (B), Crypto-to-crypto bridging (A). Mining operations (C) are infrastructure activities unrelated to payment processing and asset conversion flows that RAMP handles.",
    category: 'ramp-basics'
  },
  {
    id: 3,
    question: "In RAMP terminology, what does 'Off-Ramp' specifically refer to?",
    options: [
      { letter: 'A', text: 'Converting between different cryptocurrencies' },
      { letter: 'B', text: 'Converting fiat currency to cryptocurrency' },
      { letter: 'C', text: 'Converting cryptocurrency to fiat currency' },
      { letter: 'D', text: 'Transferring crypto between wallets' }
    ],
    correctAnswer: 'C',
    explanation: "Off-ramp specifically means converting cryptocurrency to fiat currency, allowing users to 'exit' the crypto ecosystem into traditional banking. On-ramp (B) is the opposite direction. Cross-chain bridging (A) and wallet transfers (D) don't involve fiat currency conversion.",
    category: 'ramp-basics'
  },

  // Questions 4-6: Intermediate concepts (Medium)
  {
    id: 4,
    question: "What is the key difference between Prefunded and Delivery (DVP) order flows?",
    options: [
      { letter: 'A', text: 'Prefunded is faster but Delivery is more secure' },
      { letter: 'B', text: 'Prefunded requires existing balance, Delivery funds on demand' },
      { letter: 'C', text: 'Prefunded is for crypto only, Delivery is for fiat only' },
      { letter: 'D', text: 'There is no meaningful difference between them' }
    ],
    correctAnswer: 'B',
    explanation: "Prefunded flows use existing account balance for immediate conversion, while Delivery (DVP) flows fund the account on-demand when the order is placed.",
    category: 'technical'
  },
  {
    id: 5,
    question: "Which pricing method provides a locked-in conversion rate that must be used before expiration?",
    options: [
      { letter: 'A', text: 'Quote-based pricing' },
      { letter: 'B', text: 'Market-based pricing' },
      { letter: 'C', text: 'Dynamic pricing' },
      { letter: 'D', text: 'Fixed pricing' }
    ],
    correctAnswer: 'A',
    explanation: "Quote-based pricing provides a locked-in rate from a pre-generated quote with an expiration time. Market-based pricing (B) uses live rates without locking. 'Dynamic pricing' (C) and 'fixed pricing' (D) aren't standard RAMP terminology - the two official methods are quote-based and market-based.",
    category: 'technical'
  },
  {
    id: 6,
    question: "What are the mandatory API endpoints that ALL RAMP providers must implement?",
    options: [
      { letter: 'A', text: 'GET /accounts/{id}/ramps, POST /accounts/{id}/ramps, GET /accounts/{id}/ramps/{id}' },
      { letter: 'B', text: 'GET /trading/orders, POST /trading/orders, GET /liquidity/quotes' },
      { letter: 'C', text: 'GET /transfers/withdrawals, POST /transfers/deposits, GET /balances' },
      { letter: 'D', text: 'GET /capabilities, GET /accounts, GET /capabilities/assets' }
    ],
    correctAnswer: 'D',
    explanation: "All RAMP providers must implement three core mandatory endpoints: GET /capabilities (declare server capabilities), GET /accounts (account management), and GET /capabilities/assets (list supported assets). The other options show optional endpoints that are specific to certain capabilities like RAMP operations, trading, or transfers.",
    category: 'implementation'
  },

  // Questions 7-8: Advanced concepts (Hard)
  {
    id: 7,
    question: "In a multi-asset RAMP implementation supporting the same token across different blockchains, how should asset references be properly structured?",
    options: [
      { letter: 'A', text: 'Use the same assetId for identical tokens regardless of blockchain' },
      { letter: 'B', text: 'Create unique assetIds for each blockchain-token combination with blockchain specified' },
      { letter: 'C', text: 'Use only cryptocurrencySymbol and ignore blockchain differences' },
      { letter: 'D', text: 'Always use contractAddress regardless of blockchain type' }
    ],
    correctAnswer: 'B',
    explanation: "Each blockchain-token combination needs a unique assetId because USDC on Ethereum vs Polygon are technically different assets with different contract addresses and fees. Using the same ID (A) creates confusion, using only symbols (C) loses blockchain context, and contract addresses (D) don't work for all asset types.",
    category: 'technical'
  },
  {
    id: 8,
    question: "What happens when a RAMP order uses market-based pricing during periods of high volatility?",
    options: [
      { letter: 'A', text: 'The order is automatically cancelled for safety' },
      { letter: 'B', text: 'The system switches to quote-based pricing temporarily' },
      { letter: 'C', text: 'The conversion executes at whatever the current market rate is at execution time' },
      { letter: 'D', text: 'The order waits until volatility decreases before executing' }
    ],
    correctAnswer: 'C',
    explanation: "Market-based pricing always executes at the live market rate regardless of volatility - that's the key characteristic distinguishing it from quote-based pricing. The system doesn't automatically cancel (A), switch pricing methods (B), or delay execution (D) - it processes the conversion at the current market conditions.",
    category: 'technical'
  },

  // Questions 9-10: Expert level (Very Hard)
{
    id: 9,
    question: "When is PII (Personally Identifiable Information) required for RAMP transactions?",
    options: [
      { letter: 'A', text: 'PII is always mandatory for all RAMP transactions regardless of type' },
      { letter: 'B', text: 'PII is never required since customers are pre-verified through KYC' },
      { letter: 'C', text: 'PII requirements depend on provider jurisdiction, transaction type, and regulatory obligations' },
      { letter: 'D', text: 'PII is only required for off-ramp transactions over $10,000' }
    ],
    correctAnswer: 'C',
    explanation: "PII requirements vary based on multiple factors: the provider's regulatory jurisdiction (different countries have different rules), whether it's a first-party or third-party transaction, transaction type (on-ramp, off-ramp, bridge), and applicable regulations like the Travel Rule. It's not a blanket requirement (A), not completely exempt (B), and not solely amount-based (D) - providers must comply with their specific regulatory framework.",
    category: 'compliance'
  },
  {
    id: 10,
    question: "In the correct sequence for a Prefunded Convert & Withdraw operation, what is the proper order of operations?",
    options: [
      { letter: 'A', text: 'Generate quote/rate → Reserve funds → Convert → Send to destination → Update balances' },
      { letter: 'B', text: 'Send payment instructions → Wait for funds → Convert → Send to destination' },
      { letter: 'C', text: 'Check available balance → Reserve funds → Convert → Send to destination → Update balances' },
      { letter: 'D', text: 'Convert immediately → Check balance → Send to destination' }
    ],
    correctAnswer: 'A',
    explanation: "For Prefunded Convert & Withdraw operations, the proper sequence starts with generating a quote or rate to lock in the conversion price, then reserving funds from the existing balance, executing the conversion, sending to the external destination, and finally updating balances. While checking balance (C) is important, the quote/rate generation must come first to establish the conversion terms before any funds are reserved. Option B describes DVP/Delivery flows where payment instructions are sent first, and option D skips critical steps that ensure transaction integrity.",
    category: 'technical'
  }
];

// Keep the original advanced questions 11-15
const ADVANCED_RAMP_QUESTIONS: QuizQuestion[] = [
  {
    id: 11,
    question: "When implementing quote-based pricing in DVP flows, what should happen if the quote expires before payment arrives?",
    options: [
      { letter: 'A', text: 'Execute at the expired quote price anyway' },
      { letter: 'B', text: 'Automatically execute at current market price' },
      { letter: 'C', text: 'Reject the order and return funds, unless customer pre-authorized re-quote' },
      { letter: 'D', text: 'Hold funds indefinitely until customer approves new quote' }
    ],
    correctAnswer: 'C',
    explanation: "For DVP and Predunded orders with quote-based pricing, quote expires before payment arrives results in order rejection and fund return by default. Providers can optionally implement a feature allowing customers to pre-authorize automatic re-quote and execution for late arrivals.",
    category: 'technical'
  },
  {
  id: 12,
  question: "What is the purpose of the 'expiresAt' field in RAMP order responses?",
  options: [
    { letter: 'A', text: 'It sets when the entire order record is deleted from the database' },
    { letter: 'B', text: 'It defines the deadline for customer payment or order completion before automatic cancellation' },
    { letter: 'C', text: 'It indicates when the provider must send funds to the customer' },
    { letter: 'D', text: 'It specifies when conversion rates will be recalculated' }
  ],
  correctAnswer: 'B',
  explanation: "The expiresAt field defines the time window for order completion - customers must send payment and providers must process the order before this deadline. After expiration, orders automatically transition to 'Expired' status. It's not for database cleanup (A), doesn't dictate provider timing obligations (C), and rate recalculation (D) is handled separately through quote expiration.",
  category: 'technical'
},
  {
    id: 13,
    question: "What is the primary technical difference between implementing ramps capability for 'all accounts' (*) versus specific account IDs in the capabilities response?",
    options: [
      { letter: 'A', text: 'No difference, just different notation' },
      { letter: 'B', text: 'Asterisk means all current accounts, specific IDs mean only future accounts' },
      { letter: 'C', text: 'Asterisk enables ramps for all accounts, specific IDs restrict ramps to only those accounts' },
      { letter: 'D', text: 'Asterisk is for main accounts only, specific IDs are for sub-accounts only' }
    ],
    correctAnswer: 'C',
    explanation: "The capabilities response controls feature availability per account. Using '*' means RAMP operations are available for all accounts managed by the provider. Listing specific account IDs restricts RAMP functionality to only those accounts, requiring more granular access control logic.",
    category: 'technical'
  },
  {
    id: 14,
    question: "What is the difference between Primary Accounts and Sub-Accounts in the RAMP B2B2C model?",
    options: [
      { letter: 'A', text: 'Primary Accounts are for businesses, Sub-Accounts are for individuals' },
      { letter: 'B', text: 'Primary Accounts have higher transaction limits than Sub-Accounts' },
      { letter: 'C', text: 'Primary Accounts are direct customers, Sub-Accounts are their end-users' },
      { letter: 'D', text: 'Primary Accounts support all currencies, Sub-Accounts are crypto-only' }
    ],
    correctAnswer: 'C',
    explanation: "In the B2B2C model, Primary Accounts represent your direct customers (the businesses), while Sub-Accounts represent their end-users (customers' customers). Both account types can serve businesses or individuals, transaction limits aren't the defining factor, and both support all asset types if configured.",
    category: 'compliance'
  },
  {
    id: 15,
    question: "In a RAMP implementation supporting multiple blockchains, how should asset references be structured to handle the same token across different networks?",
    options: [
      { letter: 'A', text: 'Use the same assetId for identical tokens regardless of blockchain' },
      { letter: 'B', text: 'Create unique assetIds for each blockchain-token combination with blockchain specified in asset definition' },
      { letter: 'C', text: 'Use cryptocurrencySymbol only, ignore blockchain differences' },
      { letter: 'D', text: 'Always use contractAddress regardless of blockchain' }
    ],
    correctAnswer: 'B',
    explanation: "Each blockchain-token combination needs a unique assetId because USDC on Ethereum vs Polygon are technically different assets with different contract addresses and fees. These unique assets must be defined in the GET /capabilities/assets endpoint response. Using the same ID (A) creates confusion, using only symbols (C) loses blockchain context, and contract addresses (D) don't work for all asset types.",
    category: 'technical'
  }
];

// Combine all RAMP questions
export const RAMP_QUIZ_QUESTIONS: QuizQuestion[] = [
  ...BASIC_RAMP_QUESTIONS,
  ...ADVANCED_RAMP_QUESTIONS
];

// Network Link Capabilities Questions for Optional Step 3.5
export const NETWORK_LINK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the main difference between Fireblocks Network and Network Link v2?",
    options: [
      { letter: 'A', text: 'Fireblocks Network is for retail users, Network Link v2 is for institutions' },
      { letter: 'B', text: 'Fireblocks Network is a peer-to-peer liquidity network, while Network Link v2 is an API connectivity solution' },
      { letter: 'C', text: 'They are the same feature with different names' },
      { letter: 'D', text: 'Network Link v2 replaces Fireblocks Network entirely' }
    ],
    correctAnswer: 'B',
    explanation: 'Fireblocks Network is a peer-to-peer institutional liquidity and transfer network of 1,500+ members that enables direct connections between financial institutions. Network Link v2 is an API integration solution that allows third-party platforms to connect to the Fireblocks ecosystem.',
    category: 'network-concepts'
  },
  {
    id: 2,
    question: "If an exchange wants to support ONLY asset conversion, what capabilities are required to implement?",
    options: [
      { letter: 'A', text: 'Mandatory capabilities + Trading' },
      { letter: 'B', text: 'Mandatory Capabilities + Transfers + Transfer blockchains + Liquidity' },
      { letter: 'C', text: 'Mandatory Capabilities + Liquidity' },
      { letter: 'D', text: 'Mandatory Capabilities + Internal Transfers + Liquidity' }
    ],
    correctAnswer: 'C',
    explanation: 'For asset conversion only, exchanges need the mandatory capabilities (accounts, capabilities/assets) plus the liquidity capability. Liquidity specifically enables asset conversion through Fireblocks\' network of liquidity providers.',
    category: 'capabilities'
  },
  {
    id: 3,
    question: "What does the transfersBlockchain capability enable?",
    options: [
      { letter: 'A', text: 'Internal transfers between accounts on the same exchange' },
      { letter: 'B', text: 'Transfers to external blockchain addresses' },
      { letter: 'C', text: 'Fiat currency transfers only' },
      { letter: 'D', text: 'Trading operations between different assets' }
    ],
    correctAnswer: 'B',
    explanation: 'The transfersBlockchain capability specifically enables withdrawals to external blockchain addresses, allowing users to send cryptocurrency from their provider account to external wallets or addresses.',
    category: 'transfers'
  },
  {
    id: 4,
    question: "What does the transfersPeerAccounts capability enable?",
    options: [
      { letter: 'A', text: 'Transfers to public blockchain addresses' },
      { letter: 'B', text: 'Internal transfers within the same provider' },
      { letter: 'C', text: 'Transfers between accounts that belong to different providers or different API keys' },
      { letter: 'D', text: 'Fiat currency transfers only' }
    ],
    correctAnswer: 'C',
    explanation: 'PeerAccounts transfers enable moving assets between accounts managed by different providers or different API keys within the Fireblocks ecosystem, facilitating institutional-to-institutional transfers.',
    category: 'transfers'
  },
  {
    id: 5,
    question: "Which capability component is mandatory for ALL Network Link v2 implementations?",
    options: [
      { letter: 'A', text: 'transfers and trading' },
      { letter: 'B', text: 'accounts and capabilities/assets' },
      { letter: 'C', text: 'ramps and liquidity' },
      { letter: 'D', text: 'collateral and trading' }
    ],
    correctAnswer: 'B',
    explanation: 'The accounts and capabilities/assets components are mandatory for every Network Link v2 implementation as they provide the foundation for account discovery and asset definition that all other capabilities depend on.',
    category: 'capabilities'
  },
  {
    id: 6,
    question: "What is the main benefit of implementing the trading capability in Network Link v2?",
    options: [
      { letter: 'A', text: 'It enables cryptocurrency mining' },
      { letter: 'B', text: 'It allows users to access Fireblocks trading features through the provider\'s platform' },
      { letter: 'C', text: 'It provides market data feeds' },
      { letter: 'D', text: 'It enables staking rewards' }
    ],
    correctAnswer: 'B',
    explanation: 'The trading capability enables providers to offer Fireblocks\' advanced trading features directly through their platform, including professional trading tools, liquidity pools, and institutional-grade order execution.',
    category: 'capabilities'
  },
  {
    id: 7,
    question: "How are new sub-accounts linked to the main account for the first time?",
    options: [
      { letter: 'A', text: 'The user will generate a separate API key/Secret and link the sub-account via the console' },
      { letter: 'B', text: 'The user will need to re-add the main account for the sub-accounts to be linked' },
      { letter: 'C', text: 'After logging in to the console, the user will receive a notification on their mobile to approve the new sub-account' },
      { letter: 'D', text: 'The user must disconnect the main account, reconnect, and approve all notifications on the mobile device for account addition' }
    ],
    correctAnswer: 'C',
    explanation: 'When new sub-accounts are detected by the Network Link integration, users receive push notifications on their registered mobile device that must be approved to establish the account hierarchy, ensuring only authorized account linking.',
    category: 'account-management'
  },
  {
    id: 8,
    question: "What does the liquidity capability enable customers to do?",
    options: [
      { letter: 'A', text: 'Stake cryptocurrencies for rewards' },
      { letter: 'B', text: 'Convert between different assets using Fireblocks liquidity providers' },
      { letter: 'C', text: 'Lend assets to other users' },
      { letter: 'D', text: 'Mine new cryptocurrencies' }
    ],
    correctAnswer: 'B',
    explanation: 'The liquidity capability connects users to Fireblocks\' extensive network of institutional liquidity providers, enabling seamless asset conversion with competitive rates and deep liquidity pools.',
    category: 'capabilities'
  }
];

// Authentication & Signature Quiz Questions for Step 3
export const AUTH_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What four components make up the prehash string for signature generation?",
    options: [
      { letter: 'A', text: 'API-KEY + SECRET + timestamp + nonce' },
      { letter: 'B', text: 'timestamp + nonce + method + endpoint + body' },
      { letter: 'C', text: 'method + endpoint + signature + timestamp' },
      { letter: 'D', text: 'API-KEY + method + body + nonce' }
    ],
    correctAnswer: 'B',
    explanation: 'The prehash string is: timestamp + nonce + method + endpoint + body. This ensures the signature covers all critical parts of the request.',
    category: 'authentication'
  },
  {
    id: 2,
    question: "Which authentication schemes are supported by Network Link v2?",
    options: [
      { letter: 'A', text: 'Only HMAC with SHA256' },
      { letter: 'B', text: 'HMAC, RSA, and ECDSA' },
      { letter: 'C', text: 'OAuth 2.0 and JWT' },
      { letter: 'D', text: 'Basic Authentication only' }
    ],
    correctAnswer: 'B',
    explanation: 'Network Link v2 supports HMAC, RSA, and ECDSA authentication schemes. Each can be configured with different hash functions and encoding options.',
    category: 'authentication'
  },
  {
    id: 3,
    question: "For HMAC signatures, which hash functions are configurable?",
    options: [
      { letter: 'A', text: 'Only SHA256' },
      { letter: 'B', text: 'SHA512, SHA3_256, SHA256' },
      { letter: 'C', text: 'MD5, SHA1, SHA256' },
      { letter: 'D', text: 'Only SHA512' }
    ],
    correctAnswer: 'B',
    explanation: 'HMAC supports SHA512, SHA3_256, and SHA256 hash functions. The choice depends on your security requirements and performance needs.',
    category: 'authentication'
  },
  {
    id: 4,
    question: "What happens to expired requests?",
    options: [
      { letter: 'A', text: 'They are processed normally' },
      { letter: 'B', text: 'They are queued for later processing' },
      { letter: 'C', text: 'They are rejected by the third party' },
      { letter: 'D', text: 'They are automatically refreshed' }
    ],
    correctAnswer: 'C',
    explanation: 'Expired requests are rejected by the third party. The timestamp difference must be less than a reasonable threshold to prevent replay attacks.',
    category: 'authentication'
  },
  {
    id: 5,
    question: "How should servers handle idempotency key reuse with different request data?",
    options: [
      { letter: 'A', text: 'Process the request normally and ignore the duplicate key' },
      { letter: 'B', text: 'Return HTTP 400 with errorType: "idempotency-key-reuse"' },
      { letter: 'C', text: 'Return HTTP 409 conflict and retry automatically' },
      { letter: 'D', text: 'Queue the request for manual review' }
    ],
    correctAnswer: 'B',
    explanation: 'When encountering an idempotency key reuse with different request data, servers should respond with HTTP 400 and a JSON object containing errorType: "idempotency-key-reuse".',
    category: 'authentication'
  },
  {
    id: 6,
    question: "What happens when pagination parameters 'startingAfter' and 'endingBefore' are both provided?",
    options: [
      { letter: 'A', text: 'The server uses startingAfter and ignores endingBefore' },
      { letter: 'B', text: 'The server returns HTTP 400 with an invalid-query-parameters error' },
      { letter: 'C', text: 'The server returns results between the two specified items' },
      { letter: 'D', text: 'The server uses endingBefore and ignores startingAfter' }
    ],
    correctAnswer: 'B',
    explanation: 'endingBefore and startingAfter are mutually exclusive. If both are provided, the server should respond with HTTP 400 and errorType: "invalid-query-parameters".',
    category: 'authentication'
  }
];

export type { QuizQuestion, QuizOption };