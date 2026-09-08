export type SubscriptionStatus = 'active' | 'pending' | 'cancelled' | 'trial';
export type BillingCycle = 'monthly' | 'quarterly' | 'annual';
export type PlanTier = 'individual' | 'family';

export type PlanName =
  | 'Individual Mensal'
  | 'Individual Trimestral'
  | 'Individual Anual'
  | 'Família Mensal'
  | 'Família Trimestral'
  | 'Família Anual';

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  planTier: PlanTier;
  planName: PlanName;
  planPrice: number;
  billingCycle: BillingCycle;
  maxMembers: number; // 1 for individual, 4 for family
  activeMembersCount?: number;
  startDate: string;
  nextBillingDate: string;
  status: SubscriptionStatus;
  isOnline: boolean;
  cancelReason?: string;
  gateway?: 'cakto' | 'manual' | 'stripe';
}

export interface AdminMetrics {
  onlineUsersCount: number;
  activeSubscribersCount: number;
  individualSubscribersCount: number;
  familySubscribersCount: number;
  pendingRenewalsCount: number;
  cancelledCount: number;
  mrr: number; // Monthly Recurring Revenue
  churnRate: number; // Percentage
  totalRevenueYTD: number;
}
