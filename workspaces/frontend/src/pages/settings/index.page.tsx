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
  Select
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
import { ethers } from "ethers";
import { FormLayout } from "src/components/FormsCommon/FormLayout";
import { Icon, Spinner } from "@chakra-ui/react";
import {
  BannedIcon,
  RemovedIcon,
} from "@yukilabs/governance-components/src/Icons";
import snapshot from "@snapshot-labs/snapshot.js";

import { Web3Provider } from "@ethersproject/providers";
import {useSpace} from "../../hooks/snapshotX/useSpace";

const userRoleValues = userRoleEnum.enumValues;

export function Page() {
  const {
    setValue,
    handleSubmit: handleAddSubmit,
    register: addRegister,
    reset: resetAddUserForm,
    formState: { errors: addErrors, isValid: isAddValid },
  } = useForm<RouterInput["users"]["addRoles"]>();
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

  const { data: space } = useSpace()

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

  const addRoles = trpc.users.addRoles.useMutation();
  const editRoles = trpc.users.editRoles.useMutation();
  const users = trpc.users.getAll.useQuery();

  useEffect(() => {
    if (!imageChanged) {
      setImageUrl(user?.profileImage ?? null);
    }
  }, [user, imageChanged]);

  const tryToUpdateSpace = async () => {

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
    setEditUserRole("user");
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
  const [roleValue, setRoleValue] = useState("");
  const handleSelectChange = (selectedOption) => {
    setRoleValue(selectedOption);
  };
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
          <FormControl id="editRole" sx={{ marginBottom: "standard.md" }}>
            <FormLabel>Role</FormLabel>
            <Select
              size="md"
              {...editRegister("role")}
              value={editUserRole}
              onChange={(e) => {
                console.log(e);
                setEditUserRole(e);
              }}
              options={editableRoles.map((option) => ({
                value: option,
                label: option,
              }))}
            />
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
                      size="md"
                      {...addRegister("role", { required: true })}
                      options={editableRoles.map((option) => ({
                        value: option,
                        label: option,
                      }))}
                      value={roleValue}
                      onChange={(option) => {
                        setValue("role", option)
                        handleSelectChange(option)
                      }}
                    />
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
              {/*
              {[ROLES.SUPERADMIN, ROLES.ADMIN].includes(user?.role) ? (
                <Button onClick={tryToUpdateSpace} variant="primary">
                  Sync with Snapshot
                </Button>
              ) : null}
              */}
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
