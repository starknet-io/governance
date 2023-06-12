import { Card, CardHeader, CardBody, CardFooter, Box } from "@chakra-ui/react";

import { Text } from "../Text";
import { Tag } from "../Tag";
import { Button } from "../Button";
import { truncateAddress } from "../utils";
import * as ProfileSummaryCard from "src/ProfileSummaryCard/ProfileSummaryCard";
import { stripHtml } from "src/utils/helpers";

type Props = {
  id: string;
  starknetWalletAddress: string | null;
  delegateType: string | null;
  delegateStatement: string;
  avatarUrl?: string | null;
  address?: string | null;
  userId?: string | null;
};

export const DelegateCard = (props: Props) => {
  const { id, userId, starknetWalletAddress, delegateType, delegateStatement } =
    props;
  const displayText = (htmlString: string) => {
    return stripHtml(htmlString);
  };
  const addressToDisplay = starknetWalletAddress
    ? truncateAddress(starknetWalletAddress)
    : "";
  const fakeEthAddress = `${starknetWalletAddress?.slice(0, 5)}.eth`;
  console.log("USERID", userId);
  return (
    <Card as="a" href={`/delegates/profile/${id}`} variant="outline">
      <CardHeader>
        <ProfileSummaryCard.Root>
          <ProfileSummaryCard.Profile
            size="sm"
            address={starknetWalletAddress}
            ethAddress={fakeEthAddress}
            subtitle="7.5m Votes"
            avatarString={userId}
          ></ProfileSummaryCard.Profile>
        </ProfileSummaryCard.Root>
      </CardHeader>
      <CardBody>
        <Text fontSize="13px" noOfLines={3} color="#6B6B80">
          {displayText(delegateStatement)}
        </Text>
      </CardBody>
      <CardFooter>
        <Box width="100%" display="flex" flexDirection="column" gap="16px">
          <Box display="flex" flexDirection="row" gap="16px">
            <Tag variant="primary">{delegateType}</Tag>
          </Box>
          <Box>
            <Button variant="outline" onClick={() => console.log("clicked")}>
              Delegate
            </Button>
          </Box>
        </Box>
      </CardFooter>
    </Card>
  );
};
