//TODO: refactor this component
import {
  HStack,
  Icon,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useColorModeValue as mode,
  usePopoverContext,
  Button
} from "@chakra-ui/react";
import { ElementType, ReactNode } from "react";
import {
  Modal
} from "@yukilabs/governance-components";
import {
  FilterActionButtons,
  FilterActionButtonsProps,
} from "./FilterActionButtons";
import useIsMobile from "@yukilabs/governance-frontend/src/hooks/useIsMobile";

import { FiltersIcon } from "src/Icons";
import { IconButtonWithBadge } from "src/IconButton/IconButton";

type FilterPopoverButtonProps = {
  label: string;
  icon?: ElementType;
  selected?: boolean;
  badgeContent?: string | number;
};

export const FilterPopoverButton = (props: FilterPopoverButtonProps) => {
  const { label, icon, selected } = props;

  return (
    <PopoverTrigger>
      <HStack
        justify="space-between"
        position="relative"
        as="button"
        fontSize="sm"
        borderWidth="1px"
        zIndex="11"
        rounded="lg"
        paddingStart="3"
        paddingEnd="2"
        paddingY="1.5"
        spacing="1"
        data-selected={selected || undefined}
        _expanded={{ bg: mode("gray.100", "gray.700") }}
        _selected={{ bg: "blue.50", borderColor: "blue.500" }}
      >
        {icon && <Icon as={icon} boxSize="2" />}
        <Text fontWeight="medium">{label}</Text>
        {/* <Icon as={<></>} fontSize="xl" color="gray.400" /> */}
      </HStack>
    </PopoverTrigger>
  );
};

export const FilterPopoverIcon = (props: FilterPopoverButtonProps) => {
  const { selected, badgeContent } = props;
  const { isMobile } = useIsMobile();
  return (
    <PopoverTrigger>
      <IconButtonWithBadge
        isActive={selected}
        sx={{ position: "relative" }}
        variant="outline"
        size={isMobile ? "withBadgeStandard" : "withBadgeCondensed"}
        badgeContent={badgeContent}
        aria-label="filter by"
        icon={<FiltersIcon />}
      />
    </PopoverTrigger>
  );
};

type FilterPopoverContentProps = FilterActionButtonsProps & {
  header?: string;
  children?: ReactNode;
};

export const FilterPopoverContent = (props: FilterPopoverContentProps) => {
  const isMobile = typeof window !== "undefined" && window?.screen?.width < 567;
  const { header, children, onClickCancel, onClickApply, isCancelDisabled } =
    props;
  const { onClose, isOpen } = usePopoverContext();
  if (isMobile) {
    return (
      <Modal title="Filters" onClose={onClose} isOpen={isOpen}>
        {header && <PopoverHeader srOnly>{header}</PopoverHeader>}
        {children}
        <Modal.Footer>
        {!isCancelDisabled ? <Button
          variant="tertiary"
          onClick={() => {
            onClickCancel?.();
            onClose();
          }}
          isDisabled={isCancelDisabled}
          sx={{
            flex: 1
          }}
        >
          Cancel
        </Button> : null}
        <Button
          colorScheme="blue"
          onClick={() => {
            onClickApply?.();
            onClose();
          }}
          sx={{
            flex: 1
          }}
        >
          Save
        </Button>
        </Modal.Footer>
      </Modal>
    )
  }
  return (
    <PopoverContent
      bg="#fff"
      sx={{ width: "260px" }}
      _focus={{ shadow: "none", outline: 0 }}
      _focusVisible={{ shadow: "outline" }}
    >
      {header && <PopoverHeader srOnly>{header}</PopoverHeader>}
      <PopoverBody padding="0" display="flex" flexDirection="column" gap="standard.xs">{children}</PopoverBody>
      <PopoverFooter sx={{ borderTop: "none", p: 0, mt: "standard.xs" }}>
        <FilterActionButtons
          onClickCancel={() => {
            onClickCancel?.();
            onClose();
          }}
          isCancelDisabled={isCancelDisabled}
          onClickApply={() => {
            onClickApply?.();
            onClose();
          }}
        />
      </PopoverFooter>
    </PopoverContent>
  );
};
