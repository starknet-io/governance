import { useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";
import { SocialButton } from "./SocialButton";

const TelegramLogin = ({
  username,
  delegateId,
  onDisconnect,
}: {
  username: string | null | undefined;
  delegateId: string;
  onDisconnect: () => void;
}) => {
  const telegramButtonContainerRef = useRef(null);
  const verifyTelegram = trpc.socials.verifyTelegram.useMutation();
  const [state, setState] = useState<"loading" | "error" | null>(null);

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
      window.Telegram.Login.auth(
        { bot_id: import.meta.env.VITE_APP_TELEGRAM_BOT_KEY, request_access: true },
        (data) => {
          if (!data) {
            setState(null);
          }
          verifyTelegram.mutateAsync(
            {
              delegateId,
              telegramData: data,
            },
            {
              onSuccess: () => {
                setState(null);
              },
              onError: () => {
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
        onDisconnect={onDisconnect}
        username={username}
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
