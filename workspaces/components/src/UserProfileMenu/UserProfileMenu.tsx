import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Spacer,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import "./user-profile.css";
import { Button } from "src/Button";
import { useEffect, useState } from "react";
import { XIcon } from "../Icons";
import { Delegate } from "@yukilabs/governance-backend/src/db/schema/delegates";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import { truncateAddress } from "src/utils";
import { CopyToClipboard } from "src/CopyToClipboard";
import { validateStarknetAddress } from "@yukilabs/governance-frontend/src/utils/helpers";
import { AvatarWithText } from "src/AvatarWithText";

interface IUser extends User {
  delegationStatement: Delegate | null;
}

interface UserProfileMenuProps {
  onDisconnect: () => void;
  user: IUser | null;
  onSave: (address: string, starknetAddress: string) => void;
  vp: number;
  userBalance: any;
  delegatedTo: any;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  onDisconnect,
  user,
  onSave,
  vp,
  userBalance,
  delegatedTo,
}) => {
  const [editUserProfile, setEditUserProfile] = useState(false);
  const [username, setUsername] = useState<any>(user?.username);
  const [starknetAddress, setStarknetAddress] = useState<any>(
    user?.starknetAddress,
  );
  const [error, setError] = useState<boolean>(false);

  const handleSave = () => {
    onSave(username, starknetAddress);
    setEditUserProfile(false);
  };

  const handleCancel = () => {
    // Exit edit mode without saving
    setEditUserProfile(false);
  };

  useEffect(() => {
    if (!validateStarknetAddress(starknetAddress)) {
      setError(true);
    } else {
      setError(false);
    }
  }, [starknetAddress]);

  return (
    <>
      {editUserProfile ? (
        <Box className="edit-user-profile-menu" p={6}>
          <Flex direction="column" mb={4}>
            <Box
              position="absolute"
              top="10px"
              right="10px"
              onClick={handleCancel}
              cursor="pointer"
            >
              <XIcon />
            </Box>
            <Flex
              lineHeight="32px"
              fontSize="21px"
              fontWeight="700"
              justifyContent="center"
            >
              Edit User Profile Info
            </Flex>
            <Box mt={6}>
              <form style={{ width: "100%" }}>
                <FormControl id="member-name" paddingBottom={2}>
                  <FormLabel lineHeight="22px" fontSize="14px" fontWeight="600">
                    Username
                  </FormLabel>
                  <Input
                    placeholder="Username"
                    name="name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>
                <FormControl id="address" paddingBottom={2}>
                  <FormLabel lineHeight="22px" fontSize="14px" fontWeight="600">
                    Starknet address
                  </FormLabel>
                  <Input
                    placeholder="0x..."
                    name="address"
                    value={starknetAddress}
                    onChange={(e) => setStarknetAddress(e.target.value)}
                  />
                  {error && (
                    <Text fontSize="12px" color="red">
                      Invalid Starknet address
                    </Text>
                  )}
                </FormControl>
                <Box width="100%" mt={6}>
                  <Button
                    width="100%"
                    variant="primary"
                    onClick={handleSave}
                    isDisabled={error}
                  >
                    Save
                  </Button>
                </Box>
              </form>
            </Box>
          </Flex>
        </Box>
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
            {/* <Flex direction="row" mb={4}>
              <Box>
                {user?.profileImage || user?.ensAvatar ? (
                  <ProfileImage
                    imageUrl={user.profileImage ?? user.ensAvatar}
                    size={"small"}
                  />
                ) : (
                  <Indenticon size={40} address={user?.address} />
                )}
              </Box>
              <Box pl={4}>
                <Text color="#2A2A32" fontWeight="bold" fontSize="14px">
                  {user?.username ||
                    user?.ensName ||
                    truncateAddress(user?.address || "")}
                </Text>
                <Text color="#6C6C75" fontSize="12px">
                  {truncateAddress(user?.address || "")}
                </Text>
              </Box>
              </Flex> */}

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
                        ) : delegatedTo !==
                          "0x0000000000000000000000000000000000000000" ? (
                          <Flex>
                            <Text>{truncateAddress(delegatedTo || "")}</Text>
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
                onClick={() => setEditUserProfile(true)}
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
