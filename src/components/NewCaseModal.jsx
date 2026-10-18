import React from 'react';
import CaseFormModal from './CaseFormModal';

export default function NewCaseModal({ isOpen, onClose, onCreateCase, existingCases = [] }) {
  return (
    <CaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onCreateCase}
      existingCases={existingCases}
      initialCase={null}
    />
  );
}
