import {
  Box,
  Button,
  ContentContainer,
  DeletionDialog,
  Flex,
  FormControl,
  FormLabel,
  FormModal,
  Heading,
  IconButton,
  Input,
  ListRow,
  Select,
  Stack,
  Text,
  useDisclosure,
  PencilIcon,
  TrashIcon,
  FileUploader,
  ProfileImage,
  Checkbox,
  Banner,
  InfoModal,
  SuccessIcon,
} from "@yukilabs/governance-components";
import { Controller, useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import {
  User,
  userRoleEnum,
} from "@yukilabs/governance-backend/src/db/schema/users";
import { trpc } from "src/utils/trpc";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { DocumentProps, ROLES } from "src/renderer/types";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";
import { useFileUpload } from "src/hooks/useFileUpload";
import { usePageContext } from "src/renderer/PageContextProvider";
import { hasPermission } from "src/utils/helpers";
import { ethers } from "ethers";
import { Icon, Spinner } from "@chakra-ui/react";
import {BannedIcon, RemovedIcon} from "@yukilabs/governance-components/src/Icons";

const userRoleValues = userRoleEnum.enumValues;

export function Page() {
  const {
    handleSubmit: handleAddSubmit,
    register: addRegister,
    formState: { errors: addErrors, isValid: isAddValid },
  } = useForm<RouterInput["users"]["addRoles"]>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  const editUser = trpc.users.editUser.useMutation();
  const banUser = trpc.users.banUser.useMutation();
  const [isBanUserLoading, setBanUserLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const utils = trpc.useContext();
  const { handleUpload } = useFileUpload();

  const { user } = usePageContext();

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
  const users = trpc.users.getAll.useQuery();

  useEffect(() => {
    if (!imageChanged) {
      setImageUrl(user?.profileImage ?? null);
    }
  }, [user, imageChanged]);

  const onSubmitAdd = handleAddSubmit(async (data) => {
    try {
      await addRoles.mutateAsync(data, {
        onSuccess: () => {
          users.refetch();
        },
      });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  });

  const onSubmitEdit = handleEditSubmit(async (values) => {
    try {
      const data = {
        address: selectedUser?.address as string,
        role: (values?.role?.value || selectedUser?.role || "user") as string,
      };
      console.log(data);
      await addRoles.mutateAsync(data, {
        onSuccess: () => {
          users.refetch();
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
    setEditValue("role", {
      label: user.role,
      value: user.role,
    });
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

  const handleSave = () => {
    if (!user) return;
    editUser.mutateAsync(
      {
        id: user.id,
        profileImage: imageUrl ?? "none",
      },
      {
        onSuccess: () => {
          utils.auth.currentUser.invalidate();
        },
      },
    );
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
        admin: 0,
        moderator: 1,
        // Assuming other roles are less prioritized
        other: 2,
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

  return (
    <ContentContainer maxWidth="800" center>
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
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  size="sm"
                  focusBorderColor={"red"}
                  rounded="md"
                  options={userRoleValues.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                  {...editRegister("role")}
                  ref={selectRef}
                  value={field.value as any}
                  onChange={(values) => field.onChange(values)}
                  defaultValue={{
                    label: selectedUser?.role || "user",
                    value: selectedUser?.role,
                  }}
                />
              )}
            />
          </FormControl>
          {editError && editError.length && (
            <Box mt={4}>
              <Banner label={editError} type="error" variant="error" />
            </Box>
          )}
        </FormModal>
        <Box>
          <Box>
            <Heading variant="h3" mb="24px" fontSize="28px">
              Profile
            </Heading>
            <Box
              mb="24px"
              display={"flex"}
              flexDirection={"row"}
              alignItems="center"
            >
              <ProfileImage imageUrl={imageUrl} />
              <Box ml="16px">
                <Box display={"flex"} flexDirection={"row"}>
                  <FileUploader
                    handleUpload={handleUpload}
                    onImageUploaded={(imageUrl) => {
                      setImageUrl(imageUrl);
                    }}
                  />
                  <Button
                    variant={"ghost"}
                    ml="16px"
                    onClick={() => {
                      setImageUrl(null);
                      setImageChanged(true);
                    }}
                  >
                    <Text>Remove</Text>
                  </Button>
                </Box>
                <Box>
                  <Text variant="small" color={"#86848D"}>
                    We support PNGs, JPEGs and GIFs under 10MB
                  </Text>
                </Box>
              </Box>
            </Box>
            <Flex justifyContent="flex-end">
              <Button onClick={handleSave} variant="primary">
                Save changes
              </Button>
            </Flex>
          </Box>
        </Box>
        {!hasPermission(user?.role, [ROLES.ADMIN, ROLES.MODERATOR]) ? (
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
                      placeholder="Select"
                      focusBorderColor={"red"}
                      rounded="md"
                      options={userRoleValues.map((option) => ({
                        label: option,
                        value: option,
                      }))}
                      {...addRegister("role", { required: true })}
                    />
                    {addErrors.role && <span>This field is required.</span>}
                  </FormControl>
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
                      {data.role !== "moderator" && data.role !== "admin" ? (
                        <IconButton
                          aria-label="Delete user role"
                          icon={<RemovedIcon />}
                          variant="ghost"
                          onClick={() => handleBanUser(data)}
                        />
                      ) : (
                        <IconButton variant="ghost" disabled icon={null} />
                      )}
                      <IconButton
                        aria-label="Edit user role"
                        icon={<PencilIcon />}
                        variant="ghost"
                        onClick={() => handleEditOpen(data)}
                      />
                    </Box>
                  </ListRow.Root>
                ))}
              </ListRow.Container>
            </Box>
          </Box>
        )}
      </Box>
    </ContentContainer>
  );
}

export const documentProps = {
  title: "Settings",
} satisfies DocumentProps;
