import React, { useState } from "react";
import {
  Box,
  Input,
  Center,
  Text,
  Flex,
  IconButton,
  useDisclosure,
  Textarea,
  Stack,
} from "@chakra-ui/react";
import { Modal } from "../Modal";
import "./members-list.css";
import { Button } from "#src/Button";
import { TrashIcon, TwitterIcon } from "#src/Icons";
import { truncateAddress } from "#src/utils";
import { Username } from "#src/Username";
import * as ListRow from "#src/ListRow/ListRowGeneric";
import { ethers } from "ethers";
import { FormControlled } from "#src/FormControlled";
import { Link } from "#src/Link";

export type MemberType = {
  address: string;
  name: string | null;
  twitterHandle: string | null;
  miniBio: string | null;
  id: number | null;
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

  console.log(members);

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
      address:
        isValidAddress(member.address) || !member.address
          ? ""
          : "Not a valid Ethereum address",
      twitterHandle: "",
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
      removeUserFromCouncil?.(members[indexToRemove].id);
    }
    setMembers(members.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Add council member"
      >
        <>
            <form>
              <Stack spacing="standard.xl">
                <FormControlled
                  name="name"
                  label="Member name"
                  isRequired
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
                  isRequired={false}
                  name="address"
                  label="Ethereum address"
                  paddingBottom={2}
                  isInvalid={!!formErrors.address}
                  errorMessage={formErrors.address || ""}
                >
                  <Input
                    isRequired={false}
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
                  isRequired
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
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={handleAddMember}
                disabled={
                  !member.address && !member.name && !member.twitterHandle
                }
              >
                Add Member
              </Button>
            </Modal.Footer>
          </>
      </Modal>

      <Box mt="standard.xs">
        {members.length === 0 ? (
          <Center>
            <Text className="empty-state">No members added </Text>
          </Center>
        ) : (
          <Box
            border="1px solid "
            borderColor="border.forms"
            borderRadius="4px"
            overflow={"hidden"}
          >
            {members.map((member, index) => (
              <Box
                key={member.address}
                borderBottom={
                  index !== members.length - 1 ? "1px solid " : "none"
                }
                borderColor="border.forms" //this one here please
              >
                <Flex
                  flexDirection="column"
                  width="100%"
                  bg="surface.forms.default"
                  py="standard.sm"
                >
                  <Flex
                    ml="standard.sm"
                    flex="1"
                    alignItems="center"
                    pr="standard.sm"
                  >
                    <Box>
                      <Username
                        src={null}
                        size="standard"
                        address={`${member.address}`}
                        displayName={
                          member.name ?? truncateAddress(member.address)
                        }
                        isMemberType
                        showTooltip={!member.name}
                        tooltipContent={`${member.address}`}
                      />
                      <Flex ml="22px" pr="standard.sm" mt="2px">
                        <Text
                          ml="standard.sm"
                          color="content.support.default"
                          variant="small"
                        >
                          {member.miniBio}
                        </Text>
                      </Flex>
                    </Box>
                    <Box ml="auto">
                      {member.twitterHandle ? (
                        editMode ? (
                          // In edit mode: Show Flex as Link with Twitter icon and handle
                          <Flex
                            as={Link}
                            alignItems="center"
                            gap="standard.base"
                            href={`https://twitter.com/${member.twitterHandle}`}
                          >
                            <TwitterIcon />
                            <Text
                              color="content.support.default"
                              variant="smallStrong"
                            >
                              {member.twitterHandle}
                            </Text>
                          </Flex>
                        ) : (
                          // Not in edit mode: Show IconButton with Twitter icon
                          <IconButton
                            size="condensed"
                            variant="outline"
                            icon={<TwitterIcon />}
                            aria-label={`Twitter profile of ${member.twitterHandle}`}
                            onClick={() =>
                              window.open(
                                `https://twitter.com/${member.twitterHandle}`,
                                "_blank",
                              )
                            }
                          />
                        )
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
                </Flex>
              </Box>
            ))}
          </Box>
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
