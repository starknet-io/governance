import { useEffect, useRef } from "react";
import { trpc } from "../../utils/trpc";

const TelegramLogin = ({ delegateId }: { delegateId: string }) => {
  const telegramButtonContainerRef = useRef(null);
  const verifyTelegram = trpc.socials.verifyTelegram.useMutation();

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
              },
              onError: () => {
                console.log("ERROR");
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
      <div onClick={handleTelegramLoginClick}>My Telegram Bot Here</div>
      <div ref={telegramButtonContainerRef} style={{ display: "none" }}></div>
    </div>
  );
};

export default TelegramLogin;
