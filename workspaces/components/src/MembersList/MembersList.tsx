import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  ListItem,
  UnorderedList,
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
} from "@chakra-ui/react";
import { HiTrash } from "react-icons/hi2";
import "./members-list.css";

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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setMember({ ...member, [event.target.name]: event.target.value });
  };

  const handleAddMember = () => {
    setMembers([...members, member]);
    setMember({ address: "", name: "", twitterHandle: "", miniBio: "" });
    onClose();
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
              <FormControl id="member-name" paddingBottom={2}>
                <FormLabel>Member name</FormLabel>
                <Input
                  placeholder="Name"
                  name="name"
                  value={member.name ?? ""}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="address" paddingBottom={2}>
                <FormLabel>Ethereum address</FormLabel>
                <Input
                  placeholder="0x..."
                  name="address"
                  value={member.address ?? ""}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="member-twitter-handle" paddingBottom={2}>
                <FormLabel>Twitter handle</FormLabel>
                <Input
                  placeholder="@name"
                  name="twitterHandle"
                  value={member.twitterHandle ?? ""}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="member-mini-bio" paddingBottom={2}>
                <FormLabel>Mini Bio</FormLabel>
                <Textarea
                  placeholder="Background, company, expertise etc"
                  name="miniBio"
                  value={member.miniBio ?? ""}
                  onChange={handleInputChange}
                />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleAddMember}>Add Member</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box className="members-list" mt={4} borderRadius="md" p={4}>
        {members.length === 0 ? (
          <Center>
            <Text className="empty-state">No members added </Text>
          </Center>
        ) : (
          <UnorderedList styleType="none">
            {members.map((member, index) => (
              <ListItem className="list-item" key={index}>
                <Flex justify="space-between" align="center">
                  <VStack align="start">
                    <Flex height="20px">
                      <Text fontSize="14px" lineHeight="22px">
                        {member.name}
                      </Text>
                      <Text>
                        <span>&nbsp;</span>
                        <span style={{ fontWeight: "bold" }}>&bull;</span>
                        <span>&nbsp;</span>
                      </Text>
                      <Text
                        fontSize="14px"
                        lineHeight="22px"
                        textDecoration="underline"
                      >
                        @{member.twitterHandle}
                      </Text>
                    </Flex>
                    <Flex>
                      <Text fontSize="12px" lineHeight="18px" color="#6F6E77">
                        {member.miniBio}
                      </Text>
                    </Flex>
                  </VStack>
                  {readonly ? null : (
                    <IconButton
                      aria-label="Delete member"
                      icon={<HiTrash />}
                      variant="ghost"
                      onClick={() => handleRemoveMember(index)}
                    />
                  )}
                </Flex>
              </ListItem>
            ))}
          </UnorderedList>
        )}
      </Box>
      {readonly ? null : (
        <Flex justifyContent="flex-end" marginTop={"10px"}>
          <Button
            onClick={onOpen}
            variant="ghost"
            border="1px solid #E4E5E7"
            color="#6C6C75"
          >
            Add Member
          </Button>
        </Flex>
      )}
    </Box>
  );
};
