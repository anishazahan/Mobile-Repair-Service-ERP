import { useState } from "react";
import { toast } from "sonner";
import type { TransitionOption } from "@/features/orders/constants";
import {
  useResumeRepair,
  useSendForQualityCheck,
  useStartDiagnosis,
  useStartInspection,
  useStartRepair,
} from "@/features/orders/hooks";
import type { ServiceOrder } from "@/types";
import { ApprovalModal } from "./modals/approval-modal";
import { AwaitingPartsModal } from "./modals/awaiting-parts-modal";
import { CancelOrderModal } from "./modals/cancel-modal";
import { CloseOrderModal } from "./modals/close-order-modal";
import { DeliveryModal } from "./modals/delivery-modal";
import { DiagnosisModal } from "./modals/diagnosis-modal";
import { QualityCheckModal } from "./modals/quality-check-modal";

type ModalState =
  | { kind: "none" }
  | { kind: "diagnosis"; isAdditionalIssue?: boolean }
  | { kind: "approval" }
  | { kind: "awaiting_parts" }
  | { kind: "quality_check" }
  | { kind: "delivery" }
  | { kind: "cancel" }
  | { kind: "close" };

/**
 * Central place that turns a TransitionOption from the status menu / Kanban
 * drag-drop into either an immediate mutation (no extra data needed) or the
 * right confirmation modal. Keeping this in one hook means the order detail
 * page and the Repair Board share identical transition behavior.
 */
export function useOrderActions(order: ServiceOrder) {
  const [modal, setModal] = useState<ModalState>({ kind: "none" });

  const startInspection = useStartInspection(order.id);
  const startDiagnosis = useStartDiagnosis(order.id);
  const startRepair = useStartRepair(order.id);
  const resumeRepair = useResumeRepair(order.id);
  const sendForQc = useSendForQualityCheck(order.id);

  function handleAction(option: TransitionOption) {
    if (!option.modal) {
      switch (option.action) {
        case "start_inspection":
          return startInspection.mutate();
        case "start_diagnosis":
          if (!order.assignedTechnicianId) {
            toast.error("Assign a technician before starting diagnosis.");
            return;
          }
          return startDiagnosis.mutate();
        case "start_repair":
          return startRepair.mutate();
        case "resume_repair":
          return resumeRepair.mutate();
        case "send_for_qc":
          return sendForQc.mutate();
        default:
          return;
      }
    }

    switch (option.modal) {
      case "diagnosis":
        return setModal({ kind: "diagnosis", isAdditionalIssue: option.action === "send_for_approval_again" });
      case "approval":
        return setModal({ kind: "approval" });
      case "awaiting_parts":
        return setModal({ kind: "awaiting_parts" });
      case "quality_check":
        return setModal({ kind: "quality_check" });
      case "delivery":
        return setModal({ kind: "delivery" });
      case "cancel":
        return setModal({ kind: "cancel" });
      case "close":
        return setModal({ kind: "close" });
    }
  }

  const close = () => setModal({ kind: "none" });

  const modals = (
    <>
      <DiagnosisModal
        orderId={order.id}
        open={modal.kind === "diagnosis"}
        onOpenChange={(open) => !open && close()}
        isAdditionalIssue={modal.kind === "diagnosis" ? modal.isAdditionalIssue : undefined}
      />
      <ApprovalModal order={order} open={modal.kind === "approval"} onOpenChange={(open) => !open && close()} />
      <AwaitingPartsModal orderId={order.id} open={modal.kind === "awaiting_parts"} onOpenChange={(open) => !open && close()} />
      <QualityCheckModal orderId={order.id} open={modal.kind === "quality_check"} onOpenChange={(open) => !open && close()} />
      <DeliveryModal order={order} open={modal.kind === "delivery"} onOpenChange={(open) => !open && close()} />
      <CancelOrderModal orderId={order.id} open={modal.kind === "cancel"} onOpenChange={(open) => !open && close()} />
      <CloseOrderModal order={order} open={modal.kind === "close"} onOpenChange={(open) => !open && close()} />
    </>
  );

  return { handleAction, modals };
}
