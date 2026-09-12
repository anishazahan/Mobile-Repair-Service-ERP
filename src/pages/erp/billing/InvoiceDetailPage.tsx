import { Banknote, ChevronRight, User as UserIcon, Wrench } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { InvoiceStatusBadge } from "@/components/feedback/status-badge";
import { RecordPaymentDialog } from "@/features/billing/components/record-payment-dialog";
import { useInvoice } from "@/features/billing/hooks";
import { formatCurrency, formatDate, formatDateTime, humanizeStatus } from "@/lib/utils";

export function InvoiceDetailPage() {
  const { id = "" } = useParams();
  const { data, isLoading, isError, refetch } = useInvoice(id);
  const [payOpen, setPayOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} description="We couldn't load this invoice." />;
  }

  const { invoice, customer, order, payments, balanceDue } = data;
  const canRecordPayment = balanceDue > 0 && invoice.status !== "refunded";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/app/billing" className="hover:text-foreground">
              Billing
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{invoice.id}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{invoice.id}</h1>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">Issued {formatDateTime(invoice.issuedAt)}</p>
        </div>
        {canRecordPayment && (
          <Button size="sm" onClick={() => setPayOpen(true)}>
            <Banknote /> Record Payment
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                      <th className="px-4 py-2.5 font-medium">Description</th>
                      <th className="px-4 py-2.5 font-medium">Qty</th>
                      <th className="px-4 py-2.5 font-medium">Unit Price</th>
                      <th className="px-4 py-2.5 font-medium">Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lineItems.map((line, i) => (
                      <tr key={i} className="border-b border-border/60 last:border-0">
                        <td className="px-4 py-3 text-foreground">{line.description}</td>
                        <td className="px-4 py-3 text-muted-foreground">{line.quantity}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatCurrency(line.unitPrice)}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatCurrency(line.unitPrice * line.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="ml-auto mt-4 max-w-xs space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-foreground">-{formatCurrency(invoice.discount)}</span>
                  </div>
                )}
                {invoice.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">{formatCurrency(invoice.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-1.5 font-medium">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{formatCurrency(invoice.total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Amount Paid</span>
                  <span>{formatCurrency(invoice.amountPaid)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1.5 font-medium">
                  <span className="text-foreground">Balance Due</span>
                  <span className={balanceDue > 0 ? "text-warning" : "text-success"}>
                    {formatCurrency(balanceDue)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment History ({payments.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {payments.length === 0 ? (
                <EmptyState icon={Banknote} title="No payments recorded yet" className="py-8" />
              ) : (
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full min-w-[480px] text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                        <th className="px-4 py-2.5 font-medium">Amount</th>
                        <th className="px-4 py-2.5 font-medium">Method</th>
                        <th className="px-4 py-2.5 font-medium">Recorded By</th>
                        <th className="px-4 py-2.5 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-b border-border/60 last:border-0">
                          <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(payment.amount)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{humanizeStatus(payment.method)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{payment.recordedBy}</td>
                          <td className="px-4 py-3 text-muted-foreground">{formatDateTime(payment.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {customer ? (
                <Link to={`/app/customers/${customer.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{customer.name}</span>
                    <span className="block text-xs text-muted-foreground">{customer.phone}</span>
                  </span>
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">Unknown customer</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Order</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {order ? (
                <Link to={`/app/orders/${order.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Wrench className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{order.id}</span>
                    <span className="block text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
                  </span>
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">Unknown order</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <RecordPaymentDialog open={payOpen} onOpenChange={setPayOpen} invoiceId={invoice.id} balanceDue={balanceDue} />
    </div>
  );
}
