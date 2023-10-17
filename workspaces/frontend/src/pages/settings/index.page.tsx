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
  const [editError, setEditError] = useState("");
  const utils = trpc.useContext();
  const { handleUpload } = useFileUpload();

  const { user } = usePageContext();

  const {
    control,
    handleSubmit: handleEditSubmit,
    register: editRegister,
    formState: { errors: editErrors, isValid: isEditValid },
  } = useForm<RouterInput["users"]["addRoles"]>();
  const cancelRef = useRef(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
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
        role: selectRef.current?.value as string,
        banned: values.banned as boolean,
      };
      await addRoles.mutateAsync(data, {
        onSuccess: () => {
          users.refetch();
          onEditClose();
        },
      });
      setEditError("");
    } catch (error) {
      // Handle error
      setEditError(error?.message || "An error occurred");
      console.log(error);
    }
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDeleteRole = async () => {
    try {
      const data = {
        address: selectedUser?.address as string,
        role: "user",
      };
      await addRoles.mutateAsync(data, {
        onSuccess: () => {
          users.refetch();
          onCloseDelete();
          setSelectedUser(null);
        },
      });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  const handleDeleteOpen = (user: User) => {
    setSelectedUser(user);
    onOpenDelete();
  };

  const handleEditOpen = (user: User) => {
    setSelectedUser(user);
    setEditError("")
    onEditOpen();
  };

  const handleEditClose = () => {
    setSelectedUser(null);
    onEditClose();
    setEditError("")
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

  const usersList = users?.data || [];
  const sortedUsersList = useMemo(() => {
    return (users?.data || []).sort((a, b) => {
      const aValue = a.banned ? 1 : 0;
      const bValue = b.banned ? 1 : 0;
      return aValue - bValue;
    });
  }, [users?.data]);

  return (
    <ContentContainer maxWidth="800" center>
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
          isValid={isEditValid}
        >
          <FormControl id="editRole">
            <FormLabel>Role</FormLabel>
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
              defaultValue={selectedUser?.role ?? "user"}
            />
            <FormControl id="banned" mt={5}>
              <Controller
                control={control}
                name="banned"
                defaultValue={!!selectedUser?.banned}
                rules={{ required: false }}
                render={({ field }) => (
                  <Checkbox
                    isChecked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    Ban User
                  </Checkbox>
                )}
              />
            </FormControl>
            {editErrors.role && <span>This field is required.</span>}
          </FormControl>
          {editError && editError.length && (
            <Box mt={4}>
              <Banner label={editError} type="error" variant="error" />
            </Box>
          )}
        </FormModal>
        <DeletionDialog
          isOpen={isDeleteOpen}
          onClose={onCloseDelete}
          onDelete={handleDeleteRole}
          cancelRef={cancelRef}
          entityName="User Role"
        />
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
                      <IconButton
                        aria-label="Edit user role"
                        icon={<PencilIcon />}
                        variant="ghost"
                        onClick={() => handleEditOpen(data)}
                      />
                      <IconButton
                        aria-label="Delete user role"
                        icon={<TrashIcon />}
                        variant="ghost"
                        onClick={() => handleDeleteOpen(data)}
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
