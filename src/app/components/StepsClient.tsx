"use client";

import { useState, useEffect, useRef } from "react";
import { FiCheckCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Confetti from "react-confetti";
import MarkdownRenderer from "./MarkdownRenderer";
import LabCompletionHub from "./LabCompletionHub";
import { useWindowSize } from "react-use";
import { mainPageConfig } from "@/config";
import { LabConfig, Step } from "@/types";

type StepsClientProps = {
  steps: Step[];
  labConfig?: LabConfig;
  labSlug?: string;
}

export default function StepsClient({ steps, labConfig, labSlug }: StepsClientProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [apiValidationComplete, setApiValidationComplete] = useState<boolean>(false);
  const { width, height } = useWindowSize();
  const allStepsCompleted = completedSteps.length === steps.length;

  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Create unique storage keys for each lab
  const storageKey = labSlug ? `completedSteps_${labSlug}` : "completedSteps";
  const apiValidationKey = labSlug ? `apiValidation_${labSlug}` : "apiValidation";

  // Find the API building step dynamically based on step title
  const apiValidationStepId = steps.find(step => 
    step.title.toLowerCase().includes('build api') || 
    step.title.toLowerCase().includes('api responses') ||
    step.title.toLowerCase().includes('api builder')
  )?.id || 5; // Default to step 5 if not found

  useEffect(() => {
    const savedCompletedSteps = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );
    if (savedCompletedSteps.length > 0) {
      setCompletedSteps(savedCompletedSteps);
      setActiveStep(savedCompletedSteps[savedCompletedSteps.length - 1] + 1);
    }

    // Load API validation state
    const savedApiValidation = localStorage.getItem(apiValidationKey);
    if (savedApiValidation) {
      setApiValidationComplete(JSON.parse(savedApiValidation));
    }
  }, [storageKey, apiValidationKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(completedSteps));
  }, [completedSteps, storageKey]);

  useEffect(() => {
    localStorage.setItem(apiValidationKey, JSON.stringify(apiValidationComplete));
  }, [apiValidationComplete, apiValidationKey]);

  const toggleStep = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const handleApiValidationComplete = (isComplete: boolean) => {
    setApiValidationComplete(isComplete);
  };

  const canCompleteStep = (stepId: number) => {
    // For the API building step, require API validation to be complete
    if (stepId === apiValidationStepId) {
      return apiValidationComplete;
    }
    // For other steps, allow completion normally
    return true;
  };

  const handleNextStep = (currentStepId: number) => {
    if (!canCompleteStep(currentStepId)) {
      return; // Don't proceed if step can't be completed
    }

    setCompletedSteps((prev) => [...prev, currentStepId]);
    const nextStepId = currentStepId + 1;
    setExpandedStep(nextStepId);
    setActiveStep(nextStepId);

    setTimeout(() => {
      if (stepRefs.current[nextStepId]) {
        stepRefs.current[nextStepId]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleStartOver = () => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(apiValidationKey);
    setCompletedSteps([]);
    setActiveStep(1);
    setExpandedStep(null);
    setApiValidationComplete(false);
  };

  const handleBackToLabs = () => {
    window.location.href = "/";
  };

  const prerequisites = labConfig?.prerequisites || [];
  const labTitle = labConfig?.title || "Workshop";

  const getCompleteButtonText = (stepId: number) => {
    if (stepId === apiValidationStepId && !apiValidationComplete) {
      return "Complete API Validation First";
    }
    return "Complete";
  };

  const isCompleteButtonDisabled = (stepId: number) => {
    return stepId === apiValidationStepId && !apiValidationComplete;
  };

  return (
    <>
      {!completedSteps.includes(steps.length) && prerequisites.length > 0 && (
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="bg-primary-50 border shadow-md shadow-primary-100 border-primary-200 rounded-2xl p-6 mb-10">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Prerequisites:
          </h3>
          <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
            {prerequisites.map((prerequisite, index) => (
              <li
                key={index}
                dangerouslySetInnerHTML={{ __html: prerequisite.text }}
              />
            ))}
          </ul>
        </div>
      </div>
      
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {allStepsCompleted && (
          <>
            <Confetti width={width} height={height} />
            <LabCompletionHub 
              onStartOver={handleStartOver}
              onBackToLabs={handleBackToLabs}
              labTitle={labTitle}
            />
          </>
        )}
        {!allStepsCompleted && (
          <>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">
              {labTitle} Steps
            </h2>
            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`border border-primary-200 shadow-md shadow-primary-100 rounded-lg p-4 sm:p-6 overflow-hidden ${
                    activeStep === step.id
                      ? "bg-white"
                      : completedSteps.includes(step.id)
                      ? "bg-gray-100"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  ref={(el) => {
                    stepRefs.current[step.id] = el;
                  }}
                >
                  <div
                    className={`flex justify-between items-center ${
                      activeStep === step.id || completedSteps.includes(step.id)
                        ? "cursor-pointer"
                        : ""
                    }`}
                    onClick={() =>
                      (activeStep === step.id ||
                        completedSteps.includes(step.id)) &&
                      toggleStep(step.id)
                    }
                  >
                    <div className="flex items-center">
                      <h3 className="text-lg sm:text-xl font-semibold">
                        {step.title}
                      </h3>
                      {/* Show API validation status for the API building step */}
                      {step.id === apiValidationStepId && activeStep === apiValidationStepId && (
                        <span className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
                          apiValidationComplete 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {apiValidationComplete ? 'API Validated' : 'API Validation Required'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {completedSteps.includes(step.id) && (
                        <FiCheckCircle className="text-green-500 text-2xl" />
                      )}
                      {(activeStep === step.id || expandedStep === step.id) &&
                        (expandedStep === step.id ? (
                          <FiChevronUp className="text-2xl" />
                        ) : (
                          <FiChevronDown className="text-2xl" />
                        ))}
                    </div>
                  </div>
                  {expandedStep === step.id && (
                    <>
                      <div className="mt-4 sm:mt-6 flex justify-center">
                        <div className="prose prose-sm sm:prose-lg max-w-full">
                          <MarkdownRenderer 
                            content={step.content as string}
                            onApiValidationComplete={handleApiValidationComplete}
                          />
                        </div>
                      </div>
                      {activeStep === step.id && (
                        <div className="w-full flex justify-center mt-4 sm:mt-6">
                          <button
                            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-2xl font-medium transition-colors ${
                              isCompleteButtonDisabled(step.id)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-white to-primary-50 text-primary-500 border border-primary-200 hover:from-primary hover:to-primary hover:text-white'
                            }`}
                            onClick={() => handleNextStep(step.id)}
                            disabled={isCompleteButtonDisabled(step.id)}
                          >
                            {getCompleteButtonText(step.id)}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}