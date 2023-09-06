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
} from "@yukilabs/governance-components";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import {
  User,
  userRoleEnum,
} from "@yukilabs/governance-backend/src/db/schema/users";
import { trpc } from "src/utils/trpc";
import { useRef, useState } from "react";

import { DocumentProps } from "src/renderer/types";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";

const userRoleValues = userRoleEnum.enumValues;

export function Page() {
  const {
    handleSubmit: handleAddSubmit,
    register: addRegister,
    formState: { errors: addErrors, isValid: isAddValid },
  } = useForm<RouterInput["users"]["addRoles"]>();

  const {
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

  const onSubmitEdit = handleEditSubmit(async () => {
    try {
      const data = {
        address: selectedUser?.address as string,
        role: selectRef.current?.value as string,
      };
      await addRoles.mutateAsync(data, {
        onSuccess: () => {
          users.refetch();
          onEditClose();
        },
      });
    } catch (error) {
      // Handle error
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
    onEditOpen();
  };

  const handleEditClose = () => {
    setSelectedUser(null);
    onEditClose();
    if (selectRef.current) {
      selectRef.current.value = "user";
    }
  };

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
              {...editRegister("role")}
              defaultValue={selectedUser?.role ?? "user"}
              ref={selectRef}
            >
              {userRoleValues.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            {editErrors.role && <span>This field is required.</span>}
          </FormControl>
        </FormModal>
        <DeletionDialog
          isOpen={isDeleteOpen}
          onClose={onCloseDelete}
          onDelete={handleDeleteRole}
          cancelRef={cancelRef}
          entityName="User Role"
        />
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
                    required: true,
                  })}
                />
                {addErrors.address && <span>This field is required.</span>}
              </FormControl>

              <FormControl id="role">
                <FormLabel>Role</FormLabel>
                <Select
                  size="sm"
                  placeholder="Select"
                  focusBorderColor={"red"}
                  rounded="md"
                  {...addRegister("role", { required: true })}
                >
                  {userRoleValues.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                {addErrors.role && <span>This field is required.</span>}
              </FormControl>
              <Flex justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="primary"
                  isDisabled={!isAddValid}
                >
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
            {users.data?.map((data) => (
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
    </ContentContainer>
  );
}

export const documentProps = {
  title: "Settings",
} satisfies DocumentProps;
