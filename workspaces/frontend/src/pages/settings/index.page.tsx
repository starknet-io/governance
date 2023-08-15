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
import { useEffect, useRef, useState } from "react";

import { DocumentProps } from "src/renderer/types";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";

import { Web3Provider } from "@ethersproject/providers";
import snapshot from "@snapshot-labs/snapshot.js";
import { useQuery } from "@apollo/client";
import { gql } from "src/gql";
import { isValidEthereumAddress } from "src/utils/helpers";

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

type FormValues = {
  address: string;
  role: string;
};

export function Page() {
  const {
    register: addRegister,
    handleSubmit: handleAddSubmit,
    watch,
    formState: { errors: addErrors },
  } = useForm<FormValues>();

  const watchedAddress = watch("address", "");

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

  const { data: space } = useQuery(GET_SPACE_QUERY, {
    variables: {
      space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
    },
  });

  const addRoles = trpc.users.addRoles.useMutation();
  const users = trpc.users.getAll.useQuery();
  const admins = trpc.users.getUsersByRole.useQuery({
    role: "admin",
  });
  const moderators = trpc.users.getUsersByRole.useQuery({
    role: "moderator",
  });
  const members = trpc.users.getUsersByRole.useQuery({
    role: "user",
  });

  const [isAddressValid, setIsAddressValid] = useState(false);

  useEffect(() => {
    if (watchedAddress) {
      setIsAddressValid(isValidEthereumAddress(watchedAddress));
    } else {
      setIsAddressValid(false);
    }
  }, [watchedAddress]);

  const onSubmitAdd = handleAddSubmit(async (data) => {
    try {
      await addRoles.mutateAsync(data, {
        onSuccess: () => {
          users.refetch();
          updateSpace();
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
          updateSpace();
        },
      });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  });

  const updateSpace = async () => {
    try {
      const web3 = new Web3Provider(window.ethereum);
      const [account] = await web3.listAccounts();
      const client = new snapshot.Client712(
        import.meta.env.VITE_APP_SNAPSHOT_URL,
      );
      let membersRefreshed: any = [];
      await members.refetch().then((res) => {
        membersRefreshed = res.data;
      });

      let adminsRefreshed: any = [];
      await admins.refetch().then((res) => {
        adminsRefreshed = res.data;
      });

      let moderatorsRefreshed: any = [];
      await moderators.refetch().then((res) => {
        moderatorsRefreshed = res.data;
      });

      let settings = space?.space || {};
      settings = {
        ...settings,
        admins: updateArrayWithDiff(settings.admins || [], adminsRefreshed),
        moderators: updateArrayWithDiff(
          settings.moderators || [],
          moderatorsRefreshed,
        ),
        members: updateArrayWithDiff(
          settings.members || [],
          membersRefreshed ?? [],
        ),
      };
      const cleanedSettings = removeTypename(settings);
      await client.space(web3, account, {
        space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
        settings: JSON.stringify(cleanedSettings),
      });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  function updateArrayWithDiff(
    array1: (string | null)[],
    array2: string[],
  ): string[] {
    const resultSet = new Set<string>();
    const lowercaseSet = new Set<string>();

    // Process array1
    for (const item of array1) {
      if (item !== null) {
        const lowercaseItem = item.toLowerCase();
        if (!lowercaseSet.has(lowercaseItem)) {
          resultSet.add(item);
          lowercaseSet.add(lowercaseItem);
        }
      }
    }

    // Process array2
    for (const item of array2) {
      const lowercaseItem = item.toLowerCase();
      if (!lowercaseSet.has(lowercaseItem)) {
        resultSet.add(item);
        lowercaseSet.add(lowercaseItem);
      }
    }

    return [...resultSet];
  }

  function removeTypename<T>(obj: T): T {
    if (Array.isArray(obj)) {
      return obj.map((item) => removeTypename(item)) as any;
    } else if (obj !== null && typeof obj === "object") {
      const newObj: Record<string, unknown> = {};
      for (const key in obj) {
        if (key !== "__typename") {
          newObj[key] = removeTypename((obj as Record<string, unknown>)[key]);
        }
      }
      return newObj as T;
    }
    return obj as T;
  }

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
                  style={
                    isAddressValid || watchedAddress === ""
                      ? {}
                      : { borderColor: "red" }
                  }
                  variant="primary"
                  placeholder="Add address..."
                  {...addRegister("address", {
                    required: true,
                  })}
                />
                {!isAddressValid && watchedAddress !== "" && (
                  <span>Invalid Ethereum address.</span>
                )}
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
                  variant={"solid"}
                  disabled={!isAddressValid}
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
