import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

/**
 * Hook to validate email and phone uniqueness in real-time against Supabase
 */
export function useUniqueUserValidation(email: string, phone: string) {
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) { setEmailError(null); return; }
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      setEmailError(data ? 'כתובת מייל כבר רשומה במערכת' : null);
    }, 500);
    return () => clearTimeout(timer);
  }, [email]);

  useEffect(() => {
    if (!phone) { setPhoneError(null); return; }
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .maybeSingle();
      setPhoneError(data ? 'מספר טלפון כבר רשום במערכת' : null);
    }, 500);
    return () => clearTimeout(timer);
  }, [phone]);

  return {
    emailError,
    phoneError,
    isValid: !emailError && !phoneError,
  };
}
