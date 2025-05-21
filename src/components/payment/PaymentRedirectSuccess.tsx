
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { CardcomPayload, CardcomVerifyResponse, CardcomWebhookPayload } from '@/types/payment';

interface PaymentRedirectSuccessProps {
  paymentDetails: CardcomVerifyResponse | CardcomPayload | CardcomWebhookPayload | null;
}

export const PaymentRedirectSuccess: React.FC<PaymentRedirectSuccessProps> = ({ paymentDetails }) => {
  const navigate = useNavigate();

  const transactionId = React.useMemo(() => {
    if (!paymentDetails) return null;
    if ('TranzactionId' in paymentDetails && paymentDetails.TranzactionId) {
      return paymentDetails.TranzactionId;
    }
    if ('paymentDetails' in paymentDetails && paymentDetails.paymentDetails?.transactionId) {
      return paymentDetails.paymentDetails.transactionId;
    }
    return null;
  }, [paymentDetails]);

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>התשלום התקבל בהצלחה!</CardTitle>
          <CardDescription>תודה על הצטרפותך</CardDescription>
        </CardHeader>
        <CardContent>
          <p>פרטי העסקה נשמרו במערכת.</p>
          {transactionId && (
            <div className="mt-2 text-sm text-muted-foreground">
              <p>מזהה עסקה: {transactionId}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            המשך לדף הבית
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
