// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// import {
//   DynamicContextProvider,
//   DynamicWidget,
//   UserProfile,
//   Wallet,
//   WalletConnector,
//   useDynamicContext,
// } from "@dynamic-labs/sdk-react";

// import { useEffect, useRef, useState } from "react";
// import { IUser, PageContext, ROLES } from "./types";
// import { trpc } from "src/utils/trpc";
// import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
// import React, { useCallback } from "react";
// import { HelpMessageProvider, useHelpMessage } from "src/hooks/HelpMessage";
// import { hasPermission } from "src/utils/helpers";
// import { usePageContext } from "./PageContextProvider";
// import AuthorizedUserView from "./AuthorizedUserView";
// import TallyScript from "src/components/TallyScript";
// import { cssOverrides } from "src/components/style/overrides";
// import { NavigationMenu } from "src/components/Navigation";
// import { LayoutDefault } from "src/pages/Layout/LayoutDefault";

// interface AuthSuccessParams {
//   authToken: string;
//   handleLogOut: () => Promise<void>;
//   isAuthenticated: boolean;
//   primaryWallet: Wallet | null;
//   user: UserProfile;
//   walletConnector: WalletConnector | undefined;
// }

// export function DynamicContextProviderPage(props: Props) {
//   const { pageContext, children } = props;
//   const [authUser, setAuthUser] = useState<AuthSuccessParams | null>(null);
//   const authMutation = trpc.auth.authUser.useMutation();
//   const logoutMutation = trpc.auth.logout.useMutation();
//   const hasCalledAuthenticateUser = useRef(false); // To guard against continuous calls
//   const [modalOpen, setModalOpen] = useState(false);
//   const editUserProfile = trpc.users.editUserProfileByAddress.useMutation();
//   const utils = trpc.useContext();

//   const authenticateUser = useCallback(
//     async (params: AuthSuccessParams) => {
//       if (params?.user?.newUser) {
//         setModalOpen(true);
//       }
//       await authMutation.mutateAsync({
//         authToken: params.authToken,
//         ensName: params.user.ens?.name,
//         ensAvatar: params.user.ens?.avatar,
//       });
//       utils.auth.currentUser.invalidate();
//     },
//     [authMutation],
//   );

//   useEffect(() => {
//     if (authUser && !hasCalledAuthenticateUser.current) {
//       authenticateUser(authUser);
//       hasCalledAuthenticateUser.current = true; // Mark as called
//     } else if (!authUser) {
//       hasCalledAuthenticateUser.current = false; // Reset for next time
//     }
//   }, [authUser, authenticateUser]);

//   const handleModalClose = () => {
//     setModalOpen(false);
//   };
//   const [username, setUsername] = useState("");
//   const [starknetAddress, setStarknetAddress] = useState("");

//   const isFormValid = !!(username && starknetAddress);

//   const onSubmit = () => {
//     editUserProfile.mutateAsync(
//       {
//         address:
//           authUser?.user?.verifiedCredentials[0]?.address?.toLowerCase() ?? "",
//         username,
//         starknetAddress,
//       },
//       {
//         onSuccess: () => {
//           setModalOpen(false);
//           utils.auth.currentUser.invalidate();
//         },
//       },
//     );
//   };

//   // const handleDynamicLogout = () => {
//   //   logoutMutation.mutateAsync(undefined, {
//   //     onSuccess: () => {
//   //       utils.auth.currentUser.invalidate();
//   //       setAuthUser(null);
//   //     },
//   //   });
//   // };

//   return (
//     <HelpMessageProvider>
//       {/*

//        /// dON'T THINK FOLLOWING IS BEING USED ANYWHERE

//       <FormModal
//         isOpen={modalOpen}
//         onClose={handleModalClose}
//         title="Add User Info"
//         onSubmit={onSubmit}
//         isValid={isFormValid}
//         cancelButtonText="Skip"
//       >
//         <FormControl id="member-name" paddingBottom={2}>
//           <FormLabel lineHeight="22px" fontSize="14px" fontWeight="600">
//             Username
//           </FormLabel>
//           <Input
//             placeholder="Username"
//             name="name"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </FormControl>
//         <FormControl id="address" paddingBottom={2}>
//           <FormLabel lineHeight="22px" fontSize="14px" fontWeight="600">
//             Starknet address
//           </FormLabel>
//           <Input
//             placeholder="0x..."
//             name="address"
//             value={starknetAddress}
//             onChange={(e) => setStarknetAddress(e.target.value)}
//           />$
//         </FormControl>
//       </FormModal> */}
//       {/* <DynamicContextProvider
//         settings={{
//           environmentId: import.meta.env.VITE_APP_DYNAMIC_ID,
//           eventsCallbacks: {
//             onAuthSuccess: (params: AuthSuccessParams) => {
//               setAuthUser(params);
//             },
//             onLogout: () => handleDynamicLogout(),
//           },
//           cssOverrides,
//         }}
//       > */}
//       {/* <DynamicWagmiConnector>
//           <LayoutDefault pageContext={pageContext}>{children}</LayoutDefault>
//         </DynamicWagmiConnector>
//       </DynamicContextProvider> */}
//     </HelpMessageProvider>
//   );
// }

// export {};
