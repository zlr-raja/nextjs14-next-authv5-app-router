"use client"

import {newVerification} from "@/actions/new-verification";
import {CardWrapper} from "@/components/auth/CardWrapper";
import {FormError} from "@/components/form-messages/FormError";
import {FormSuccess} from "@/components/form-messages/FormSuccess";
import {useSearchParams} from "next/navigation";
import {useCallback, useEffect, useRef, useState} from "react";
import {BeatLoader} from "react-spinners";

export function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const verificationRequested = useRef(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (verificationRequested.current || success || error) return;
    verificationRequested.current = true;

    if (!token) {
      setError("Invalid token!")
      return;
    }

    newVerification(token).then((data) => {
      setSuccess(data.success);
      setError(data.error);
      verificationRequested.current = false;
    }).catch(() => {
      setError("Something went wrong while verifying token!");
      verificationRequested.current = false;
    })

  }, [token, success, error])

  useEffect(() => {
    onSubmit();
  })

  return (
    <CardWrapper headerLabel="Confirming your verification" backButtonLabel="Back to login" backButtonHref="/login">
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader/>}
        <FormSuccess message={success}/>
        <FormError message={error}/>
      </div>
    </CardWrapper>
  )
}