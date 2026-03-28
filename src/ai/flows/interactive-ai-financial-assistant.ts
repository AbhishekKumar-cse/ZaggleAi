'use server';
/**
 * @fileOverview This file implements the Genkit flow for the interactive AI financial assistant.
 * It provides a conversational interface for users to query financial data,
 * request analyses, and dispatch tasks to autonomous agents.
 *
 * - interactiveAiFinancialAssistant - The main function to interact with the AI assistant.
 * - InteractiveAiFinancialAssistantInput - The input type for the assistant.
 * - InteractiveAiAiFinancialAssistantOutput - The return type for the assistant.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const InteractiveAiFinancialAssistantInputSchema = z.object({
  message: z.string().describe('The user\'s current chat message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('Previous chat history to maintain context.'),
});
export type InteractiveAiFinancialAssistantInput = z.infer<typeof InteractiveAiFinancialAssistantInputSchema>;

// Output Schema
const InteractiveAiFinancialAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant\'s response to the user query.'),
});
export type InteractiveAiFinancialAssistantOutput = z.infer<typeof InteractiveAiFinancialAssistantOutputSchema>;

// --- Tools Definition ---

// Tool 1: getFinancialData
const getFinancialData = ai.defineTool(
  {
    name: 'getFinancialData',
    description: 'Retrieves specific financial metrics or reports (e.g., total monthly spend, cash position, budget utilization, spend by department, forecast accuracy) based on user query. Use this for questions asking for current financial status or aggregated data.',
    inputSchema: z.object({
      metricName: z.string().describe('The specific financial metric or report requested (e.g., "total monthly spend", "cash position", "budget utilization", "spend by department", "open compliance flags", "forecast accuracy", "days sales outstanding").'),
      department: z.string().optional().describe('The department relevant to the metric, if applicable (e.g., "Marketing", "Sales", "Engineering").'),
      timePeriod: z.string().optional().describe('The time period for the metric, if applicable (e.g., "this month", "last quarter", "Q1", "year-to-date").'),
    }),
    outputSchema: z.string().describe('A summary of the requested financial data in a natural language format.'),
  },
  async (input) => {
    console.log(`Tool: getFinancialData called with: ${JSON.stringify(input)}`);
    // In a real application, this would interact with Firestore to fetch live data.
    // For this prototype, return mock data based on input.
    switch (input.metricName.toLowerCase()) {
      case 'total monthly spend':
        return `Total monthly spend is ₹2,500,000.`;
      case 'cash position':
        return `Current cash position is ₹15,000,000.`;
      case 'budget utilization':
        if (input.department) {
          return `Budget utilization for ${input.department} is 85% for ${input.timePeriod || 'this month'}.`;
        }
        return `Overall budget utilization is 92%.`;
      case 'open compliance flags':
        return `There are 7 open compliance flags.`;
      case 'forecast accuracy':
        return `Current forecast accuracy is 91%.`;
      case 'days sales outstanding':
        return `Days Sales Outstanding (DSO) is 45 days.`;
      case 'spend by department':
        return `Spend by department for ${input.timePeriod || 'this month'}: Engineering: ₹800,000, Sales: ₹700,000, Marketing: ₹500,000, HR: ₹300,000, Operations: ₹200,000.`;
      default:
        return `Could not find data for metric: "${input.metricName}". Please specify a valid financial metric.`;
    }
  }
);

// Tool 2: dispatchAgentTask
const dispatchAgentTask = ai.defineTool(
  {
    name: 'dispatchAgentTask',
    description: 'Dispatches a natural language task or an analysis request to one of the specialized autonomous financial agents (e.g., SpendSentinel, ForecastOracle, ComplianceGuard, NarratorAI, ReconcileBot, TreasuryPilot). Use this when the user asks for an agent to perform an action or run an analysis.',
    inputSchema: z.object({
      agentName: z.enum([
        'SpendSentinel',
        'ForecastOracle',
        'ComplianceGuard',
        'NarratorAI',
        'ReconcileBot',
        'TreasuryPilot',
      ]).describe('The name of the autonomous agent to dispatch the task to.'),
      taskDescription: z.string().describe('A detailed natural language description of the task or analysis the agent needs to perform.'),
    }),
    outputSchema: z.string().describe('A confirmation message indicating the task has been dispatched to the agent.'),
  },
  async (input) => {
    console.log(`Tool: dispatchAgentTask called with: ${JSON.stringify(input)}`);
    // In a real application, this would trigger a Firebase Cloud Function or directly interact with the agent's logic.
    // For this prototype, return a confirmation message.
    return `Task "${input.taskDescription}" dispatched to ${input.agentName}. I will notify you once it's complete.`;
  }
);

// --- Genkit Flow Definition ---

const interactiveAiFinancialAssistantFlow = ai.defineFlow(
  {
    name: 'interactiveAiFinancialAssistantFlow',
    inputSchema: InteractiveAiFinancialAssistantInputSchema,
    outputSchema: InteractiveAiFinancialAssistantOutputSchema,
  },
  async (input) => {
    const messages = input.history ? [...input.history] : [];
    messages.push({ role: 'user', content: input.message });

    const systemPrompt = `You are CFO-OS AI, an expert AI CFO assistant with full access to the company's financial data and the ability to dispatch tasks to specialized financial agents.\n    Your capabilities include:\n    - Answering questions about current financial metrics (e.g., spend, cash, budget, forecast accuracy, compliance flags, DSO).\n    - Requesting analyses on financial data.\n    - Dispatching tasks to autonomous financial agents.\n\n    Always be precise, data-driven, and use CFO-appropriate language.\n    If you need to fetch specific financial data, use the 'getFinancialData' tool.\n    If the user asks an agent to perform a task or analysis, use the 'dispatchAgentTask' tool.\n    When summarizing financial data, try to provide actionable insights or context.\n    If you cannot fulfill a request, clearly state what you can and cannot do.\n    Always prioritize using the provided tools when relevant to the user's request.\n    Current Date: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash', // Adhering to src/ai/genkit.ts
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      tools: [getFinancialData, dispatchAgentTask], // Make tools available to the AI
      config: {
        maxTokens: 1024,
      }
    });

    if (!output) {
      throw new Error('AI did not return any output.');
    }

    return { response: output.text() };
  }
);

// Export the wrapper function
export async function interactiveAiFinancialAssistant(
  input: InteractiveAiFinancialAssistantInput
): Promise<InteractiveAiFinancialAssistantOutput> {
  return interactiveAiFinancialAssistantFlow(input);
}
