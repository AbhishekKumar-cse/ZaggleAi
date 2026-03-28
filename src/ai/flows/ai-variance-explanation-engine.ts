'use server';
/**
 * @fileOverview Provides an AI-generated explanation for budget variances, outlining root causes and suggesting corrective actions.
 *
 * - explainVariance - A function that handles the AI variance explanation process.
 * - AiVarianceExplanationInput - The input type for the explainVariance function.
 * - AiVarianceExplanationOutput - The return type for the explainVariance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiVarianceExplanationInputSchema = z.object({
  department: z.string().describe('The name of the department with the variance.'),
  variance: z.number().describe('The numerical value of the variance (actual - budget).'),
  budget: z.number().describe('The budgeted amount for the department.'),
  actual: z.number().describe('The actual spend for the department.'),
  categories: z.array(z.string()).describe('A list of top spending categories for the department.'),
});
export type AiVarianceExplanationInput = z.infer<typeof AiVarianceExplanationInputSchema>;

const AiVarianceExplanationOutputSchema = z.object({
  explanation: z.string().describe('A 3-bullet CFO-ready explanation of the variance.'),
  rootCauses: z.array(z.string()).describe('A list of likely root causes for the variance.'),
  correctiveActions: z.array(z.string()).describe('A list of suggested corrective actions.'),
  riskLevel: z.enum(['Low', 'Medium', 'High']).describe('The assessed risk level of the variance.'),
});
export type AiVarianceExplanationOutput = z.infer<typeof AiVarianceExplanationOutputSchema>;

export async function explainVariance(input: AiVarianceExplanationInput): Promise<AiVarianceExplanationOutput> {
  return aiVarianceExplanationEngineFlow(input);
}

const explainVariancePrompt = ai.definePrompt({
  name: 'explainVariancePrompt',
  input: { schema: AiVarianceExplanationInputSchema },
  output: { schema: AiVarianceExplanationOutputSchema },
  prompt: `You are an expert financial analyst. Your task is to explain budget variances for a given department.
Given the following financial context, provide a 3-bullet CFO-ready variance explanation, identify likely root causes, suggest corrective actions, and assess the risk level.

Department: {{{department}}}
Budget: ₹{{{budget}}}
Actual Spend: ₹{{{actual}}}
Variance: ₹{{{variance}}} (which is {{{variance > 0 ? 'an overspend' : 'an underspend'}}})
Top Spending Categories:
{{#each categories}}- {{{this}}}
{{/each}}

Please provide the output in JSON format, strictly following the schema provided.`,
});

const aiVarianceExplanationEngineFlow = ai.defineFlow(
  {
    name: 'aiVarianceExplanationEngineFlow',
    inputSchema: AiVarianceExplanationInputSchema,
    outputSchema: AiVarianceExplanationOutputSchema,
  },
  async (input) => {
    const { output } = await explainVariancePrompt(input);
    return output!;
  }
);
