"use client";

import { useMemo } from 'react';
import InteractiveQuiz from './InteractiveQuiz';
import ApiBuilderComponent from './ApiBuilderComponent';
import { RAMP_QUIZ_QUESTIONS, AUTH_QUIZ_QUESTIONS, NETWORK_LINK_QUIZ_QUESTIONS } from './quizQuestions';

interface MarkdownRendererProps {
  content: string;
  onApiValidationComplete?: (isComplete: boolean) => void;
  onDeploymentTrainingComplete?: (isComplete: boolean) => void;
}

export default function MarkdownRenderer({ 
  content, 
  onApiValidationComplete, 
  onDeploymentTrainingComplete 
}: MarkdownRendererProps) {
  const processedData = useMemo(() => {
    // Check for component placeholders
    const hasApiBuilderPlaceholder = content.includes('[API_BUILDER_COMPONENT]');
    const hasDeploymentSimulatorPlaceholder = content.includes('[DEPLOYMENT_SIMULATOR_COMPONENT]');
    const hasQuizPlaceholder = content.includes('<!--QUIZ_PLACEHOLDER-->');
    
    if (hasApiBuilderPlaceholder) {
      return { 
        content, 
        questions: [], 
        hasApiBuilder: true,
        hasDeploymentSimulator: false
      };
    }
    
    if (hasDeploymentSimulatorPlaceholder) {
      return { 
        content, 
        questions: [], 
        hasApiBuilder: false,
        hasDeploymentSimulator: true
      };
    }
    
    if (hasQuizPlaceholder) {
      // More specific detection for quiz type based on content
      console.log('Quiz placeholder found, determining quiz type from content:', content.substring(0, 200));
      
      // Check for RAMP Knowledge Check (Step 2)
      if (content.includes('RAMP Knowledge Check') || 
          content.includes('On-Ramp') || 
          content.includes('Off-Ramp') ||
          content.includes('Bucket Assets')) {
        console.log('Detected RAMP quiz');
        return { 
          content, 
          questions: RAMP_QUIZ_QUESTIONS,
          hasApiBuilder: false,
          hasDeploymentSimulator: false
        };
      } 
      // Check for Authentication & Signature quiz (Step 3)
      else if (content.includes('Authentication & Signature') || 
               content.includes('X-FBAPI-KEY') ||
               content.includes('signature') ||
               content.includes('HMAC') ||
               content.includes('prehash')) {
        console.log('Detected AUTH quiz');
        return { 
          content, 
          questions: AUTH_QUIZ_QUESTIONS,
          hasApiBuilder: false,
          hasDeploymentSimulator: false
        };
      }
      // Check for Network Link capabilities quiz (Step 4)
      else if (content.includes('Network Link') || 
               content.includes('transfersBlockchain') ||
               content.includes('transfersPeerAccounts') ||
               content.includes('liquidity capability')) {
        console.log('Detected NETWORK_LINK quiz');
        return { 
          content, 
          questions: NETWORK_LINK_QUIZ_QUESTIONS,
          hasApiBuilder: false,
          hasDeploymentSimulator: false
        };
      } 
      else {
        // Default fallback - no quiz
        console.log('Quiz placeholder found but no specific quiz type detected, showing no quiz');
        return { 
          content, 
          questions: [],
          hasApiBuilder: false,
          hasDeploymentSimulator: false
        };
      }
    }
    
    return { 
      content, 
      questions: [], 
      hasApiBuilder: false,
      hasDeploymentSimulator: false
    };
  }, [content]);

  const processedContent = useMemo(() => {
    let html = processedData.content;
    
    // First, extract and preserve code blocks
    const codeBlocks: string[] = [];
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
      const index = codeBlocks.length;
      codeBlocks.push(code);
      return `__CODE_BLOCK_${index}__`;
    });
    
    // Convert markdown to HTML properly
    html = html
      // Headers (process in order from largest to smallest)
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-3 mt-6 text-gray-900">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-8 text-gray-900">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-8 text-gray-900">$1</h1>')
      
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      
      // Italic text  
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Process lists properly - identify list blocks first
      .replace(/^((?:[\s]*[-\*\+][\s]+.+\n?)+)/gm, (match) => {
        // Convert individual list items within the block
        const listItems = match.replace(/^[\s]*[-\*\+][\s]+(.+)$/gm, '<li class="text-gray-700">$1</li>');
        return `<ul class="list-disc list-inside ml-4 mb-4">${listItems}</ul>`;
      })
      
      // Line breaks - handle double newlines as paragraph breaks (but not within lists)
      .replace(/(?<!<\/li>)\n\s*\n(?!<li>)/g, '</p><p class="mb-4 text-gray-700">')
      
      // Single line breaks as br tags (but not within lists)
      .replace(/(?<!<\/li>)\n(?!<li>|<ul>|<\/ul>)/g, '<br/>')
      
      // Wrap remaining text in paragraphs (excluding already processed content)
      .replace(/^(?!<[hul]|<\/[hul])(.*?)(?=<|$)/gm, '<p class="mb-4 text-gray-700">$1</p>')
      
      // Clean up empty paragraphs
      .replace(/<p[^>]*><\/p>/g, '')
      .replace(/<p[^>]*>\s*<\/p>/g, '')
      .replace(/<p[^>]*><br\/><\/p>/g, '')
      
      // Clean up paragraph tags around headers and lists
      .replace(/<p[^>]*>(<h[1-6][^>]*>)/g, '$1')
      .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
      .replace(/<p[^>]*>(<ul[^>]*>)/g, '$1')
      .replace(/(<\/ul>)<\/p>/g, '$1')
      
      // Remove any br tags within list items
      .replace(/(<li[^>]*>[^<]*)<br\/>/g, '$1')
      .replace(/<br\/>(<\/li>)/g, '$1');

    // Finally, restore code blocks with proper formatting
    html = html.replace(/__CODE_BLOCK_(\d+)__/g, (match, index) => {
      const code = codeBlocks[parseInt(index)];
      return `<pre class="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm"><code>${code}</code></pre>`;
    });

    return html;
  }, [processedData]);

  // Handle API Builder placeholder
  if (processedData.hasApiBuilder) {
    const contentParts = processedContent.split('[API_BUILDER_COMPONENT]');
    
    return (
      <div className="prose prose-lg max-w-none">
        {/* Content before API builder */}
        {contentParts[0] && (
          <div dangerouslySetInnerHTML={{ __html: contentParts[0] }} />
        )}
        
        {/* API Builder component */}
        <div className="my-8">
          <ApiBuilderComponent onValidationComplete={onApiValidationComplete} />
        </div>
        
        {/* Content after API builder */}
        {contentParts[1] && (
          <div dangerouslySetInnerHTML={{ __html: contentParts[1] }} />
        )}
      </div>
    );
  }

  // Handle quiz placeholder
  const contentParts = processedContent.split('<!--QUIZ_PLACEHOLDER-->');

  return (
    <div className="prose prose-lg max-w-none">
      {/* Content before quiz */}
      {contentParts[0] && (
        <div dangerouslySetInnerHTML={{ __html: contentParts[0] }} />
      )}
      
      {/* Quiz section */}
      {processedData.questions.length > 0 && (
        <div className="my-8">
          <h3 className="text-xl font-semibold mb-6">Knowledge Check</h3>
          <InteractiveQuiz questions={processedData.questions} />
        </div>
      )}
      
      {/* Content after quiz */}
      {contentParts[1] && (
        <div dangerouslySetInnerHTML={{ __html: contentParts[1] }} />
      )}
    </div>
  );
}