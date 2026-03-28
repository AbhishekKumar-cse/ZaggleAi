'use server';

/**
 * @fileOverview A Genkit flow for generating AI-driven predictive financial forecasts and scenario analysis.
 *
 * - aiDrivenPredictiveForecasting - A function that handles the forecasting process.
 * - PredictiveForecastingInput - The input type for the aiDrivenPredictiveForecasting function.
 * - PredictiveForecastingOutput - The return type for the aiDrivenPredictiveForecasting function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mock for the Firebase Cloud Function
// In a real application, you would import `httpsCallable` from Firebase SDK
// and initialize `getFunctions()` correctly, e.g., from '@/lib/claude'.
// For now, this mock simulates the interaction with the Cloud Function.
const callClaudeAICloudFunction = async (data: { prompt: string; systemPrompt?: string; maxTokens?: number }) => {
  console.log('Calling Claude AI Cloud Function with:', data.prompt.substring(0, 200) + '...');
  let mockOutput: PredictiveForecastingOutput;

  // Simulate a response from Claude based on keywords in the prompt
  switch (true) {
    case data.prompt.includes("predictive spend forecast"):
      mockOutput = {
        forecastType: 'predictive-spend',
        summary: 'Simulated 3-month base predictive spend forecast showing a steady trend.',
        spendProjections: [
          { date: '2023-11-01', projectedAmount: 15000, confidenceLower: 14000, confidenceUpper: 16000 },
          { date: '2023-11-15', projectedAmount: 14500, confidenceLower: 13500, confidenceUpper: 15500 },
          { date: '2023-11-30', projectedAmount: 15200, confidenceLower: 14200, confidenceUpper: 16200 },
          { date: '2023-12-15', projectedAmount: 14800, confidenceLower: 13800, confidenceUpper: 15800 },
          { date: '2023-12-31', projectedAmount: 15500, confidenceLower: 14500, confidenceUpper: 16500 },
          { date: '2024-01-15', projectedAmount: 15100, confidenceLower: 14100, confidenceUpper: 16100 },
        ],
        details: { modelUsed: 'MockClaude', confidenceLevel: '90%' }
      };
      break;
    case data.prompt.includes("P&L scenario"):
      mockOutput = {
        forecastType: 'pnl-scenario',
        summary: 'Simulated P&L scenario analysis for a 5% revenue growth and 2% cost reduction.',
        pnlImpact: {
          projectedRevenue: 1050000,
          projectedCosts: 490000,
          projectedEbitda: 560000,
          cashFlowImpact: 50000,
          breakevenAnalysis: 'Breakeven point improved by 10% under this scenario. Requires 20% less unit sales to breakeven.',
        },
        details: { assumptions: 'Conservative market growth, stable raw material costs' }
      };
      break;
    case data.prompt.includes("cash flow forecast"):
      mockOutput = {
        forecastType: 'cash-flow-forecast',
        summary: 'Simulated 30-day cash flow forecast indicating a positive trend with sufficient liquidity.',
        cashFlowProjections: [
          { date: '2023-11-01', projectedBalance: 100000, inflows: 5000, outflows: 2000, isBelowThreshold: false },
          { date: '2023-11-05', projectedBalance: 103000, inflows: 8000, outflows: 5000, isBelowThreshold: false },
          { date: '2023-11-10', projectedBalance: 101000, inflows: 3000, outflows: 5000, isBelowThreshold: false },
          { date: '2023-11-15', projectedBalance: 106000, inflows: 10000, outflows: 5000, isBelowThreshold: false },
          { date: '2023-11-20', projectedBalance: 104000, inflows: 4000, outflows: 6000, isBelowThreshold: false },
          { date: '2023-11-25', projectedBalance: 98000, inflows: 2000, outflows: 8000, isBelowThreshold: true }, // Example below threshold
          { date: '2023-11-30', projectedBalance: 105000, inflows: 10000, outflows: 3000, isBelowThreshold: false },
        ],
        details: { cashFloorThreshold: 100000 }
      };
      break;
    default:
      mockOutput = {
        forecastType: 'error',
        summary: 'Failed to parse prompt for Claude function.',
        errorMessage: 'Invalid prompt content.',
      };
  }

  // Wrap in `data` to simulate Cloud Function response structure
  return { data: { content: JSON.stringify(mockOutput) } };
};

// Input Schema
const PredictiveForecastingInputSchema = z.object({
  forecastType: z.union([
    z.literal('predictive-spend'),
    z.literal('pnl-scenario'),
    z.literal('cash-flow-forecast'),
  ]).describe('The type of financial forecast or scenario analysis to perform.'),
  // Common context data (e.g., historical data structure for Claude to understand)
  contextData: z.record(z.any()).optional().describe('General financial context data needed for the forecast.'),

  // Predictive Spend specific inputs (from 3C)
  historicalSpendData: z.array(z.object({
    date: z.string().describe('Date in YYYY-MM-DD format'),
    amount: z.number().describe('Spend amount for the day/period'),
  })).optional().describe('Historical spend data for predictive spend forecasting (e.g., last 6 months).'),
  scenario: z.union([
    z.literal('Base'),
    z.literal('Optimistic'),
    z.literal('Pessimistic'),
  ]).optional().describe('Scenario for predictive spend forecast (e.g., Base, Optimistic, Pessimistic).'),

  // P&L Scenario specific inputs (from 3E)
  currentFinancials: z.object({
    revenue: z.number().describe('Current revenue.'),
    costs: z.number().describe('Current costs.'),
    ebitda: z.number().describe('Current EBITDA.'),
    cash: z.number().describe('Current cash balance.'),
  }).optional().describe('Current financial snapshot for P&L scenario modeling.'),
  scenarioInputs: z.object({
    revenueGrowthPercent: z.number().describe('Projected revenue growth percentage (e.g., 5 for 5%).'),
    costReductionPercent: z.number().describe('Projected cost reduction percentage (e.g., 2 for 2%).'),
    headcountChange: z.number().describe('Absolute change in headcount (positive for increase, negative for decrease).'),
    capExChange: z.number().describe('Change in Capital Expenditure (positive for increase, negative for decrease).'),
  }).optional().describe('Specific scenario inputs for P&L analysis.'),

  // Cash Flow Forecast specific inputs (from 4C)
  currentCashBalance: z.number().optional().describe('Current cash balance to start the forecast.'),
  recurringPayments: z.array(z.object({
    name: z.string().describe('Name of the recurring payment.'),
    amount: z.number().describe('Amount of the recurring payment.'),
    frequency: z.string().describe('Frequency of the payment (e.g., "monthly", "quarterly").'),
    nextDate: z.string().describe('Next payment date in YYYY-MM-DD format.'),
  })).optional().describe('List of recurring payments.'),
  vendorPaymentCycles: z.array(z.object({
    vendor: z.string().describe('Vendor name.'),
    amount: z.number().describe('Amount due to vendor.'),
    avgDays: z.number().describe('Average days until payment due to vendor.'),
  })).optional().describe('Vendor payment cycle data.'),
  receivablesAging: z.array(z.object({
    customer: z.string().describe('Customer name.'),
    amount: z.number().describe('Amount receivable from customer.'),
    daysDue: z.number().describe('Days until receivable is due from customer.'),
  })).optional().describe('Receivables aging data.'),
  payrollDates: z.array(z.string().describe('Upcoming payroll dates in YYYY-MM-DD format.')).optional().describe('List of upcoming payroll dates.'),

}).describe('Input for various financial predictive forecasts and scenario analyses.');

export type PredictiveForecastingInput = z.infer<typeof PredictiveForecastingInputSchema>;

// Output Schema
const PredictiveForecastingOutputSchema = z.object({
  forecastType: z.union([
    z.literal('predictive-spend'),
    z.literal('pnl-scenario'),
    z.literal('cash-flow-forecast'),
    z.literal('error'), // To indicate an error in processing or invalid input
  ]),
  summary: z.string().describe('A narrative summary of the forecast or scenario analysis.'),
  details: z.record(z.any()).optional().describe('Detailed results, specific to the forecast type, such as model assumptions or additional metrics.'),
  errorMessage: z.string().optional().describe('Error message if the operation failed, along with suggested corrective actions.'),

  // Specific outputs for Predictive Spend
  spendProjections: z.array(z.object({
    date: z.string().describe('Date for the projection in YYYY-MM-DD format.'),
    projectedAmount: z.number().describe('Projected spend amount for the given date/period.'),
    confidenceLower: z.number().optional().describe('Lower bound of the confidence interval for the projection.'),
    confidenceUpper: z.number().optional().describe('Upper bound of the confidence interval for the projection.'),
  })).optional().describe('Projected spend amounts with optional confidence intervals.'),

  // Specific outputs for P&L Scenario
  pnlImpact: z.object({
    projectedRevenue: z.number().describe('Projected revenue after scenario application.'),
    projectedCosts: z.number().describe('Projected costs after scenario application.'),
    projectedEbitda: z.number().describe('Projected EBITDA after scenario application.'),
    cashFlowImpact: z.number().describe('Estimated cash flow impact from the scenario.'),
    breakevenAnalysis: z.string().optional().describe('Analysis of the new breakeven point or changes due to the scenario.'),
  }).optional().describe('Projected P&L and cash flow impact from the scenario.'),

  // Specific outputs for Cash Flow Forecast
  cashFlowProjections: z.array(z.object({
    date: z.string().describe('Date for the cash flow projection in YYYY-MM-DD format.'),
    projectedBalance: z.number().describe('Projected cash balance at the end of the day.'),
    inflows: z.number().describe('Estimated cash inflows for the day.'),
    outflows: z.number().describe('Estimated cash outflows for the day.'),
    isBelowThreshold: z.boolean().optional().describe('True if projected balance drops below a predefined cash floor threshold.'),
  })).optional().describe('Day-by-day cash flow projections.'),

}).describe('Output of the financial predictive forecast or scenario analysis.');

export type PredictiveForecastingOutput = z.infer<typeof PredictiveForecastingOutputSchema>;

// Define the prompt template for Claude.
// This will generate the text that the Firebase Cloud Function sends to Claude.
const predictiveForecastingPrompt = ai.definePrompt({
  name: 'predictiveForecastingPrompt',
  input: { schema: PredictiveForecastingInputSchema },
  output: { schema: PredictiveForecastingOutputSchema }, // Claude will ideally return JSON that matches this.
  prompt: `You are an expert financial analyst AI for CFO-OS. Your task is to provide accurate financial forecasts and scenario analysis based on the provided data. Respond strictly in JSON format matching the PredictiveForecastingOutputSchema. If any input data is missing or invalid for the requested forecastType, generate an errorMessage explaining the issue and set forecastType to 'error'.

{{#if (eq forecastType "predictive-spend")}}
  Generate a 3-month {{scenario}} predictive spend forecast based on the following historical spend data. Ensure projections for at least 6 points in the next 3 months.
  Historical Spend Data (last 6 months, format: Date, Amount):
  {{#each historicalSpendData}}
    - {{this.date}}, {{this.amount}}
  {{/each}}
  Provide a summary of the forecast and day-by-day/monthly projections, including confidence intervals if possible.
{{else if (eq forecastType "pnl-scenario")}}
  Analyze the following P&L scenario for its impact on financials.
  Current Financials:
  - Revenue: {{currentFinancials.revenue}}
  - Costs: {{currentFinancials.costs}}
  - EBITDA: {{currentFinancials.ebitda}}
  - Cash: {{currentFinancials.cash}}

  Scenario Inputs:
  - Revenue Growth: {{scenarioInputs.revenueGrowthPercent}}%
  - Cost Reduction: {{scenarioInputs.costReductionPercent}}%
  - Headcount Change: {{scenarioInputs.headcountChange}}
  - CapEx Change: {{scenarioInputs.capExChange}}

  Calculate the projected P&L impact, cash flow impact, and provide a brief breakeven analysis. Detail the calculated projected revenue, costs, and EBITDA.
{{else if (eq forecastType "cash-flow-forecast")}}
  Generate a day-by-day 30-day cash flow forecast. Assume typical business days for transaction processing unless otherwise specified.
  Current Cash Balance: {{currentCashBalance}}

  Recurring Payments:
  {{#each recurringPayments}}
    - Name: {{this.name}}, Amount: {{this.amount}}, Frequency: {{this.frequency}}, Next Date: {{this.nextDate}}
  {{/each}}

  Vendor Payment Cycles (Vendor, Amount, Avg Days to Pay):
  {{#each vendorPaymentCycles}}
    - {{this.vendor}}, {{this.amount}}, {{this.avgDays}}
  {{/each}}

  Receivables Aging (Customer, Amount, Days Due):
  {{#each receivablesAging}}
    - {{this.customer}}, {{this.amount}}, {{this.daysDue}}
  {{/each]}

  Upcoming Payroll Dates:
  {{#each payrollDates}}
    - {{this}}
  {{/each}}

  Provide a summary and day-by-day cash flow projections including inflows, outflows, and projected balance. Indicate if the balance drops below a predefined cash floor threshold (e.g., consider 0 or a reasonable operating minimum for now unless explicitly provided in contextData as `cashFloorThreshold`).
{{else}}
  Invalid forecast type specified. Please choose 'predictive-spend', 'pnl-scenario', or 'cash-flow-forecast'.
{{/if}}

Ensure the output is a valid JSON object strictly adhering to the PredictiveForecastingOutputSchema structure. The 'details' field can contain additional structured data or assumptions if necessary.
`,
});

const aiDrivenPredictiveForecastingFlow = ai.defineFlow(
  {
    name: 'aiDrivenPredictiveForecastingFlow',
    inputSchema: PredictiveForecastingInputSchema,
    outputSchema: PredictiveForecastingOutputSchema,
  },
  async (input) => {
    try {
      // Use ai.renderPrompt to generate the text message for Claude based on the input.
      const renderedPrompt = await ai.renderPrompt(predictiveForecastingPrompt.name, input);

      const systemPrompt = `You are an expert financial analyst AI for CFO-OS. Provide financial forecasts and scenario analysis strictly in JSON format matching the PredictiveForecastingOutputSchema.`;

      // Call the Firebase Cloud Function with the rendered prompt.
      // The `callClaudeAICloudFunction` is a placeholder for the actual httpsCallable function.
      const result = await callClaudeAICloudFunction({
        prompt: renderedPrompt,
        systemPrompt: systemPrompt,
        maxTokens: 2000, // Adjust max tokens as needed for detailed financial analysis
      });

      const claudeResponseContent = result.data.content;

      // Claude is instructed to return JSON. Parse it.
      const parsedOutput = JSON.parse(claudeResponseContent) as PredictiveForecastingOutput;

      // Validate the parsed output against the schema
      const validationResult = PredictiveForecastingOutputSchema.safeParse(parsedOutput);

      if (!validationResult.success) {
        console.error('Claude output validation failed:', validationResult.error);
        return {
          forecastType: input.forecastType || 'error',
          summary: 'AI response was malformed or did not conform to the expected schema.',
          errorMessage: 'Failed to parse AI output: ' + validationResult.error.message,
        };
      }

      return validationResult.data;

    } catch (error: any) {
      console.error('Error in aiDrivenPredictiveForecastingFlow:', error);
      return {
        forecastType: input.forecastType || 'error',
        summary: 'An error occurred during the forecasting process.',
        errorMessage: error.message || 'Unknown error.',
      };
    }
  }
);

export async function aiDrivenPredictiveForecasting(
  input: PredictiveForecastingInput
): Promise<PredictiveForecastingOutput> {
  return aiDrivenPredictiveForecastingFlow(input);
}
