import React from 'react';
import { TinyBloomPhilosophyModal } from './TinyBloomPhilosophyModal';

export interface HeartfeltModalProps {
  isOpen: boolean;
  onClose: () => void;
  babyName?: string;
}

export const HeartfeltModal: React.FC<HeartfeltModalProps> = (props) => {
  return <TinyBloomPhilosophyModal {...props} />;
};

export { TinyBloomPhilosophyModal };
