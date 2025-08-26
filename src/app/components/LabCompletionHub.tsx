import React, { useState } from 'react';
import { 
  FiCheckCircle, 
  FiClock, 
  FiDownload, 
  FiExternalLink, 
  FiUsers, 
  FiSettings, 
  FiFileText, 
  FiTrendingUp,
  FiChevronDown,
  FiChevronUp,
  FiStar,
  FiTarget,
  FiBookOpen,
  FiCreditCard,
  FiShield
} from 'react-icons/fi';

interface LabCompletionHubProps {
  onStartOver?: () => void;
  onBackToLabs?: () => void;
  labTitle?: string;
}

const LabCompletionHub = ({ onStartOver, onBackToLabs, labTitle = "RAMP Onboarding" }: LabCompletionHubProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('achievements');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const achievements = [
    {
      title: "RAMP Integration Mastery",
      description: "Built understanding of Fireblocks RAMP capabilities and payment processing flows",
      icon: FiBookOpen,
      color: "text-blue-600 bg-blue-100"
    },
    {
      title: "API Development Complete",
      description: "Successfully implemented and validated all required RAMP API endpoints",
      icon: FiTarget,
      color: "text-purple-600 bg-purple-100"
    },
    {
      title: "Security Implementation",
      description: "Configured proper authentication, signatures, and compliance workflows",
      icon: FiShield,
      color: "text-green-600 bg-green-100"
    },
    {
      title: "Production Ready",
      description: "Your RAMP implementation is ready for Fireblocks integration and customer use",
      icon: FiCreditCard,
      color: "text-orange-600 bg-orange-100"
    }
  ];

  const timelinePhases = [
    {
      phase: "Now",
      title: "Testing & Validation",
      tasks: [
        "Test your RAMP endpoints with Fireblocks validation tools",
        "Verify payment instruction generation works correctly",
        "Validate error handling and edge cases",
        "Ensure compliance workflows are functioning",
        "Run end-to-end transaction simulations"
      ],
      status: "current"
    },
    {
      phase: "Week 1", 
      title: "Fireblocks Integration",
      tasks: [
        "Submit your RAMP implementation for Fireblocks review",
        "Complete technical integration testing",
        "Configure production environment settings",
        "Set up monitoring and alerting systems",
        "Finalize compliance and security configurations"
      ],
      status: "upcoming"
    },
    {
      phase: "Week 2-3",
      title: "Go-Live Preparation",
      tasks: [
        "Complete Fireblocks onboarding process",
        "Configure your provider settings in Fireblocks network",
        "Set up customer support and documentation",
        "Prepare marketing materials for your RAMP services",
        "Train your team on RAMP operations and troubleshooting"
      ],
      status: "upcoming"
    },
    {
      phase: "Week 4+",
      title: "Launch & Scale",
      tasks: [
        "Launch your RAMP services to customers",
        "Monitor transaction volumes and performance",
        "Gather customer feedback and iterate",
        "Expand to additional payment methods and regions",
        "Scale infrastructure based on demand"
      ],
      status: "upcoming"
    }
  ];

  const practicalTools = [
    {
      title: "Fireblocks RAMP API Documentation",
      description: "Complete technical reference for implementing RAMP endpoints and integration",
      type: "Documentation",
      downloadUrl: "https://fireblocks.github.io/fireblocks-network-link/v2/docs.html#section/Introduction",
      icon: FiFileText
    },
    {
      title: "API Validation Tools",
      description: "Test and validate your RAMP implementation before going live",
      type: "Testing",
      downloadUrl: "#validation-tools",
      icon: FiTarget
    },
    {
      title: "Implementation Examples",
      description: "Sample code and reference implementations for common RAMP use cases",
      type: "Code",
      downloadUrl: "#examples",
      icon: FiFileText
    },
    {
      title: "Compliance Checklist",
      description: "KYC/AML requirements and regulatory guidelines for RAMP providers",
      type: "Checklist",
      downloadUrl: "#compliance",
      icon: FiShield
    },
    {
      title: "Troubleshooting Guide",
      description: "Common issues, error codes, and solutions for RAMP implementations",
      type: "Guide",
      downloadUrl: "#troubleshooting",
      icon: FiTrendingUp
    },
    {
      title: "Customer Integration Kit",
      description: "Help your customers integrate with your RAMP services effectively",
      type: "Kit",
      downloadUrl: "#customer-kit",
      icon: FiUsers
    }
  ];

  const nextActions = [
    {
      title: "Test Your Implementation",
      description: "Use Fireblocks validation tools to test your RAMP endpoints and payment flows",
      action: "Start Testing",
      urgent: true,
      icon: FiSettings
    },
    {
      title: "Submit for Review",
      description: "Submit your RAMP implementation to Fireblocks for technical review and approval",
      action: "Submit Now",
      urgent: true,
      icon: FiCheckCircle
    },
    {
      title: "Join Provider Network",
      description: "Complete onboarding to become an official Fireblocks RAMP provider",
      action: "Start Onboarding",
      urgent: false,
      icon: FiTrendingUp
    },
    {
      title: "Plan Your Launch",
      description: "Prepare marketing, documentation, and customer onboarding for your RAMP services",
      action: "Create Plan",
      urgent: false,
      icon: FiUsers
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <FiCreditCard className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">RAMP Implementation Complete!</h1>
        <p className="text-lg text-gray-600 mb-4">
          Your RAMP API is ready for Fireblocks integration and customer deployment
        </p>
        <div className="flex justify-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <FiCheckCircle className="w-4 h-4 text-green-500" />
            5 Steps Completed
          </span>
          <span className="flex items-center gap-1">
            <FiCheckCircle className="w-4 h-4 text-green-500" />
            API Endpoints Validated
          </span>
          <span className="flex items-center gap-1">
            <FiCheckCircle className="w-4 h-4 text-green-500" />
            Production Ready
          </span>
        </div>
      </div>

      {/* Achievement Summary */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('achievements')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold text-gray-900">🏆 Achievement Summary</h2>
          {expandedSection === 'achievements' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSection === 'achievements' && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${achievement.color}`}>
                    <achievement.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Implementation Roadmap */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('roadmap')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold text-gray-900">🗺️ Customer Implementation Roadmap</h2>
          {expandedSection === 'roadmap' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSection === 'roadmap' && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="space-y-6">
              {timelinePhases.map((phase, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    {index < timelinePhases.length - 1 && (
                      <div className="w-px h-16 bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {phase.phase}
                      </span>
                      <h3 className="font-semibold text-gray-900">{phase.title}</h3>
                    </div>
                    <ul className="space-y-1">
                      {phase.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="text-sm text-gray-600 flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Practical Tools */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('tools')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold text-gray-900">🛠️ RAMP Implementation Resources</h2>
          {expandedSection === 'tools' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSection === 'tools' && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {practicalTools.map((tool, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <tool.icon className="w-6 h-6 text-blue-600" />
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tool.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                  <a 
                    href={tool.downloadUrl}
                    target={tool.downloadUrl.startsWith('http') ? '_blank' : '_self'}
                    rel={tool.downloadUrl.startsWith('http') ? 'noopener noreferrer' : ''}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {tool.downloadUrl.startsWith('http') ? (
                      <FiExternalLink className="w-4 h-4" />
                    ) : (
                      <FiDownload className="w-4 h-4" />
                    )}
                    <span>{tool.downloadUrl.startsWith('http') ? 'View Resource' : 'Download'}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next Actions */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('actions')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold text-gray-900">🚀 Recommended Next Steps</h2>
          {expandedSection === 'actions' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSection === 'actions' && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nextActions.map((action, index) => (
                <div key={index} className={`border rounded-lg p-4 ${
                  action.urgent 
                    ? 'border-orange-200 bg-orange-50' 
                    : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      action.urgent 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        {action.urgent && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                            Priority
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                      <button className={`text-sm font-medium px-3 py-1 rounded ${
                        action.urgent
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      } transition-colors`}>
                        {action.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RAMP Business Value */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-purple-900 mb-4">🚀 Your RAMP Implementation Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
            <div className="text-sm text-purple-700">Automated payment processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">Global</div>
            <div className="text-sm text-purple-700">Multi-currency & blockchain support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">Secure</div>
            <div className="text-sm text-purple-700">Enterprise-grade infrastructure</div>
          </div>
        </div>
        <p className="text-purple-700 text-sm mt-4 text-center">
          Your customers can now seamlessly move between fiat and crypto through your platform
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <button 
          onClick={onStartOver}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
        >
          Restart Lab
        </button>
        <button 
          onClick={onBackToLabs}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          Explore More Labs
        </button>
        <button 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          onClick={() => window.open('https://fireblocks.github.io/fireblocks-network-link/v2/docs.html#section/Introduction', '_blank')}
        >
          View RAMP API Docs
        </button>
      </div>
    </div>
  );
};

export default LabCompletionHub;