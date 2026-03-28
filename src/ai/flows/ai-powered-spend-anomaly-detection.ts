'use server';
/**
 * @fileOverview This file implements a Genkit flow for AI-powered spend anomaly detection.
 * It takes transaction data and optional contextual information, and uses an AI model
 * to identify suspicious transactions, provide explanations, and suggest corrective actions.
 *
 * - detectSpendAnomaly - A function that handles the spend anomaly detection process.
 * - AnomalyDetectionInput - The input type for the detectSpendAnomaly function.
 * - AnomalyDetectionOutput - The return type for the detectSpendAnomaly function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for transaction details
const TransactionSchema = z.object({
  id: z.string().describe('Unique transaction identifier.'),
  employeeId: z.string().describe('ID of the employee who made the transaction.'),
  employeeName: z.string().describe('Name of the employee.'),
  department: z.string().describe('Department of the employee (e.g., Engineering, Sales, HR).'),
  category: z.string().describe('Category of the expense (e.g., Travel, SaaS, Meals).'),
  vendor: z.string().describe('Vendor where the transaction occurred.'),
  amount: z.number().describe('Amount of the transaction.'),
  currency: z.string().describe('Currency of the transaction (e.g., INR).'),
  date: z.string().describe('Date and time of the transaction in ISO format (e.g., 2023-10-27T10:30:00Z).'),
  paymentMethod: z.string().describe('Method of payment (e.g., corporate card).'),
  status: z.enum(['approved', 'pending', 'flagged']).describe('Status of the transaction.'),
  zaggleCardId: z.string().optional().describe('Zaggle corporate card ID, if applicable.'),
  mcc_code: z.string().optional().describe('Merchant Category Code.'),
  location: z.string().optional().describe('Location where the transaction occurred.'),
  receiptUrl: z.string().optional().describe('URL to the transaction receipt.'),
});

// Schema for policy rules
const PolicyRuleSchema = z.object({
  name: z.string().describe('Name of the policy.'),
  rule: z.string().describe('Description of the rule (e.g., "Meals > ₹2000 requires approval").'),
  threshold: z.number().optional().describe('Numeric threshold for the policy, if applicable.'),
  action: z.string().describe('Action to take if policy is violated (e.g., flag, block, notify).'),
  departments: z.array(z.string()).optional().describe('Departments to which this policy applies.'),
  active: z.boolean().describe('Whether the policy is active.'),
});

const AnomalyDetectionInputSchema = z.object({
  currentTransaction: TransactionSchema.describe('The transaction to be analyzed for anomalies.'),
  recentTransactions: z.array(TransactionSchema).optional().describe('A list of recent transactions for contextual anomaly detection (e.g., duplicates, spending patterns).').default([]),
  activePolicies: z.array(PolicyRuleSchema).optional().describe('A list of active spend policies relevant to the current transaction.').default([]),
  departmentMCCContext: z.record(z.string(), z.array(z.string())).optional().describe('A mapping of department to typical MCC codes for identifying unusual MCCs.').default({}),
});
export type AnomalyDetectionInput = z.infer<typeof AnomalyDetectionInputSchema>;

const AnomalyDetectionOutputSchema = z.object({
  isAnomaly: z.boolean().describe('True if the transaction is detected as an anomaly, false otherwise.'),
  anomalyType: z.string().optional().describe('The type of anomaly detected (e.g., "Duplicate Transaction", "Round Number Fraud Signal", "Off-Hours Transaction", "Policy Violation", "Unusual MCC Code", "Unapproved Vendor", "Other").').nullable(),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low', 'None']).describe('The severity level of the detected anomaly.'),
  explanation: z.string().describe('A detailed explanation of why the transaction is considered suspicious.'),
  recommendedActions: z.array(z.string()).describe('A list of recommended actions to investigate or resolve the anomaly.'),
});
export type AnomalyDetectionOutput = z.infer<typeof AnomalyDetectionOutputSchema>;

export async function detectSpendAnomaly(input: AnomalyDetectionInput): Promise<AnomalyDetectionOutput> {
  return anomalyDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spendAnomalyDetectionPrompt',
  input: { schema: AnomalyDetectionInputSchema },
  output: { schema: AnomalyDetectionOutputSchema },
  prompt: `You are an expert financial forensic AI assistant specializing in detecting unusual or potentially fraudulent spend transactions for a CFO-OS.
Your task is to analyze a given transaction, along with recent transaction history and active spend policies, to identify any anomalies.
If an anomaly is detected, you must provide a clear explanation of why it is suspicious, its severity, and concrete recommended actions.

Consider the following anomaly types:
-   **Duplicate transactions**: Same vendor, similar amount, close date/time (e.g., within 48 hours) from the same employee.
-   **Round-number fraud signals**: Transaction amounts that are exact round numbers (e.g., ₹5000, ₹10000) that deviate significantly from typical spending patterns for that category/vendor/employee.
-   **Off-hours transactions**: Transactions occurring on weekends or late at night (e.g., 9 PM to 6 AM local time).
-   **Vendor not in approved list**: Transaction with a vendor that is typically not used or approved for the given department or category.
-   **Transactions exceeding policy limits**: Transaction amount exceeds a defined policy threshold for a given category or department.
-   **Unusual MCC code for department**: The Merchant Category Code (MCC) is inconsistent with the expected activities of the employee's department.

Use the provided 'currentTransaction', 'recentTransactions', 'activePolicies', and 'departmentMCCContext' to make your assessment.

Current Transaction:
Id: {{{currentTransaction.id}}}
Employee: {{{currentTransaction.employeeName}}} (ID: {{{currentTransaction.employeeId}}})
Department: {{{currentTransaction.department}}}
Category: {{{currentTransaction.category}}}
Vendor: {{{currentTransaction.vendor}}}
Amount: {{{currentTransaction.amount}}} {{{currentTransaction.currency}}}
Date: {{{currentTransaction.date}}}
Payment Method: {{{currentTransaction.paymentMethod}}}
MCC Code: {{{currentTransaction.mcc_code}}}
Location: {{{currentTransaction.location}}}

Recent Transactions (for context, if available):
{{#if recentTransactions}}
{{#each recentTransactions}}
- Id: {{this.id}}, Employee: {{this.employeeName}}, Department: {{this.department}}, Category: {{this.category}}, Vendor: {{this.vendor}}, Amount: {{this.amount}} {{this.currency}}, Date: {{this.date}}
{{/each}}
{{else}}
No recent transactions provided.
{{/if}}

Active Policies (for context, if available):
{{#if activePolicies}}
{{#each activePolicies}}
- Name: {{this.name}}, Rule: {{this.rule}}, Action: {{this.action}}, Departments: {{#each this.departments}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}, Active: {{this.active}}
{{/each}}
{{else}}
No active policies provided.
{{/if}}

Department MCC Context (for unusual MCC code detection, if available):
{{#if departmentMCCContext}}
{{#each departmentMCCContext}}
- Department: {{@key}}, Typical MCCs: {{#each this}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
{{/each}}
{{else}}
No department MCC context provided.
{{/if}}

Based on the above information, determine if the 'currentTransaction' is an anomaly.
If it is an anomaly, set 'isAnomaly' to true, specify the 'anomalyType', 'severity', a detailed 'explanation' and 'recommendedActions'.
If it is not an anomaly, set 'isAnomaly' to false, 'anomalyType' to null, 'severity' to 'None', and provide a brief 'explanation' stating no anomaly was found and 'recommendedActions' as an empty array.
`
});

const anomalyDetectionFlow = ai.defineFlow(
  {
    name: 'anomalyDetectionFlow',
    inputSchema: AnomalyDetectionInputSchema,
    outputSchema: AnomalyDetectionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
