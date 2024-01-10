import { forwardRef } from "react";
import { Box, Flex, Link, StackDivider, Text, VStack } from "@chakra-ui/react";
import {
  Modal,
  Button,
  IconButton,
  ProfileInfoModal,
  Tooltip,
  CopyToClipboard,
  AvatarWithText,
} from "@yukilabs/governance-components";
import { DisconnectWalletIcon } from "@yukilabs/governance-components";
import { useEffect, useState } from "react";
import { Delegate } from "@yukilabs/governance-backend/src/db/schema/delegates";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";
import useIsMobile from "@yukilabs/governance-frontend/src/hooks/useIsMobile";
import { WalletButtons } from "../../pages/profile/settings/index.page";

interface IUser extends User {
  delegationStatement: Delegate | null;
}

interface UserProfileMenuProps {
  onDisconnect: () => void;
  user: IUser | null;
  onSave: (data: {
    username: string;
    starknetAddress: string;
    profileImage: string | null;
  }) => Promise<any>;
  votingPowerEth: number;
  votingPowerStark: number;
  isMenuOpen?: boolean;
  delegatedToL1: any;
  delegatedToL2: any;
  onModalStateChange?: (isOpen: boolean) => void;
  handleUpload?: (file: File) => Promise<string | void> | void;
  userExistsError?: boolean;
  setUsernameErrorFalse?: () => void;
  handleOpenModal?: () => void;
  setEditUserProfile?: (value: boolean) => void;
  setIsMenuOpen?: (value: boolean) => void;
  ethBalance?: {
    symbol: string | null;
    balance: number | bigint | null;
  };
  starknetBalance?: {
    symbol: string | null;
    balance: string | null;
  };
}

const DelegationComponent = ({
  delegatedTo,
  delegatedToName,
}: {
  delegatedTo: any;
  delegatedToName: string;
}) => {
  return (
    <Box width="50%">
      <Text variant="smallStrong" color="content.default.default">
        {delegatedTo?.delegationStatement ? (
          <Flex>
            <Link
              fontSize="small"
              fontWeight="normal"
              href={`/delegates/profile/${delegatedTo?.delegationStatement?.id}`}
            >
              {delegatedToName ? (
                truncateAddress(delegatedToName || "")
              ) : (
                <Tooltip label={delegatedTo?.address || ""}>
                  {truncateAddress(delegatedTo?.address || "")}
                </Tooltip>
              )}
            </Link>
            <CopyToClipboard text={delegatedTo?.address} />
          </Flex>
        ) : (
          <>
            {delegatedTo?.address ? (
              <Flex>
                <Tooltip label={delegatedTo?.address}>
                  <Text>{truncateAddress(delegatedTo?.address || "")}</Text>
                </Tooltip>
                <CopyToClipboard text={delegatedTo?.address} />
              </Flex>
            ) : delegatedTo &&
              delegatedTo.length &&
              delegatedTo !== "0x0000000000000000000000000000000000000000" ? (
              <Flex>
                <Tooltip label={delegatedTo}>
                  <Text>{truncateAddress(delegatedTo || "")}</Text>
                </Tooltip>
                <CopyToClipboard text={delegatedTo} />
              </Flex>
            ) : (
              "-"
            )}
          </>
        )}
      </Text>
    </Box>
  );
};

export const UserProfileContent: React.FC<UserProfileMenuProps> = ({
  onDisconnect,
  user,
  votingPowerEth,
  votingPowerStark,
  ethBalance,
  starknetBalance,
  delegatedToL1,
  delegatedToL2,
  handleOpenModal,
  setEditUserProfile,
}: UserProfileMenuProps) => {
  const delegatedToL1Name = delegatedToL1?.username || delegatedToL1?.ensName;
  const delegatedToL2Name = delegatedToL2?.username || delegatedToL2?.ensName;
  return (
    <>
      <Box position="absolute" right="12px" top="12px" zIndex={0}>
        <IconButton
          aria-label="disconnect"
          size="condensed"
          icon={<DisconnectWalletIcon />}
          variant="outline"
          onClick={onDisconnect}
          zIndex={2}
        />
      </Box>
      <VStack spacing={"spacing.md"} align="stretch">
        <AvatarWithText
          size="condensed"
          address={user?.address}
          headerText={
            user?.username ||
            user?.ensName ||
            truncateAddress(user?.address || "")
          }
          subheaderText={truncateAddress(user?.address || "")}
          src={user?.profileImage ?? user?.ensAvatar ?? null}
        />
        <Box mt="standard.md" mb="standard.sm">
          <WalletButtons selectable profileVariant />
        </Box>

        <VStack
          divider={<StackDivider mb="standard.md" />}
          align="stretch"
          mt="standard.md"
        >
          <Flex direction="column">
            <Flex mb="standard.sm">
              <Box width="50%">
                <Text variant="smallStrong" color="content.support.default">
                  L1 balance
                </Text>
              </Box>

              <Box width="50%">
                <Text variant="smallStrong" color="content.default.default">
                  {new Intl.NumberFormat().format(ethBalance?.balance)}{" "}
                  {ethBalance?.symbol}
                </Text>
              </Box>
            </Flex>
            <Flex mb="standard.sm">
              <Box width="50%">
                <Text variant="smallStrong" color="content.support.default">
                  L1 voting power
                </Text>
              </Box>

              <Box>
                <Text variant="smallStrong" color="content.default.default">
                  {new Intl.NumberFormat().format(votingPowerEth)}
                </Text>
              </Box>
            </Flex>
            <Flex>
              <Box width="50%">
                <Text variant="smallStrong" color="content.support.default">
                  L1 Delegated to
                </Text>
              </Box>
              <DelegationComponent
                delegatedTo={delegatedToL1}
                delegatedToName={delegatedToL1Name}
              />
            </Flex>
          </Flex>
          <Flex direction="column">
            <Flex mb="standard.sm">
              <Box width="50%">
                <Text variant="smallStrong" color="content.support.default">
                  L2 balance
                </Text>
              </Box>

              <Box width="50%">
                <Text variant="smallStrong" color="content.default.default">
                  {starknetBalance?.balance} {starknetBalance?.symbol}
                </Text>
              </Box>
            </Flex>
            <Flex mb="standard.sm">
              <Box width="50%">
                <Text variant="smallStrong" color="content.support.default">
                  L2 voting power
                </Text>
              </Box>

              <Box>
                <Text variant="smallStrong" color="content.default.default">
                  {new Intl.NumberFormat().format(votingPowerStark)}
                </Text>
              </Box>
            </Flex>
            <Flex>
              <Box width="50%">
                <Text variant="smallStrong" color="content.support.default">
                  L2 Delegated to
                </Text>
              </Box>
              <DelegationComponent
                delegatedTo={delegatedToL2}
                delegatedToName={delegatedToL2Name}
              />
            </Flex>
          </Flex>
        </VStack>
        <Flex direction="column" mt="standard.md">
          <Button
            variant="secondary"
            size="condensed"
            onClick={(e) => {
              setEditUserProfile && setEditUserProfile(true);
              handleOpenModal && handleOpenModal();
            }}
          >
            Edit user profile
          </Button>
        </Flex>
      </VStack>
    </>
  );
};

const UserProfileMenuComponent = (
  {
    isMenuOpen,
    onDisconnect,
    user,
    onSave,
    vp,
    ethBalance,
    starknetBalance,
    delegatedToL1,
    delegatedToL2,
    onModalStateChange,
    handleUpload,
    userExistsError = false,
    setUsernameErrorFalse,
    setIsMenuOpen,
    votingPowerEth,
    votingPowerStark,
  }: UserProfileMenuProps,
  ref,
) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(isMenuOpen);
  useEffect(() => {
    setIsModalOpen(isMenuOpen);
  }, [isMenuOpen]);

  const { isMobile } = useIsMobile();
  const handleCloseModal = () => {
    setIsMenuOpen(false);
  };
  const handleOpenModal = () => setIsModalOpen(true);
  const [editUserProfile, setEditUserProfile] = useState(false);

  useEffect(() => {
    onModalStateChange && onModalStateChange(isModalOpen);
  }, [isModalOpen]);

  async function handleSave(data: {
    username: string;
    starknetAddress: string;
    profileImage: string | null;
  }) {
    const result = await onSave(data);
    if (result) {
      setEditUserProfile(false);
      setIsModalOpen(false);
    }
  }

  return (
    <div ref={ref}>
      <ProfileInfoModal
        isOpen={editUserProfile}
        onClose={() => {
          handleCloseModal();
          setEditUserProfile(false);
        }}
        handleUpload={handleUpload}
        user={user}
        saveData={(data) => handleSave(data)}
        userExistsError={userExistsError}
        setUsernameErrorFalse={setUsernameErrorFalse}
      />
      {isMobile ? (
        <Modal
          isCentered
          isOpen={isModalOpen}
          onClose={() => {
            handleCloseModal();
            console.log("false 2");
            setEditUserProfile(false);
          }}
          size="md"
        >
          <UserProfileContent
            onDisconnect={onDisconnect}
            user={user}
            onSave={onSave}
            votingPowerEth={votingPowerEth}
            votingPowerStark={votingPowerStark}
            starknetBalance={starknetBalance}
            ethBalance={ethBalance}
            delegatedToL1={delegatedToL1}
            delegatedToL2={delegatedToL2}
            handleOpenModal={handleOpenModal}
            setEditUserProfile={setEditUserProfile}
          />
        </Modal>
      ) : (
        isModalOpen && (
          <Box
            p={"standard.xl"}
            borderRadius={"standard.md"}
            bg="surface.cards.default"
            position={"absolute"}
            width="348px"
            right={{ base: "16px", md: "60px" }}
            top="55px"
            border="1px solid #E9E8EA"
            // borderColor="content.default.default"
            boxShadow="0px 9px 30px 0px rgba(51, 51, 62, 0.08), 1px 2px 2px 0px rgba(51, 51, 62, 0.10)"
            fontSize="12px"
          >
            <UserProfileContent
              onDisconnect={onDisconnect}
              user={user}
              onSave={onSave}
              votingPowerEth={votingPowerEth}
              votingPowerStark={votingPowerStark}
              ethBalance={ethBalance}
              starknetBalance={starknetBalance}
              delegatedToL1={delegatedToL1}
              delegatedToL2={delegatedToL2}
              onModalStateChange={onModalStateChange}
              setEditUserProfile={setEditUserProfile}
            />
          </Box>
        )
      )}
    </div>
  );
};

export const UserProfileMenu = forwardRef<HTMLDivElement, UserProfileMenuProps>(
  UserProfileMenuComponent,
);
