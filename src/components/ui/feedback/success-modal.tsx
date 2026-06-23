import { Modal } from "../core/modal";
import { Button } from "../core/button";

interface SuccessModalProps {
  open: boolean;
  title: string;
  description: string;
  link: string;
}

export function SuccessModal({ open, onConfirm, title, description }: any) {
  return (
    <Modal open={open}>
      <h3>{title}</h3>
      <p>{description}</p>
      <Button onClick={onConfirm}>Lanjut</Button> // Cuma tombol biasa!
    </Modal>
  );
}