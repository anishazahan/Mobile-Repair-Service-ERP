import { useAuthStore } from "@/features/auth/store";
import { db, genId } from "@/mocks/db";
import { MockApiError, simulateRequest } from "@/mocks/server";
import type { Customer, Invoice, Payment, PaymentMethod, ServiceOrder } from "@/types";

export interface InvoiceFilters {
  search?: string;
  status?: Invoice["status"] | "all";
}

export interface InvoiceRow {
  invoice: Invoice;
  customer?: Customer;
  order?: ServiceOrder;
  balanceDue: number;
}

function findInvoice(id: string): Invoice {
  const invoice = db.invoices.find((i) => i.id === id);
  if (!invoice) throw new MockApiError(`Invoice ${id} was not found.`);
  return invoice;
}

function enrichInvoice(invoice: Invoice): InvoiceRow {
  const customer = db.customers.find((c) => c.id === invoice.customerId);
  const order = db.serviceOrders.find((o) => o.id === invoice.orderId);
  return { invoice, customer, order, balanceDue: invoice.total - invoice.amountPaid };
}

export async function getInvoiceRows(filters?: InvoiceFilters): Promise<InvoiceRow[]> {
  return simulateRequest(() => {
    let list = [...db.invoices];

    if (filters?.status && filters.status !== "all") {
      list = list.filter((i) => i.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((i) => {
        const customer = db.customers.find((c) => c.id === i.customerId);
        return (
          i.id.toLowerCase().includes(q) ||
          i.orderId.toLowerCase().includes(q) ||
          customer?.name.toLowerCase().includes(q)
        );
      });
    }

    return list.map(enrichInvoice).sort((a, b) => (a.invoice.issuedAt < b.invoice.issuedAt ? 1 : -1));
  });
}

export interface InvoiceDetail {
  invoice: Invoice;
  customer?: Customer;
  order?: ServiceOrder;
  payments: Payment[];
  balanceDue: number;
}

export async function getInvoice(id: string): Promise<InvoiceDetail> {
  return simulateRequest(() => {
    const invoice = findInvoice(id);
    const customer = db.customers.find((c) => c.id === invoice.customerId);
    const order = db.serviceOrders.find((o) => o.id === invoice.orderId);
    const payments = db.payments
      .filter((p) => p.invoiceId === id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return { invoice, customer, order, payments, balanceDue: invoice.total - invoice.amountPaid };
  });
}

export interface RecordPaymentInput {
  amount: number;
  method: PaymentMethod;
}

export async function recordPayment(invoiceId: string, input: RecordPaymentInput): Promise<Payment> {
  return simulateRequest(() => {
    const invoice = findInvoice(invoiceId);
    const balanceDue = invoice.total - invoice.amountPaid;
    if (input.amount > balanceDue) {
      throw new MockApiError(`Payment can't exceed the balance due.`);
    }
    const payment: Payment = {
      id: genId("PAY"),
      invoiceId,
      amount: input.amount,
      method: input.method,
      recordedBy: useAuthStore.getState().user?.name ?? "System",
      createdAt: new Date().toISOString(),
    };
    db.payments.unshift(payment);
    invoice.amountPaid += input.amount;
    invoice.status = invoice.amountPaid >= invoice.total ? "paid" : "partially_paid";
    return payment;
  });
}
