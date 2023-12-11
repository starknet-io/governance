import { Button, HStack } from "@chakra-ui/react";

export type FilterActionButtonsProps = {
  onClickCancel?: VoidFunction;
  isCancelDisabled?: boolean;
  onClickApply?: VoidFunction;
};

export const FilterActionButtons = (props: FilterActionButtonsProps) => {
  const { onClickApply, onClickCancel, isCancelDisabled } = props;
  return (
    <HStack spacing="standard.sm" justify="flex-end">
      <Button
        size="sm"
        variant="tertiary"
        onClick={onClickCancel}
        isDisabled={isCancelDisabled}
      >
        Cancel
      </Button>
      <Button size="sm" colorScheme="blue" onClick={onClickApply}>
        Save
      </Button>
    </HStack>
  );
};
