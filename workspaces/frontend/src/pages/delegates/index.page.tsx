import { ContentContainer } from "@yukilabs/governance-components";
import { Delegates } from "src/components/Delegates";
import { DocumentProps } from "src/renderer/types";

export const Page = () => {
  return (
    <ContentContainer maxWidth="1240px">
      <Delegates />
    </ContentContainer>
  );
};

export const documentProps = {
  title: "Delegates",
} satisfies DocumentProps;
