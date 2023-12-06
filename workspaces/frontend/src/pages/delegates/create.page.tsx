import { Heading } from "@yukilabs/governance-components";
import { DocumentProps } from "src/renderer/types";
import DelegateForm from "../../components/DelegateForm";
import { FormLayout } from "src/components/FormsCommon/FormLayout";
import React from "react";
import { TelegramLogin } from "src/components/SocialLogin/TelegramLogin";
const TwitterLoginLazy = React.lazy(() => import("src/components/SocialLogin/TwitterLogin"));

export function Page() {
  const [showTwitterLogin, setShowTwitterLogin] = React.useState(false);
  React.useEffect(() => {
    setShowTwitterLogin(true);
  }, []);

  return (
    <FormLayout>
      <Heading variant="h2" mb="24px">
        Create delegate profile
      </Heading>
      <DelegateForm mode="create" />
    </FormLayout>
  );
}

export const documentProps = {
  title: "Delegates / Create",
  image: "/social/social-delegates.png",
} satisfies DocumentProps;
