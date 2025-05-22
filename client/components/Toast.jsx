"use client";

import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useGlobals } from "@/contexts/Globals";

export default function Toast({
  description = "",
  action = "close",
  variant = "outline",
}) {
  const { toast } = useToast();
  const { toastRef, toastMessage, setToastMessage } = useGlobals();
  const handler = () => {
    setToastMessage("");
  };

  return (
    <Button
      ref={toastRef}
      variant={variant}
      onClick={() => {
        toast({
          title: toastMessage,
          description: description,
          action: (
            <ToastAction altText="Try again" onClick={handler}>
              {action}
            </ToastAction>
          ),
        });
      }}
    >
      Show Toast
    </Button>
  );
}

// responsive
