import { NextRequest, NextResponse } from 'next/server';
import { PlanName, PlanTier, BillingCycle, Subscriber } from '@/types/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Cakto standard webhook payload structure
    const event = body.event || body.type || 'order.approved';
    const customer = body.data?.customer || body.customer || {};
    const product = body.data?.product || body.product || {};
    const subscription = body.data?.subscription || body.subscription || {};

    const name = customer.name || 'Cliente Cakto';
    const email = customer.email || 'cliente@email.com';
    const phone = customer.phone || customer.mobile || '41999998888';
    const price = Number(product.price || body.data?.amount || 27.00);

    // Identify plan tier and cycle based on price or product name
    const productName = (product.name || '').toLowerCase();
    let planTier: PlanTier = 'individual';
    let planName: PlanName = 'Individual Mensal';
    let planPrice = 27.00;
    let billingCycle: BillingCycle = 'monthly';
    let maxMembers = 1;

    if (productName.includes('família') || productName.includes('familia') || price === 67 || price === 147 || price === 227) {
      planTier = 'family';
      maxMembers = 4;
      if (price >= 200 || productName.includes('anual')) {
        planName = 'Família Anual';
        planPrice = 227.00;
        billingCycle = 'annual';
      } else if (price >= 100 || productName.includes('trimestral')) {
        planName = 'Família Trimestral';
        planPrice = 147.00;
        billingCycle = 'quarterly';
      } else {
        planName = 'Família Mensal';
        planPrice = 67.00;
        billingCycle = 'monthly';
      }
    } else {
      // Individual tier
      planTier = 'individual';
      maxMembers = 1;
      if (price >= 180 || productName.includes('anual')) {
        planName = 'Individual Anual';
        planPrice = 197.00;
        billingCycle = 'annual';
      } else if (price >= 50 || productName.includes('trimestral')) {
        planName = 'Individual Trimestral';
        planPrice = 67.00;
        billingCycle = 'quarterly';
      } else {
        planName = 'Individual Mensal';
        planPrice = 27.00;
        billingCycle = 'monthly';
      }
    }

    // Determine status
    let status: Subscriber['status'] = 'active';
    if (event.includes('refund') || event.includes('cancel') || event.includes('chargeback')) {
      status = 'cancelled';
    } else if (event.includes('waiting') || event.includes('pending')) {
      status = 'pending';
    }

    const newSubscriber: Subscriber = {
      id: `cakto-${body.data?.order_id || Date.now()}`,
      name,
      email,
      phone,
      city: customer.address?.city || 'Brasil',
      state: customer.address?.state || 'BR',
      planTier,
      planName,
      planPrice,
      billingCycle,
      maxMembers,
      activeMembersCount: 1,
      startDate: new Date().toLocaleDateString('pt-BR'),
      nextBillingDate: billingCycle === 'annual' ? 'Em 1 ano' : billingCycle === 'quarterly' ? 'Em 3 meses' : 'Em 1 mês',
      status,
      isOnline: true,
      gateway: 'cakto',
    };

    console.log(`[Cakto Webhook] Assinante processado com sucesso:`, newSubscriber.name, newSubscriber.planName, status);

    return NextResponse.json({
      success: true,
      message: 'Assinatura processada com sucesso no LIST.ME',
      subscriber: newSubscriber,
    });
  } catch (err: any) {
    console.error('[Cakto Webhook Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Erro ao processar webhook da Cakto' },
      { status: 400 }
    );
  }
}
