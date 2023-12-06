import { Modal } from "../Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

// const choices: {
//   [index: number]: string;
// } = {
//   1: "For",
//   2: "Against",
//   3: "Abstain",
// };

export const VoteModal = ({ children, isOpen = false, onClose }: Props) => {
  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      title="Confirm Vote"
    >
      {children}
    </Modal>
  );
};
