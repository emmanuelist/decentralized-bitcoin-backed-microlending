import { useState } from 'react';
import { createLoan } from '../../../lib/stacks/loans';
import { userSession } from '../../../lib/auth';
import { LoanFormData } from './types';

export function useLoanForm() {
  const [formData, setFormData] = useState<LoanFormData>({
    amount: '',
    collateralAmount: '',
    collateralAsset: '',
    duration: '',
    interestRate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSession.isUserSignedIn()) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await createLoan(
        Number(formData.amount),
        Number(formData.collateralAmount),
        Number(formData.duration),
        Number(formData.interestRate)
      );
      console.log('Loan creation transaction:', response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create loan');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    error,
    handleSubmit,
  };
}