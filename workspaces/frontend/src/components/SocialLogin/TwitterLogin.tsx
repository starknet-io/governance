import { Suspense, lazy, useCallback, useState } from "react";
// import { LoginSocialTwitter } from "./LoginSocialTwitterLib";
import { User } from "./User"; // component display user (see detail on /example directory)
import { Button } from "@yukilabs/governance-components";
import { useMount } from "react-use";
const LoginSocialTwitterLazy = lazy(() => import("./LoginSocialTwitterLib"));

// REDIRECT URL must be same with URL where the (reactjs-social-login) components is located
// MAKE SURE the (reactjs-social-login) components aren't unmounted or destroyed before the ask permission dialog closes

// const CLIENT_ID = import.meta.env.VITE_APP_TW_CLIENT_ID ?? "";
const CLIENT_ID = "Qm1hbVR4MVRuN25mVVh4ZDNOaUE6MTpjaQ";
console.log("CLIENT_ID", CLIENT_ID);

const TwitterLogin = () => {
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState<any>();
  const [showTwitter, setShowTwitter] = useState(false);
  useMount(() => {
    setShowTwitter(true);
  });

  const onLoginStart = useCallback(() => {
    alert("login start");
  }, []);

  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider("");
    alert("logout success");
  }, []);

  return (
    <>
      {provider && profile ? (
        <User
          provider={provider}
          profile={profile}
          onLogout={onLogoutSuccess}
        />
      ) : (
        <div className={`App ${provider && profile ? "hide" : ""}`}>
          {showTwitter && (
            <Suspense fallback={<div>Loading...</div>}>
              <LoginSocialTwitterLazy
                isOnlyGetToken
                client_id={CLIENT_ID || ""}
                onLoginStart={onLoginStart}
                onResolve={({ provider, data }) => {
                  alert("login success");
                  setProvider(provider);
                  setProfile(data);
                }}
                onReject={(err: any) => {
                  console.log(err);
                }}
              >
                <Button
                  bg="#14171A;"
                  leftIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M11.5849 8.85148L17.7895 2.5H16.3192L10.9318 8.0149L6.6289 2.5H1.66602L8.17285 10.8395L1.66602 17.5H3.13638L8.82561 11.6761L13.3698 17.5H18.3327L11.5846 8.85148H11.5849ZM9.57109 10.913L8.91181 10.0825L3.66617 3.47476H5.92456L10.1578 8.80746L10.8171 9.63788L16.3199 16.5696H14.0615L9.57109 10.9133V10.913Z"
                        fill="#FBFBFB"
                      />
                    </svg>
                  }
                >
                  X (Twitter) connect
                </Button>
              </LoginSocialTwitterLazy>
            </Suspense>
          )}
        </div>
      )}
    </>
  );
};

export default TwitterLogin;
