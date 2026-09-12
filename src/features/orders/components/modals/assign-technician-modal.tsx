import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAssignTechnician } from "@/features/orders/hooks";
import { db } from "@/mocks/db";

export function AssignTechnicianModal({
  orderId,
  currentTechnicianId,
  open,
  onOpenChange,
}: {
  orderId: string;
  currentTechnicianId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [technicianId, setTechnicianId] = useState(currentTechnicianId ?? "");
  const [reason, setReason] = useState("");
  const mutation = useAssignTechnician(orderId);
  const isReassign = Boolean(currentTechnicianId);

  const technicians = db.technicians
    .filter((t) => t.status === "active")
    .map((t) => ({
      ...t,
      activeJobs: db.serviceOrders.filter((o) => o.assignedTechnicianId === t.id && !["CLOSED", "CANCELLED"].includes(o.status)).length,
    }));

  async function handleAssign() {
    if (!technicianId) return;
    await mutation.mutateAsync({ technicianId, reason: isReassign ? reason || undefined : undefined });
    onOpenChange(false);
    setReason("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isReassign ? "Reassign Technician" : "Assign Technician"}</DialogTitle>
          <DialogDescription>Workload shown reflects each technician's current active jobs.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {technicians.map((tech) => (
            <label
              key={tech.id}
              className={`flex cursor-pointer items-center justify-between rounded-md border p-3 text-sm transition-colors ${
                technicianId === tech.id ? "border-primary bg-primary/5" : "border-input hover:bg-accent"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="technician"
                  className="h-4 w-4 accent-primary"
                  checked={technicianId === tech.id}
                  onChange={() => setTechnicianId(tech.id)}
                />
                <span className="font-medium text-foreground">{tech.name}</span>
              </span>
              <span className="text-xs text-muted-foreground">{tech.activeJobs} active jobs</span>
            </label>
          ))}
        </div>

        {isReassign && (
          <div className="space-y-1.5">
            <Label htmlFor="reassign-reason">Reason for reassignment (optional)</Label>
            <Input
              id="reassign-reason"
              placeholder="e.g. Specialist needed, workload rebalance"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={!technicianId || mutation.isPending} onClick={handleAssign}>
            {isReassign ? "Reassign" : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
