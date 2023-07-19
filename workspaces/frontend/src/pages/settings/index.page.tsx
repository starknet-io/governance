import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ContentContainer,
  Flex,
  FormControl,
  FormLabel,
  FormModal,
  Heading,
  HiTrash,
  IconButton,
  Input,
  ListRow,
  Select,
  Stack,
  Text,
  useDisclosure,
} from "@yukilabs/governance-components";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import {
  User,
  userRoleEnum,
} from "@yukilabs/governance-backend/src/db/schema/users";
import { trpc } from "src/utils/trpc";
import { useRef, useState } from "react";
import { HiPencil } from "@yukilabs/governance-components/src/Icons";
import { DocumentProps } from "src/renderer/types";

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
    <ContentContainer>
      <Box
        display="flex"
        flexDirection={{ base: "column", md: "column" }}
        height="100%"
        justifyContent="center"
        flex="1"
        mx="auto"
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
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isDeleteOpen}
          onClose={onCloseDelete}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete User Role
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete this user role?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} variant="ghost" onClick={onCloseDelete}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  color="#D83E2C"
                  onClick={handleDeleteRole}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <Box>
          <Heading variant="h3" mb="24px">
            Roles
          </Heading>
          <form onSubmit={onSubmitAdd}>
            <Stack spacing="32px" direction={{ base: "column" }}>
              <FormControl id="address">
                <FormLabel>Ethereum wallet address</FormLabel>
                <Input
                  variant="primary"
                  placeholder="Address"
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
                <Button type="submit" variant={"solid"} disabled={!isAddValid}>
                  Add
                </Button>
              </Flex>
            </Stack>
          </form>
        </Box>

        <Box>
          <Heading variant="h3" mb="24px">
            Users
          </Heading>
          <ListRow.Container>
            {users.data?.map((data) => (
              <ListRow.Root key={data.id}>
                <Box flex="1">
                  <Text variant="cardBody" noOfLines={1}>
                    {data.address}
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
                    icon={<HiPencil />}
                    variant="ghost"
                    onClick={() => handleEditOpen(data)}
                  />
                  <IconButton
                    aria-label="Delete user role"
                    icon={<HiTrash />}
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
