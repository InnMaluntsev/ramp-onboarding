"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import StepsClient from "./StepsClient";
import { LabConfig, Step } from "@/types";
import { generalConfig } from "@/config";

type LabPageProps = {
  labSlug: string;
};

export default function LabPage({ labSlug }: LabPageProps) {
  const [labConfig, setLabConfig] = useState<LabConfig | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadLabConfig = async () => {
      try {
        // Import config dynamically to avoid any import issues
        const { labsConfig } = await import("@/config");
        
        const config = labsConfig[labSlug];
        if (!config) {
          setError(`Lab "${labSlug}" not found`);
          setLoading(false);
          return;
        }

        setLabConfig(config);
        
        // Load step content - use correct base path for static export
        const stepsWithContent = await Promise.all(
          config.steps.map(async (step) => {
            try {
              // If step has content directly, use it
              if (step.content) {
                return {
                  id: step.id,
                  title: step.title,
                  content: step.content
                };
              }
              
              // If step has file, try direct access without basePath
              if (step.file) {
                console.log(`Loading step ${step.id} from file: ${step.file}`);
                
                // Direct access to public/steps/ without basePath
                const fileUrl = `${generalConfig.basePath}/steps/${step.file}`;
                console.log(`Trying to fetch: ${fileUrl}`);
                
                const response = await fetch(fileUrl);
                
                if (response.ok) {
                  const content = await response.text();
                  console.log(`✅ Successfully loaded step ${step.id}, content length: ${content.length}`);
                  return {
                    id: step.id,
                    title: step.title,
                    content: content
                  };
                } else {
                  console.error(`❌ Failed to load step ${step.id}: ${response.status} ${response.statusText}`);
                  return {
                    id: step.id,
                    title: step.title,
                    content: `<p>❌ Failed to load content for ${step.title}</p><p>Error: ${response.status} - File not found</p><p>Expected file: <code>public/steps/${step.file}</code></p><p>Try creating the file or visit: <a href="${fileUrl}" target="_blank">${fileUrl}</a></p>`
                  };
                }
              }
              
              // Fallback for steps with neither content nor file
              return {
                id: step.id,
                title: step.title,
                content: `<p>Content for ${step.title} will be added here.</p>`
              };
            } catch (error) {
              console.error(`Error loading step ${step.id}:`, error);
              return {
                id: step.id,
                title: step.title,
                content: `<p>Error loading ${step.title}: ${error.message}</p><p>Please check that the file exists: <code>public/steps/${step.file}</code></p>`
              };
            }
          })
        );
        
        setSteps(stepsWithContent);
      } catch (error) {
        console.error("Error loading lab config:", error);
        setError("Failed to load lab configuration");
      } finally {
        setLoading(false);
      }
    };

    loadLabConfig();
  }, [labSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading lab...</p>
        </div>
      </div>
    );
  }

  if (error || !labConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Lab not found"}
          </h2>
          <p className="text-gray-600 mb-6">
            Available labs: network-link-v2, off-exchange, embedded-wallets, web3-workshop
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-600"
          >
            Back to Labs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-primary-50 to-white py-8 mt-7">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-primary hover:text-primary-600 mb-4 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Labs
          </button>
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            {labConfig.title}
          </h1>
          <p className="text-lg text-secondary">
            {labConfig.description}
          </p>
        </div>
      </div>

      {/* Steps Component */}
      <StepsClient 
        steps={steps} 
        labConfig={labConfig}
        labSlug={labSlug}
      />
    </div>
  );
}