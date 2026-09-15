export interface PlanSummary {
  id: string;
  name: string;
  tier: "FREE" | "VIP";
  price: string; 
  durationDays: number;
}