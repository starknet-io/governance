import { HStack } from "@chakra-ui/react";
import { Button } from "#src/Button";

export type FilterActionButtonsProps = {
  onClickCancel?: VoidFunction;
  isCancelDisabled?: boolean;
  onClickApply?: VoidFunction;
};

export const FilterActionButtons = (props: FilterActionButtonsProps) => {
  const { onClickApply, onClickCancel, isCancelDisabled } = props;
  return (
    <HStack spacing="standard.sm" justify="flex-end">
      {!isCancelDisabled ? <Button
        size="condensed"
        variant="ghost"
        onClick={onClickCancel}
        isDisabled={isCancelDisabled}
      >
        Cancel
      </Button> : null}
      <Button size="condensed" colorScheme="blue" onClick={onClickApply}>
        Save
      </Button>
    </HStack>
  );
};
