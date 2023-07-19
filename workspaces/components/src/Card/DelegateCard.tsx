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
  delegateType: any;
  delegateStatement: string;
  avatarUrl?: string | null;
  ensName?: string | null;
  address?: string | null;
};

export const DelegateCard = (props: Props) => {
  const { id, address, delegateType, delegateStatement, ensName, avatarUrl } =
    props;
  const displayText = (htmlString: string) => {
    return stripHtml(htmlString);
  };

  return (
    <Card as="a" href={`/delegates/profile/${id}`} variant="outline">
      <CardHeader>
        <ProfileSummaryCard.Root>
          <ProfileSummaryCard.Profile
            imgUrl={avatarUrl}
            size="sm"
            address={address}
            ensName={ensName}
            subtitle="7.5m Votes"
            avatarString={address}
          ></ProfileSummaryCard.Profile>
        </ProfileSummaryCard.Root>
      </CardHeader>
      <CardBody>
        <Box display="flex" flexDirection="row" gap="8px" mb="12px">
          {Array.isArray(delegateType) ? (
            <>
              {delegateType[0].length > 20 ? (
                <>
                  <Tag variant="listCard" key={delegateType[0]}>
                    {delegateType[0]}
                  </Tag>
                  {delegateType.length > 1 && (
                    <Tooltip
                      hasArrow
                      shouldWrapChildren
                      placement="top"
                      label={delegateType.slice(1).join(", ")}
                    >
                      <Tag variant="listCard">+{delegateType.length - 1}</Tag>
                    </Tooltip>
                  )}
                </>
              ) : (
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
              )}
            </>
          ) : (
            <></>
          )}
        </Box>
        <Text fontSize="13px" noOfLines={3} color="#6B6B80">
          {displayText(delegateStatement)}
        </Text>
      </CardBody>
      <CardFooter>
        <Box width="100%" display="flex" flexDirection="column" gap="16px">
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
