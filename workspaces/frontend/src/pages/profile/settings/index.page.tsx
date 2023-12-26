import React from "react";
import { DocumentProps } from "../../../renderer/types";

export function Page() {
  return <div>Settings</div>;
}

export const documentProps = {
  title: "Profile Settings",
} satisfies DocumentProps;
