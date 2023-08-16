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
import { Indenticon } from "../Indenticon";
import { useState } from "react";
import { HiXMark } from "../Icons";
import { Delegate } from "@yukilabs/governance-backend/src/db/schema/delegates";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import { truncateAddress } from "src/utils";

interface IUser extends User {
  delegationStatement: Delegate;
}

interface UserProfileMenuProps {
  onDisconnect: () => void;
  user: IUser;
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

  const handleSave = () => {
    onSave(username, starknetAddress);
    setEditUserProfile(false);
  };

  const handleCancel = () => {
    // Exit edit mode without saving
    setEditUserProfile(false);
  };

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
              <HiXMark className="x-mark" size={20} />
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
                </FormControl>
                <Box width="100%" mt={6}>
                  <Button width="100%" variant="primary" onClick={handleSave}>
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
            <Flex direction="row" mb={4}>
              <Box>
                <Indenticon size={40} address={"asdasdascascascasc"} />
              </Box>
              <Box pl={4}>
                <Text color="#2A2A32" fontWeight="bold" fontSize="14px">
                  {user?.username ?? truncateAddress(user?.address || "")}
                </Text>
                <Text color="#6C6C75" fontSize="12px">
                  {truncateAddress(user?.address || "")}
                </Text>
              </Box>
            </Flex>
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
                    {delegatedTo ? (
                      <Link
                        href={`delegates/profile/${delegatedTo?.delegationStatement?.id}`}
                      >
                        {truncateAddress(delegatedTo?.address || "")}
                      </Link>
                    ) : (
                      "-"
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
