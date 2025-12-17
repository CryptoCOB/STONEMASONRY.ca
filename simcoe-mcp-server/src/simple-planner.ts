/**
 * Simple Test Business Planner Agent (No VoxSigil)
 */

export class SimpleBusinessPlannerAgent {
  async createPlan(objective: string, constraints?: string[]) {
    console.log('🧪 Simple planner called with:', { objective, constraints });
    
    return {
      plan: `Simple business plan for: ${objective}`,
      constraints: constraints || [],
      timestamp: new Date().toISOString(),
      agentType: 'simple_planner'
    };
  }
}

export const simplePlannerAgent = new SimpleBusinessPlannerAgent();
