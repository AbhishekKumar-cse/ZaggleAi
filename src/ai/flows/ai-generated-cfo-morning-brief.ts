'use server';
/**
 * @fileOverview This file defines a Genkit flow to generate an AI-powered CFO morning brief.
 *
 * - generateCfoMorningBrief - A function that generates the CFO morning brief.
 * - AiGeneratedCfoMorningBriefInput - The input type for the generateCfoMorningBrief function.
 * - AiGeneratedCfoMorningBriefOutput - The return type for the generateCfoMorningBrief function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiGeneratedCfoMorningBriefInputSchema = z.object({
  kpiData: z.object({
    totalMonthlySpend: z.number().describe('Total monthly spend in local currency.'),
    cashPosition: z.number().describe('Current cash position in local currency.'),
    budgetUtilizationPercentage: z.number().describe('Budget utilization percentage.'),
    openComplianceFlags: z.number().describe('Number of open compliance flags.'),
    forecastAccuracyPercentage: z.number().describe('Forecast accuracy percentage.'),
    daysSalesOutstanding: z.number().describe('Days Sales Outstanding (DSO).'),
  }).describe('Key Performance Indicator data for the financial snapshot.'),
  topSpendAlerts: z.array(z.string()).describe('A list of top spend alerts or unusual spending patterns.'),
  forecastDeviation: z.string().describe('A summary of forecast deviation.'),
  strategicRecommendationContext: z.string().describe('Context or current challenges to inform strategic recommendations.'),
});
export type AiGeneratedCfoMorningBriefInput = z.infer<typeof AiGeneratedCfoMorningBriefInputSchema>;

const AiGeneratedCfoMorningBriefOutputSchema = z.string().describe('The AI-generated CFO morning brief, approximately 150 words.');
export type AiGeneratedCfoMorningBriefOutput = z.infer<typeof AiGeneratedCfoMorningBriefOutputSchema>;

const prompt = ai.definePrompt({
  name: 'cfoMorningBriefPrompt',
  input: { schema: AiGeneratedCfoMorningBriefInputSchema },
  output: { schema: AiGeneratedCfoMorningBriefOutputSchema },
  prompt: `You are the AI CFO assistant. Given this financial snapshot, generate a 150-word executive morning brief covering top spend alerts, forecast deviation, and one strategic recommendation. Use crisp CFO language.

Financial Snapshot:
- Total Monthly Spend: {{{kpiData.totalMonthlySpend}}}
- Cash Position: {{{kpiData.cashPosition}}}
- Budget Utilization: {{{kpiData.budgetUtilizationPercentage}}}%
- Open Compliance Flags: {{{kpiData.openComplianceFlags}}}
- Forecast Accuracy: {{{kpiData.forecastAccuracyPercentage}}}%
- Days Sales Outstanding (DSO): {{{kpiData.daysSalesOutstanding}}}

Top Spend Alerts:
{{#if topSpendAlerts}}
  {{#each topSpendAlerts}}
  - {{{this}}}
  {{/each}}
{{else}}
  None
{{/if}}

Forecast Deviation: {{{forecastDeviation}}}

Strategic Recommendation Context: {{{strategicRecommendationContext}}}`
});

const generateCfoMorningBriefFlow = ai.defineFlow(
  {
    name: 'generateCfoMorningBriefFlow',
    inputSchema: AiGeneratedCfoMorningBriefInputSchema,
    outputSchema: AiGeneratedCfoMorningBriefOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateCfoMorningBrief(
  input: AiGeneratedCfoMorningBriefInput
): Promise<AiGeneratedCfoMorningBriefOutput> {
  return generateCfoMorningBriefFlow(input);
}
