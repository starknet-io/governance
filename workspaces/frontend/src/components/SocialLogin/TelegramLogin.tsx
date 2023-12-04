import { TLoginButton, TLoginButtonSize } from "react-telegram-auth";

export const TelegramLogin = () => {
  return (
    <TLoginButton
      botName="MyHeckingBot"
      buttonSize={TLoginButtonSize.Large}
      lang="en"
      usePic={false}
      cornerRadius={20}
      onAuthCallback={(user) => {
        alert('Telegram logged in. Check for console logs')
        console.log('telegram user', user);
      }}
      requestAccess={"write"}
      // additionalClasses={"css-class-for-wrapper"}
    />
  );
};
