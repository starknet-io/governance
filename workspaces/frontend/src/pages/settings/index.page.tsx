import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormModal,
  Heading,
  IconButton,
  Input,
  ListRow,
  Stack,
  Text,
  useDisclosure,
  PencilIcon,
  Banner,
  InfoModal,
  SuccessIcon,
  WarningIcon,
} from "@yukilabs/governance-components";
import { gql } from "src/gql";
import { useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import {
  User,
  userRoleEnum,
} from "@yukilabs/governance-backend/src/db/schema/users";
import { trpc } from "src/utils/trpc";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { DocumentProps, ROLES } from "src/renderer/types";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";
import { usePageContext } from "src/renderer/PageContextProvider";
import { hasPermission } from "src/utils/helpers";
import {ethers, providers} from "ethers";
import { FormLayout } from "src/components/FormsCommon/FormLayout";
import { Icon, Spinner, Select } from "@chakra-ui/react";
import {
  BannedIcon,
  RemovedIcon,
} from "@yukilabs/governance-components/src/Icons";
import snapshot from "@snapshot-labs/snapshot.js";

const hub = "https://hub.snapshot.org"; // or https://testnet.snapshot.org for testnet
const client = new snapshot.Client712(hub);
import { Web3Provider } from "@ethersproject/providers";
import {useWalletClient} from "wagmi";

const userRoleValues = userRoleEnum.enumValues;

const GET_SPACE_QUERY = gql(`
  query GetSpaceQuery(
    $space: String!
  ) {
    space(id: $space) {
      name
      about
      network
      symbol
      website
      private
      admins
      moderators
      members
      categories
      plugins
      children {
        name
      }
      voting {
        hideAbstain
      }
      strategies {
        name
        network
        params
      }
      validation {
        name
        params
      }
      voteValidation {
        name
        params
      }
      filters {
        minScore
        onlyMembers
      }
      treasuries {
        name
        address
        network
      }
    }
  }
`);

export function Page() {
  const {
    handleSubmit: handleAddSubmit,
    register: addRegister,
    reset: resetAddUserForm,
    formState: { errors: addErrors, isValid: isAddValid },
  } = useForm<RouterInput["users"]["addRoles"]>();
  const { data: walletClient } = useWalletClient();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  const banUser = trpc.users.banUser.useMutation();
  const [isBanUserLoading, setBanUserLoading] = useState(false);
  const [editUserRole, setEditUserRole] = useState("");
  const [editError, setEditError] = useState("");
  const [addError, setAddError] = useState("");
  const [syncError, setSyncError] = useState("");
  const {
    isOpen: isSyncingSuccessOpen,
    onOpen: onSyncingSuccessOpen,
    onClose: onSyncingSuccessClose,
  } = useDisclosure();
  const {
    isOpen: isSyncingErrorOpen,
    onOpen: onSyncingErrorOpen,
    onClose: onSyncingErrorClose,
  } = useDisclosure();

  const { user } = usePageContext();

  const { data: space } = useQuery(GET_SPACE_QUERY, {
    variables: {
      space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
    },
  });

  const getEditRolesBasedOnUserRole = () => {
    if (!user?.role) {
      return [];
    }
    const roles = [];
    if ([ROLES.SUPERADMIN, ROLES.MODERATOR, ROLES.ADMIN].includes(user?.role)) {
      roles.push(ROLES.USER, ROLES.AUTHOR);
    }
    if ([ROLES.SUPERADMIN, ROLES.ADMIN].includes(user?.role)) {
      roles.push(ROLES.MODERATOR);
    }
    if ([ROLES.SUPERADMIN].includes(user?.role)) {
      roles.push(ROLES.ADMIN);
    }
    return roles;
  };
  const {
    control,
    handleSubmit: handleEditSubmit,
    register: editRegister,
    formState: { errors: editErrors, isValid: isEditValid },
    setValue: setEditValue,
    reset,
  } = useForm<RouterInput["users"]["addRoles"]>();
  const cancelRef = useRef(null);
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isBanUserFlowOpen,
    onOpen: onBanUserFlowOpen,
    onClose: onBanUserFlowClose,
  } = useDisclosure();
  const {
    isOpen: isUnbanUserFlowOpen,
    onOpen: onUnbanUserFlowOpen,
    onClose: onUnbanUserFlowClose,
  } = useDisclosure();
  const {
    isOpen: isUserBanned,
    onOpen: onUserBannedOpen,
    onClose: onUserBannedClose,
  } = useDisclosure();
  const {
    isOpen: isUserUnbanned,
    onOpen: onUserUnbannedOpen,
    onClose: onUserUnbannedClose,
  } = useDisclosure();
  const selectRef = useRef<HTMLSelectElement>(null);

  const addRoles = trpc.users.addRoles.useMutation();
  const editRoles = trpc.users.editRoles.useMutation();
  const users = trpc.users.getAll.useQuery();

  useEffect(() => {
    if (!imageChanged) {
      setImageUrl(user?.profileImage ?? null);
    }
  }, [user, imageChanged]);

  const tryToUpdateSpace = async () => {
    if (walletClient && space?.space) {
      const web3 = new providers.Web3Provider(walletClient.transport);
      const [account] = await web3.listAccounts();
      const spaceToEdit = {
        ...space.space,
      };
      const allUsers = users?.data || [];
      if ([ROLES.SUPERADMIN].includes(user?.role)) {
        const superAdmin = allUsers.find(
          (user) => user.role === ROLES.SUPERADMIN,
        );
        spaceToEdit.admins = allUsers
          .filter((user) => user.role === ROLES.ADMIN)
          .map((user) => user.address);
        spaceToEdit.admins.unshift(superAdmin?.address);
      }
      if ([ROLES.SUPERADMIN, ROLES.ADMIN].includes(user?.role)) {
        spaceToEdit.moderators = allUsers
          .filter((user) => user.role === ROLES.MODERATOR)
          .map((user) => user.address);
      }
      if ([ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.AUTHOR].includes(user?.role)) {
        spaceToEdit.members = allUsers
          .filter((user) => user.role === ROLES.AUTHOR)
          .map((user) => user.address);
      }

      function removeTypename<T>(obj: T): T {
        if (Array.isArray(obj)) {
          return obj.map((item) => removeTypename(item)) as any;
        } else if (obj !== null && typeof obj === "object") {
          const newObj: Record<string, unknown> = {};
          for (const key in obj) {
            if (key !== "__typename") {
              newObj[key] = removeTypename(
                (obj as Record<string, unknown>)[key],
              );
            }
          }
          return newObj as T;
        }
        return obj as T;
      }
      const cleanedSpace = removeTypename(spaceToEdit);
      console.log(cleanedSpace);

      try {
        const receipt = await client.space(web3, account, {
          space: "robwalsh.eth",
          settings: JSON.stringify(cleanedSpace),
        });
        onSyncingSuccessOpen();
      } catch (err) {
        setSyncError(err.error_description || "An error occurred");
        onSyncingErrorOpen();
      }
    }
  };

  const onSubmitAdd = handleAddSubmit(async (data) => {
    setAddError("");
    try {
      await addRoles.mutateAsync(data, {
        onSuccess: async () => {
          await users.refetch();
          resetAddUserForm();
        },
      });
      setAddError("");
    } catch (error) {
      // Handle error
      console.log(error);
      setAddError(error?.message || "An error occurred");
    }
  });

  const onSubmitEdit = handleEditSubmit(async (values) => {
    try {
      const data = {
        address: selectedUser?.address as string,
        role: (editUserRole || selectedUser?.role || "user") as string,
      };
      await editRoles.mutateAsync(data, {
        onSuccess: async () => {
          await users.refetch();
          onEditClose();
        },
      });
      reset();
      setEditError("");
    } catch (error) {
      // Handle error
      setEditError(error?.message || "An error occurred");
      console.log(error);
    }
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleBanUser = async (user: User) => {
    setSelectedUser(user);
    try {
      if (!user?.banned) {
        onBanUserFlowOpen();
      } else {
        onUnbanUserFlowOpen();
      }
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  const onBanUser = async () => {
    if (!selectedUser) {
      return;
    }
    setBanUserLoading(true);
    const banValue = !selectedUser?.banned;
    try {
      await banUser.mutateAsync(
        {
          banned: banValue,
          id: selectedUser.id,
        },
        {
          onSuccess: () => {
            users.refetch();
            setBanUserLoading(false);
            if (banValue) {
              onBanUserFlowClose();
              onUserBannedOpen();
            } else {
              onUnbanUserFlowClose();
              onUserUnbannedOpen();
            }
          },
        },
      );
    } catch (err) {
      console.log(err);
      setBanUserLoading(false);
    }
  };

  const handleEditOpen = (user: User) => {
    setSelectedUser(user);
    setEditError("");
    setEditUserRole(user?.role || "user");
    onEditOpen();
  };

  const handleEditClose = () => {
    setSelectedUser(null);
    onEditClose();
    setEditError("");
    reset();
    if (selectRef.current) {
      selectRef.current.value = "user";
    }
  };

  const isValidAddress = (address: string) => {
    try {
      const checksumAddress = ethers.utils.getAddress(address);
      return ethers.utils.isAddress(checksumAddress);
    } catch (error) {
      return false;
    }
  };

  const sortedUsersList = useMemo(() => {
    return (users?.data || []).sort((a, b) => {
      // Define the role priorities
      const rolePriority = {
        superadmin: 0,
        admin: 1,
        moderator: 2,
        author: 3,
        user: 4,
        other: 5,
      };

      // Determine the priority values for a and b based on their roles
      const aRoleValue =
        rolePriority[a.role] !== undefined
          ? rolePriority[a.role]
          : rolePriority.other;
      const bRoleValue =
        rolePriority[b.role] !== undefined
          ? rolePriority[b.role]
          : rolePriority.other;

      // If the role values are different, sort based on role
      if (aRoleValue !== bRoleValue) {
        return aRoleValue - bRoleValue;
      }

      // If the roles are the same, sort based on banned status
      const aValue = a.banned ? 1 : 0;
      const bValue = b.banned ? 1 : 0;
      return aValue - bValue;
    });
  }, [users?.data]);
  const editableRoles = getEditRolesBasedOnUserRole();
  return (
    <FormLayout>
      <InfoModal
        isOpen={isBanUserFlowOpen}
        onClose={onBanUserFlowClose}
        title={`Are you sure you want to ban user – ${
          selectedUser
            ? selectedUser?.ensName || truncateAddress(selectedUser?.address)
            : ""
        }`}
      >
        <Flex justifyContent="center">
          <Icon as={BannedIcon} boxSize="104px" />
        </Flex>
        <Flex gap="1" width="100%" justifyContent="space-between">
          <Button variant="ghost" onClick={onBanUserFlowClose} width={"100%"}>
            Cancel
          </Button>
          <Button onClick={onBanUser} width={"100%"}>
            <Flex alignItems="center" gap={2}>
              {isBanUserLoading && <Spinner size="sm" />}
              <div>Ban</div>
            </Flex>
          </Button>
        </Flex>
      </InfoModal>
      <InfoModal
        isOpen={isUnbanUserFlowOpen}
        onClose={onUnbanUserFlowClose}
        title={`Are you sure you want to unban user – ${
          selectedUser
            ? selectedUser?.ensName || truncateAddress(selectedUser?.address)
            : ""
        }`}
      >
        <Flex justifyContent="center">
          <Icon as={BannedIcon} boxSize="104px" />
        </Flex>
        <Flex gap="1" width="100%" justifyContent="space-between">
          <Button variant="ghost" onClick={onBanUserFlowClose} width={"100%"}>
            Cancel
          </Button>
          <Button onClick={onBanUser} width={"100%"}>
            <Flex alignItems="center" gap={2}>
              {isBanUserLoading && <Spinner size="sm" />}
              <div>Unban</div>
            </Flex>
          </Button>
        </Flex>
      </InfoModal>
      <InfoModal
        isOpen={isUserBanned}
        onClose={onUserBannedClose}
        title={`User – ${
          selectedUser
            ? selectedUser?.ensName || truncateAddress(selectedUser?.address)
            : ""
        } sucessfully banned`}
      >
        <Flex justifyContent="center">
          <Icon as={SuccessIcon} boxSize="104px" />
        </Flex>
        <Button variant="primary" onClick={onUserBannedClose}>
          Close
        </Button>
      </InfoModal>
      <InfoModal
        isOpen={isUserUnbanned}
        onClose={onUserUnbannedClose}
        title={`User – ${
          selectedUser
            ? selectedUser?.ensName || truncateAddress(selectedUser?.address)
            : ""
        } sucessfully unbanned`}
      >
        <Flex justifyContent="center">
          <Icon as={SuccessIcon} boxSize="104px" />
        </Flex>
        <Button variant="primary" onClick={onUserUnbannedClose}>
          Close
        </Button>
      </InfoModal>
      <InfoModal
        isOpen={isSyncingSuccessOpen}
        onClose={onSyncingSuccessClose}
        title={`Successfully synced roles with snapshot`}
      >
        <Flex justifyContent="center">
          <Icon as={SuccessIcon} boxSize="104px" />
        </Flex>
        <Button variant="primary" onClick={onSyncingSuccessClose}>
          Close
        </Button>
      </InfoModal>
      <InfoModal
        isOpen={isSyncingErrorOpen}
        onClose={onSyncingErrorClose}
        title={`An error occurred while syncing roles with snapshot`}
      >
        <Flex justifyContent="center">
          <Icon as={WarningIcon} boxSize="104px" />
        </Flex>
        <Flex alignItems="center" justifyContent="center" width="100%">
          <Text variant="mediumStrong">{syncError}</Text>
        </Flex>
        <Button variant="primary" onClick={onSyncingErrorClose}>
          Close
        </Button>
      </InfoModal>
      <Box
        display="flex"
        flexDirection={{ base: "column", md: "column" }}
        height="100%"
        justifyContent="center"
        flex="1"
      >
        <FormModal
          isOpen={isEditOpen}
          onClose={handleEditClose}
          title="Edit User Role"
          onSubmit={onSubmitEdit}
          isValid={true}
        >
          <FormControl id="editRole">
            <FormLabel>Role</FormLabel>
            <Select
              size="sm"
              {...editRegister("role")}
              ref={selectRef}
              value={editUserRole}
              onChange={(e) => {
                console.log(e.target.value);
                setEditUserRole(e.target.value);
              }}
            >
              {editableRoles.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </FormControl>

          {editError && editError.length && (
            <Box mt={4}>
              <Banner label={editError} type="error" variant="error" />
            </Box>
          )}
        </FormModal>
        {!hasPermission(user?.role, [
          ROLES.ADMIN,
          ROLES.SUPERADMIN,
          ROLES.MODERATOR,
        ]) ? (
          <></>
        ) : (
          <Box>
            <Box>
              <Heading variant="h3" mb="24px" fontSize="28px">
                Roles
              </Heading>
              <form onSubmit={onSubmitAdd}>
                <Stack spacing="32px" direction={{ base: "column" }}>
                  <FormControl id="address">
                    <FormLabel>Ethereum wallet address</FormLabel>
                    <Input
                      size="standard"
                      variant="primary"
                      placeholder="Add address..."
                      {...addRegister("address", {
                        required: "This field is required.",
                        validate: {
                          isValidEthereumAddress: (value) =>
                            isValidAddress(value) ||
                            "Invalid Ethereum address.",
                        },
                      })}
                    />
                    {addErrors.address && (
                      <span>{addErrors.address.message}</span>
                    )}
                  </FormControl>

                  <FormControl id="role">
                    <FormLabel>Role</FormLabel>
                    <Select
                      size="sm"
                      {...addRegister("role", { required: true })}
                    >
                      {editableRoles.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                    {addErrors.role && <span>This field is required.</span>}
                  </FormControl>
                  {addError && addError.length && (
                    <Box mt={4}>
                      <Banner label={addError} type="error" variant="error" />
                    </Box>
                  )}
                  <Flex justifyContent="flex-end">
                    <Button type="submit" variant="primary">
                      Add
                    </Button>
                  </Flex>
                </Stack>
              </form>
            </Box>

            <Box mt="24px">
              <Heading variant="h3" mb="24px" fontSize="28px">
                Users
              </Heading>
              {[ROLES.SUPERADMIN, ROLES.ADMIN].includes(user?.role) ? (
                <Button onClick={tryToUpdateSpace} variant="primary">
                  Sync with Snapshot
                </Button>
              ) : null}
              <ListRow.Container>
                {sortedUsersList.map((data) => (
                  <ListRow.Root key={data.id}>
                    <Box flex="1">
                      <Text variant="cardBody" noOfLines={1}>
                        {data.ensName || truncateAddress(data.address)}
                      </Text>
                    </Box>
                    <Box flex="1">
                      <Text variant="cardBody" noOfLines={1}>
                        {data.role}
                      </Text>
                    </Box>
                    <Box flex="1">
                      {data.banned ? <ListRow.Status status="banned" /> : null}
                    </Box>
                    <Box flex="1" justifyContent="flex-end" display="flex">
                      {![
                        ROLES.MODERATOR,
                        ROLES.ADMIN,
                        ROLES.SUPERADMIN,
                      ].includes(data?.role) ? (
                        <IconButton
                          aria-label="Delete user role"
                          icon={<RemovedIcon />}
                          variant="ghost"
                          onClick={() => handleBanUser(data)}
                        />
                      ) : (
                        <Box py={6} />
                      )}
                      {editableRoles.includes(data.role) ? (
                        <IconButton
                          aria-label="Edit user role"
                          icon={<PencilIcon />}
                          variant="ghost"
                          onClick={() => handleEditOpen(data)}
                        />
                      ) : (
                        <Box py={6} />
                      )}
                    </Box>
                  </ListRow.Root>
                ))}
              </ListRow.Container>
            </Box>
          </Box>
        )}
      </Box>
    </FormLayout>
  );
}

export const documentProps = {
  title: "Settings",
} satisfies DocumentProps;
