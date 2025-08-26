import {
  GeneralConfig,
  MainPageConfig,
  NavBarConfig,
  StepsPageConfig,
  LabConfig,
} from "./types";

const isDev = process.env.NODE_ENV === 'development';

export const generalConfig: GeneralConfig = {
  companyName: "Fireblocks",
  basePath: isDev ? "" : "/PS_Labs",
};

export const navBarConfig: NavBarConfig = {
  discordLink: "https://discord.gg/2gNdsPkq",
  navbarButtonText: "Login",
  navbarButtonLink: "https://sandbox.fireblocks.io",
  logoLink: "https://fireblocks.com"
};

export const mainPageConfig: MainPageConfig = {
  mainTitle: "RAMP",
  subTitle: "Onboarding Guide",
  heroText:
    "Master the implementation of Fireblocks RAMP capabilities for seamless fiat-to-crypto and crypto-to-fiat payment solutions.",
  heroButtonText: "Get Started",
  heroButtonLink: "/labs/ramp-onboarding",

  workshopSummarySteps: [
    {
      title: "RAMP Onboarding",
      text: "Learn to implement Fireblocks RAMP capabilities for institutional payment flows, including on-ramp, off-ramp, and crypto-to-crypto bridging services.",
      slug: "ramp-onboarding"
    }
  ],
};

// Lab configurations
export const labsConfig: Record<string, LabConfig> = {
  "ramp-onboarding": {
    id: "ramp-onboarding",
    title: "RAMP Onboarding Guide",
    description: "Learn to implement Fireblocks RAMP capabilities for institutional payment flows, including on-ramp, off-ramp, and crypto-to-crypto bridging services.",
    prerequisites: [
      { text: "Basic understanding of REST APIs and HTTP methods" },
      { text: "Knowledge of fiat and cryptocurrency payment systems" },
      { text: "Understanding of institutional payment compliance requirements" },
      { text: "Node.js version >20 installed" },
      { text: "A code editor like VS Code" },
    ],
    steps: [
      { id: 1, title: "Understanding RAMP & What You'll Build", file: "ramp-onboarding/step1.md" },
      { id: 2, title: "RAMP Knowledge Check", file: "ramp-onboarding/step2.md" },
      { id: 3, title: "Authentication & Signature", file: "ramp-onboarding/step3.md" },
      { id: 4, title: "Advanced Network Link Capabilities (Optional)", file: "ramp-onboarding/step4.md" },
      { id: 5, title: "Build API Responses", file: "ramp-onboarding/step5.md" },
    ]
  },
  // Keep the old network-link-v2 for backward compatibility if needed
  "network-link-v2": {
    id: "network-link-v2",
    title: "Network Link v2 (Legacy)",
    description: "Legacy Network Link v2 integration guide",
    prerequisites: [
      { text: "Legacy content - please use RAMP Onboarding instead" }
    ],
    steps: [
      { id: 1, title: "Redirecting to RAMP", content: "<p>This content has been replaced by the RAMP Onboarding Guide. <a href='/labs/ramp-onboarding'>Click here to access the new guide</a>.</p>" }
    ]
  }
};

// Legacy config for backward compatibility
export const stepsPageConfig: StepsPageConfig = {
  stepsData: labsConfig["ramp-onboarding"].steps,
  prerequisites: labsConfig["ramp-onboarding"].prerequisites,
};