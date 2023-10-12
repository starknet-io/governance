import React, { useState } from "react";
import {
  Box,
  Input,
  Center,
  Text,
  Flex,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  FormLabel,
  FormControl,
  Stack,
} from "@chakra-ui/react";
import "./members-list.css";
import { Button } from "src/Button";
import { TrashIcon, TwitterIcon } from "src/Icons";
import { truncateAddress } from "src/utils";
import { Username } from "src/Username";
import * as ListRow from "src/ListRow/ListRowGeneric";
import { ethers } from "ethers";
import { FormControlled } from "src/FormControlled";

export type MemberType = {
  address: string;
  name: string | null;
  twitterHandle: string | null;
  miniBio: string | null;
};

type MembersListProps = {
  members: MemberType[];
  setMembers: React.Dispatch<React.SetStateAction<MemberType[]>>;
  editMode?: boolean;
  removeUserFromCouncil?: (address: string) => void;
  readonly?: boolean;
};

export const MembersList: React.FC<MembersListProps> = ({
  members,
  setMembers,
  editMode = false,
  removeUserFromCouncil,
  readonly = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [member, setMember] = useState<MemberType>({
    address: "",
    name: "",
    twitterHandle: "",
    miniBio: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    address: "",
    twitterHandle: "",
    miniBio: "",
  });

  const isValidAddress = (address: string) => {
    try {
      const checksumAddress = ethers.utils.getAddress(address);
      return ethers.utils.isAddress(checksumAddress);
    } catch (error) {
      return false;
    }
  };

  const validateForm = () => {
    let errors = {
      name: member.name ? "" : "Add member name",
      address: member.address
        ? isValidAddress(member.address)
          ? ""
          : "Not a valid Ethereum address"
        : "Add Ethereum address",
      twitterHandle: member.twitterHandle ? "" : "Twitter handle is required.",
      miniBio: member.miniBio ? "" : "Add a mini bio for council member",
    };

    setFormErrors(errors);

    // Only proceed if there are no errors
    return !Object.values(errors).some((error) => error);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setMember({ ...member, [event.target.name]: event.target.value });
  };

  const handleAddMember = () => {
    if (validateForm()) {
      setMembers([...members, member]);
      setMember({ address: "", name: "", twitterHandle: "", miniBio: "" });
      onClose();
    }
  };

  const handleRemoveMember = (indexToRemove: number) => {
    if (editMode) {
      removeUserFromCouncil?.(members[indexToRemove].address);
    }
    setMembers(members.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="center">
            Add council member
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <form>
              <Stack spacing="standard.xl">
                <FormControlled
                  name="name"
                  label="Member name"
                  paddingBottom={2}
                  isInvalid={!!formErrors.name}
                  errorMessage={formErrors.name || ""}
                >
                  <Input
                    placeholder="Name"
                    name="name"
                    value={member.name ?? ""}
                    onChange={handleInputChange}
                  />
                </FormControlled>

                <FormControlled
                  name="address"
                  label="Ethereum address"
                  paddingBottom={2}
                  isInvalid={!!formErrors.address}
                  errorMessage={formErrors.address || ""}
                >
                  <Input
                    placeholder="0x..."
                    name="address"
                    value={member.address ?? ""}
                    onChange={handleInputChange}
                  />
                </FormControlled>
                <FormControlled
                  name="twitterHandle"
                  label="Twitter handle"
                  paddingBottom={2}
                  isInvalid={!!formErrors.twitterHandle}
                  errorMessage={formErrors.twitterHandle || ""}
                >
                  <Input
                    placeholder="@name"
                    name="twitterHandle"
                    value={member.twitterHandle ?? ""}
                    onChange={handleInputChange}
                  />
                </FormControlled>
                <FormControlled
                  name="miniBio"
                  label="Mini Bio"
                  paddingBottom={2}
                  isInvalid={!!formErrors.miniBio}
                  errorMessage={formErrors.miniBio || ""}
                >
                  <Textarea
                    placeholder="Background, company, expertise etc"
                    name="miniBio"
                    value={member.miniBio ?? ""}
                    onChange={handleInputChange}
                  />
                </FormControlled>
              </Stack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="primary"
              onClick={handleAddMember}
              disabled={
                !member.address && !member.name && !member.twitterHandle
              }
            >
              Add Member
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box p={4}>
        {members.length === 0 ? (
          <Center>
            <Text className="empty-state">No members added </Text>
          </Center>
        ) : (
          <ListRow.Container>
            {members.map((member, index) => (
              <ListRow.Root key={member.address}>
                <Flex flexDirection="column" width="100%">
                  <Flex ml="standard.sm" flex="1" alignItems="center" mb="6px">
                    <Box>
                      <Username
                        src={null}
                        size="standard"
                        address={`${member.address}`}
                        displayName={
                          member.name ?? truncateAddress(member.address)
                        }
                      />
                    </Box>
                    <Box ml="auto">
                      {member.twitterHandle ? (
                        <Flex alignItems="center" gap="standard.base">
                          <TwitterIcon />
                          <Text
                            color="content.support.default"
                            variant="smallStrong"
                          >
                            {member.twitterHandle}
                          </Text>
                        </Flex>
                      ) : null}
                    </Box>
                    {readonly ? null : (
                      <Box ml="auto">
                        <IconButton
                          aria-label="Delete member"
                          icon={<TrashIcon cursor={"pointer"} />}
                          variant="simple"
                          onClick={() => handleRemoveMember(index)}
                        />
                      </Box>
                    )}
                  </Flex>
                  <Flex ml="standard.2xl">
                    <Text
                      ml="standard.sm"
                      color="content.support.default"
                      variant="small"
                    >
                      {member.miniBio}
                    </Text>
                  </Flex>
                </Flex>
              </ListRow.Root>
            ))}
          </ListRow.Container>
        )}
      </Box>
      {readonly ? null : (
        <Flex justifyContent="flex-end" marginTop={"10px"}>
          <Button onClick={onOpen} variant="outline">
            Add Member
          </Button>
        </Flex>
      )}
    </Box>
  );
};
