import React, { useEffect, useState } from "react";
import { DocumentProps } from "../../../renderer/types";
import {
  Box,
  Flex,
  Icon,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
  Button,
} from "@chakra-ui/react";
import {
  FormControlled,
  Input,
  Modal,
  PageTitle,
  ProfileImage,
  ShareIcon,
  StarknetIcon,
  UploadImage,
  EthereumIcon,
  Button as GovernanceButton,
  IconButton,
  XIcon,
  StatusModal,
  WrongAccountOrNetworkModal,
} from "@yukilabs/governance-components";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/dist/src/routers";
import { usePageContext } from "../../../renderer/PageContextProvider";
import { useFileUpload } from "../../../hooks/useFileUpload";
import { trpc } from "../../../utils/trpc";
import { FormLayout } from "../../../components/FormsCommon/FormLayout";

import {
  CheckIcon,
  DynamicConnectButton,
  useDynamicContext,
  useUserWallets,
  useWalletConnectorEvent,
} from "@dynamic-labs/sdk-react-core";

import type { WalletConnector } from "@dynamic-labs/wallet-connector-core";
import { getChecksumAddress } from "starknet";
import { useWallets } from "../../../hooks/useWallets";

type Wallet = {
  address: string;
  chain: string;
  connected: boolean;
  connector: WalletConnector;
  id: string;
  network?: string | number;
  authenticated: boolean;
};

enum Chain {
  EVM = "eip155",
  STARKNET = "starknet",
}

const WalletDisplay = ({
  wallet,
  icon,
  profileVariant,
  isSelectable,
  onClick,
  isActive,
  handleUnlinkWallet,
}: {
  wallet: Wallet;
  icon: any;
  isSelectable?: boolean;
  onClick: () => void;
  isActive?: boolean;
  profileVariant?: boolean;
  handleUnlinkWallet?: any;
}) => {
  return wallet ? (
    isSelectable ? (
      <GovernanceButton
        variant={isActive && profileVariant ? "fill" : "secondary"}
        isActive={isActive && profileVariant}
        onClick={onClick}
        type="button"
      >
        <Flex gap="standard.xs" alignItems="center">
          <Icon as={icon} />
          <Text variant={"mediumStrong"}>
            {profileVariant
              ? truncateAddress(wallet.address, 4, 3)
              : truncateAddress(wallet.address)}
          </Text>
          {!profileVariant && <Icon as={CheckIcon} />}
        </Flex>
      </GovernanceButton>
    ) : (
      <Flex gap="standard.xs" alignItems="center">
        <Icon as={icon} />
        <Text variant="medium">{truncateAddress(wallet.address)}</Text>
        <Icon as={CheckIcon} />
        <IconButton
          variant="ghost"
          aria-label={"unlink"}
          icon={<XIcon />}
          onClick={() => handleUnlinkWallet(wallet?.id)}
        />
      </Flex>
    )
  ) : (
    <DynamicConnectButton>
      <Button
        data-testid={wallet ? "eth" : "stark"}
        variant="secondary"
        onClick={(e) => {
          e.preventDefault();
        }}
        type="button"
      >
        <Flex gap="standard.xs" alignItems="center">
          <Icon as={icon} />
          <Text variant="medium">Connect</Text>
        </Flex>
      </Button>
    </DynamicConnectButton>
  );
};

export const WalletButtons = ({
  withLabel,
  selectable,
  profileVariant,
}: {
  withLabel?: boolean;
  selectable?: boolean;
  profileVariant?: boolean;
}) => {
  const userWallets = useUserWallets();
  const walletConnectors = userWallets.map(({ connector }) => connector);
  const { user } = usePageContext();
  const { setPrimaryWallet, primaryWallet, handleUnlinkWallet } =
    useDynamicContext();
  const editUser = trpc.users.editUserProfile.useMutation();

  useWalletConnectorEvent(
    primaryWallet?.connector,
    "accountChange",
    ({ accounts }, connector) => {
      // We will need this to detect account change in dynamic
    },
  );

  const findMatchingWallet = (wallets: any[], key: "EVM" | "STARKNET") => {
    return wallets.find((wallet) => wallet.chain === Chain[key]);
  };

  const starknetWallet = findMatchingWallet(userWallets, "STARKNET");
  const ethWallet = findMatchingWallet(userWallets, "EVM");
  const currentStarknetAccount =
    typeof window !== "undefined" ? window?.starknet?.account?.address : "";

  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  return (
    <Flex justifyContent="space-between" gap="standard.xs">
      <Flex direction="column" gap="standard.xl" flex="1">
        {withLabel && (
          <Text
            variant="mediumStrong"
            color="content.default.default"
            sx={{ fontWeight: 600 }}
          >
            Connect Starknet wallet
          </Text>
        )}
        <WalletDisplay
          profileVariant={profileVariant}
          wallet={starknetWallet}
          isActive={primaryWallet?.id === starknetWallet?.id}
          handleUnlinkWallet={handleUnlinkWallet}
          icon={StarknetIcon}
          isSelectable={selectable}
          onClick={async () => {
            try {
              if (typeof window !== "undefined") {
                if (
                  getChecksumAddress(
                    window?.starknet?.account?.address || "",
                  ) !== getChecksumAddress(starknetWallet?.address || "")
                ) {
                  setIsStatusModalOpen(true);
                  return;
                }
              }
              await setPrimaryWallet(starknetWallet.id);
            } catch (err) {
              console.error(err);
            }
          }}
        />
      </Flex>
      <Flex direction="column" gap="standard.xl" flex="1">
        {withLabel && (
          <Text
            variant="mediumStrong"
            color="content.default.default"
            sx={{ fontWeight: 600 }}
          >
            Connect Ethereum wallet
          </Text>
        )}
        <WalletDisplay
          profileVariant={profileVariant}
          wallet={ethWallet}
          icon={EthereumIcon}
          isActive={primaryWallet?.id === ethWallet?.id}
          isSelectable={selectable}
          onClick={async () => {
            try {
              await setPrimaryWallet(ethWallet.id);
            } catch (err) {
              console.error(err);
            }
          }}
        />
      </Flex>
      <WrongAccountOrNetworkModal
        isOpen={isStatusModalOpen}
        starknetAddress={currentStarknetAccount}
        expectedStarknetAddress={starknetWallet?.address}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </Flex>
  );
};

export function Page() {
  const { user } = usePageContext();
  const { handleUpload } = useFileUpload();
  const utils = trpc.useContext();
  const { starknetWallet } = useWallets();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<RouterInput["users"]["editUserProfile"]>();
  const editUserProfile = trpc.users.editUserProfile.useMutation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();

  const handleImageSelected = async (selectedFile: File) => {
    try {
      setLoading(true);
      const imageUrl = await handleUpload?.(selectedFile);
      setImageUrl(imageUrl as string);
      if (typeof imageUrl !== "string") {
        throw new Error("Invalid image URL returned.");
      }
      setLoading(false);
      onUploadClose();
    } catch (error) {
      setLoading(false);
      console.error("Upload failed:", error);
    }
  };

  const [userExistsError, setUserExistsError] = useState(false);

  useEffect(() => {
    setImageUrl(user?.profileImage);
    setValue("username", user?.username);
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    await handleSubmit(async (data) => {
      const saveProfileData: any = {};
      saveProfileData.username = data.username;
      saveProfileData.profileImage = imageUrl;
      setLoading(true);

      try {
        const res = await editUserProfile.mutateAsync(
          {
            id: user.id,
            username:
              saveProfileData.username !== user?.username
                ? saveProfileData.username
                : null,
            profileImage: saveProfileData.profileImage,
          },
          {
            onSuccess: () => {
              utils.auth.currentUser.invalidate();
              setLoading(false);
              toast({
                title: "Profile Updated",
                status: "success",
                position: "top-right",
                duration: 3000,
                isClosable: true,
              });
              return true;
            },
            onError: (error) => {
              if (error.message === "Username already exists") {
                setUserExistsError(true);
              }
              setLoading(false);
              return false;
            },
          },
        );
        return res;
      } catch (error) {
        return false;
      }
    })();
  };

  const setUsernameErrorFalse = () => {
    setUserExistsError(false);
  };

  return (
    <FormLayout>
      <Stack spacing="standard.2xl" direction={{ base: "column" }}>
        <PageTitle
          learnMoreLink={undefined}
          title="User Profile Settings"
          description=""
          maxW={"580px"}
          mb={0}
        />
        <>
          <Modal
            isCentered
            isOpen={isUploadOpen}
            onClose={() => onUploadClose()}
            title="Upload avatar"
            size="md"
          >
            <>
              <UploadImage
                onImageSelected={handleImageSelected}
                loading={loading}
                closeModal={() => onUploadClose()}
              />
            </>
          </Modal>
          <Box
            mb="standard.xl"
            display={"flex"}
            flexDirection={"row"}
            w="100%"
            alignItems="center"
            gap="24px"
          >
            <Box>
              <ProfileImage imageUrl={imageUrl} size="medium" />
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems="flex-start"
              gap="8px"
            >
              <Button
                variant={"secondary"}
                onClick={() => onUploadOpen()}
                spinner={<Spinner />}
                leftIcon={<ShareIcon />}
                size="standard"
              >
                Upload Avatar
              </Button>
            </Box>
            <Box>
              <Text variant="small" color={"content.default.default"}>
                We support PNGs, JPEGs and GIFs under 10MB
              </Text>
            </Box>
          </Box>
          <form>
            <Flex flexDirection="column" gap="standard.2xl" w="100%">
              <FormControlled
                name="username"
                isRequired={false}
                id="member-name"
                label="Username"
                isInvalid={!!userExistsError}
                errorMessage="Username already exists"
              >
                <Input
                  size="standard"
                  variant="primary"
                  placeholder="Username"
                  {...register("username")}
                  onChange={setUsernameErrorFalse}
                />
              </FormControlled>
              <WalletButtons withLabel />
              <Button onClick={handleSave} maxW="140px" type="submit">
                {loading ? (
                  <Flex gap={1.5} alignItems="center">
                    <Spinner size="sm" />
                    <Text>Save Settings</Text>
                  </Flex>
                ) : (
                  <Text>Save Settings</Text>
                )}
              </Button>
            </Flex>
          </form>
        </>
      </Stack>
    </FormLayout>
  );
}

export const documentProps = {
  title: "Profile Settings",
} satisfies DocumentProps;
