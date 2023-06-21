import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  Tooltip,
} from "@chakra-ui/react";

import { Text } from "../Text";
import { Tag } from "../Tag";
import { Button } from "../Button";
// import { truncateAddress } from "../utils";
import * as ProfileSummaryCard from "src/ProfileSummaryCard/ProfileSummaryCard";
import { stripHtml } from "src/utils/helpers";

type Props = {
  id: string;
  starknetWalletAddress: string | null;
  delegateType: any;
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

  return (
    <Card as="a" href={`/delegates/profile/${id}`} variant="outline">
      <CardHeader>
        <ProfileSummaryCard.Root>
          <ProfileSummaryCard.Profile
            size="sm"
            address={starknetWalletAddress}
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
            {Array.isArray(delegateType) ? (
              <>
                {delegateType.slice(0, 2).map((item: string) => (
                  <Tag variant="listCard" key={item}>
                    {item}
                  </Tag>
                ))}
                {delegateType.length > 2 && (
                  <Tooltip
                    hasArrow
                    shouldWrapChildren
                    placement="top"
                    label={delegateType.slice(2).join(", ")}
                  >
                    <Tag variant="listCard">+{delegateType.length - 2}</Tag>
                  </Tooltip>
                )}
              </>
            ) : (
              <></>
            )}
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
