import { useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";
import { SocialButton } from "./SocialButton";

const TelegramLogin = ({ delegateId }: { delegateId: string }) => {
  const telegramButtonContainerRef = useRef(null);
  const verifyTelegram = trpc.socials.verifyTelegram.useMutation();
  const [state, setState] = useState<"loading" | "error">("");

  useEffect(() => {
    // Function to load the Telegram script
    const loadTelegramScript = () => {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?7";
      script.setAttribute("data-telegram-login", "governance_telegram_bot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-auth-url", "http://127.0.0.1:3000");
      script.setAttribute("data-request-access", "write");
      script.async = true;

      telegramButtonContainerRef?.current?.appendChild(script);
    };

    loadTelegramScript();
  }, []);

  const handleTelegramLoginClick = () => {
    // Try to find the Telegram button
    setState("loading");
    if (typeof window !== "undefined") {
      console.log(window.Telegram);
      window.Telegram.Login.auth(
        { bot_id: "6886835694", request_access: true },
        (data) => {
          if (!data) {
            // authorization failed
          }
          verifyTelegram.mutateAsync(
            {
              delegateId,
              telegramData: data,
            },
            {
              onSuccess: () => {
                console.log("SUCCESS");
                setState("");
              },
              onError: () => {
                console.log("ERROR");
                setState("error");
              },
            },
          );
          console.log(data);
        },
      );
    }
  };

  return (
    <div>
      <SocialButton
        onConnect={handleTelegramLoginClick}
        provider="telegram"
        isError={state === "error"}
        isLoading={state === "loading"}
      />
      <div ref={telegramButtonContainerRef} style={{ display: "none" }}></div>
    </div>
  );
};

export default TelegramLogin;
