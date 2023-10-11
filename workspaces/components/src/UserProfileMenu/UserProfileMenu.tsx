import {
  Box,
  Flex,
  Link,
  Spacer,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import "./user-profile.css";
import { Button } from "src/Button";
import { useEffect, useState } from "react";
import { Delegate } from "@yukilabs/governance-backend/src/db/schema/delegates";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import { truncateAddress } from "src/utils";
import { CopyToClipboard } from "src/CopyToClipboard";
import { AvatarWithText } from "src/AvatarWithText";
import { ProfileInfoModal } from "index";

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
  userBalance: any;
  delegatedTo: any;
  onModalStateChange: (isOpen: boolean) => void;
  handleUpload?: (file: File) => Promise<string | void> | void;
  userExistsError?: boolean;
  setUsernameErrorFalse?: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
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
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const [editUserProfile, setEditUserProfile] = useState(false);

  useEffect(() => {
    onModalStateChange(isModalOpen);
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
    <>
      <ProfileInfoModal
        isOpen={isModalOpen}
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
      {editUserProfile ? (
        <></>
      ) : (
        <Box className="user-profile-menu" p={6}>
          <VStack
            divider={<StackDivider borderColor="gray.200" />}
            spacing={3}
            align="stretch"
          >
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

            <Flex>
              <Box>
                <Text color="#4D4D56">Starknet address</Text>
              </Box>
              <Spacer />
              <Box>
                <Text color="#2A2A32">
                  {truncateAddress(user?.starknetAddress || "")}
                </Text>
              </Box>
            </Flex>
            <Flex direction="column">
              <Flex mb={5}>
                <Box>
                  <Text color="#4D4D56">STRK token balance</Text>
                </Box>
                <Spacer />
                <Box>
                  <Text color="#2A2A32">
                    {userBalance?.balance} {userBalance?.symbol}
                  </Text>
                </Box>
              </Flex>
              <Flex>
                <Box>
                  <Text color="#4D4D56">Delegated to</Text>
                </Box>
                <Spacer />
                <Box>
                  <Text color="#2A2A32">
                    {delegatedTo?.delegationStatement ? (
                      <Flex>
                        <Link
                          fontSize="small"
                          fontWeight="normal"
                          href={`/delegates/profile/${delegatedTo?.delegationStatement?.id}`}
                        >
                          {delegatedTo.username ??
                            delegatedTo.ensName ??
                            truncateAddress(delegatedTo?.address || "")}
                        </Link>

                        <CopyToClipboard text={delegatedTo?.address} />
                      </Flex>
                    ) : (
                      <>
                        {delegatedTo?.address ? (
                          <Flex>
                            <Text>
                              {truncateAddress(delegatedTo?.address || "")}
                            </Text>
                            <CopyToClipboard text={delegatedTo?.address} />
                          </Flex>
                        ) : delegatedTo &&
                          delegatedTo !==
                            "0x0000000000000000000000000000000000000000" ? (
                          <Flex>
                            <Text>{truncateAddress(delegatedTo)}</Text>
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
              <Box>
                <Text color="#4D4D56">My voting power</Text>
              </Box>
              <Spacer />
              <Box>
                <Text color="#2A2A32">{vp}</Text>
              </Box>
            </Flex>
            <Flex direction="column" mt={4}>
              <Button
                variant="outline"
                onClick={() => {
                  setEditUserProfile(true);
                  handleOpenModal();
                }}
              >
                Edit user profile
              </Button>
              <Box height={2} />
              <Button variant="primary" onClick={onDisconnect}>
                Disconnect
              </Button>
            </Flex>
          </VStack>
        </Box>
      )}
    </>
  );
};
