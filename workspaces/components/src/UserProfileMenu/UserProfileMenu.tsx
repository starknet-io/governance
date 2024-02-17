import { forwardRef, RefObject } from "react";
import {
  Box,
  Flex,
  Link,
  Spacer,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Modal } from "src/Modal";
import { Button } from "src/Button";
import { useEffect, useState } from "react";
import { Delegate } from "@yukilabs/governance-backend/src/db/schema/delegates";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import { truncateAddress } from "src/utils";
import { CopyToClipboard } from "src/CopyToClipboard";
import { AvatarWithText } from "src/AvatarWithText";
import { IconButton, ProfileInfoModal, Tooltip } from "index";
import { DisconnectWalletIcon } from "src/Icons/UiIcons";
import useIsMobile from "@yukilabs/governance-frontend/src/hooks/useIsMobile";

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
  vp: number;
  isMenuOpen?: boolean;
  userBalance: any;
  delegatedTo: any;
  onModalStateChange?: (isOpen: boolean) => void;
  handleUpload?: (file: File) => Promise<string | void> | void;
  userExistsError?: boolean;
  setUsernameErrorFalse?: () => void;
  handleOpenModal?: () => void;
  setEditUserProfile?: (value: boolean) => void;
  setIsMenuOpen?: (value: boolean) => void;
}

export const UserProfileContent: React.FC<UserProfileMenuProps> = ({
  onDisconnect,
  user,
  vp,
  userBalance,
  delegatedTo,
  handleOpenModal,
  setEditUserProfile,
}) => {
  const delegatedToName = delegatedTo?.username || delegatedTo?.ensName;
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
        <VStack
          divider={<StackDivider mb="standard.md" />}
          align="stretch"
          mt="standard.md"
        >
          <Flex justifyContent="flex-start">
            <Box width="50%">
              <Text variant="smallStrong" color="content.support.default">
                Starknet address
              </Text>
            </Box>
            <Box width="50%">
              {user?.starknetAddress ? (
                <Tooltip label={user.starknetAddress}>
                  <Text variant="smallStrong" color="content.default.default">
                    {truncateAddress(user.starknetAddress)}
                  </Text>
                </Tooltip>
              ) : (
                <Text variant="smallStrong" color="content.default.default">
                  {truncateAddress(user?.starknetAddress || "")}
                </Text>
              )}
            </Box>
          </Flex>
          <Flex direction="column">
            <Flex mb="standard.sm">
              <Box width="50%">
                <Text variant="smallStrong" color="content.support.default">
                  STRK token balance
                </Text>
              </Box>

              <Box width="50%">
                <Text variant="smallStrong" color="content.default.default">
                  {new Intl.NumberFormat().format(userBalance?.balance)}{" "}
                  {userBalance?.symbol}
                </Text>
              </Box>
            </Flex>
            <Flex>
              <Box width="50%">
                <Text variant="smallStrong" color="content.support.default">
                  Delegated to
                </Text>
              </Box>

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
                            <Text>
                              {truncateAddress(delegatedTo?.address || "")}
                            </Text>
                          </Tooltip>
                          <CopyToClipboard text={delegatedTo?.address} />
                        </Flex>
                      ) : delegatedTo &&
                        delegatedTo.length &&
                        delegatedTo !==
                          "0x0000000000000000000000000000000000000000" ? (
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
            </Flex>
          </Flex>
          <Flex>
            <Box width="50%">
              <Text variant="smallStrong" color="content.support.default">
                My voting power
              </Text>
            </Box>

            <Box>
              <Text variant="smallStrong" color="content.default.default">
                {new Intl.NumberFormat().format(vp)}
              </Text>
            </Box>
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
    userBalance,
    delegatedTo,
    onModalStateChange,
    handleUpload,
    userExistsError = false,
    setUsernameErrorFalse,
    setIsMenuOpen,
  },
  ref,
) => {
  const [isModalOpen, setIsModalOpen] = useState(isMenuOpen);
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
            setEditUserProfile(false);
          }}
          size="md"
        >
          <UserProfileContent
            onDisconnect={onDisconnect}
            user={user}
            onSave={onSave}
            vp={vp}
            userBalance={userBalance}
            delegatedTo={delegatedTo}
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
              vp={vp}
              userBalance={userBalance}
              delegatedTo={delegatedTo}
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
