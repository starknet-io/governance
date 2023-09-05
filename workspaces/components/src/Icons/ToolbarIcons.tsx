import { Icon, IconProps } from "@chakra-ui/react";

type ToolbarIconProps = {
  color?: string;
} & IconProps;

export const BoldIcon = ({ color, ...rest }: ToolbarIconProps) => (
  <Icon viewBox="0 0 20 20" {...rest}>
    <rect width="20" height="20" fill="white" fillOpacity="0.01" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.83203 4.25012C5.41782 4.25012 5.08203 4.58591 5.08203 5.00012V10.0001V15.0001C5.08203 15.4143 5.41782 15.7501 5.83203 15.7501H11.6654C13.4603 15.7501 14.9154 14.295 14.9154 12.5001C14.9154 11.2544 14.2145 10.1723 13.1855 9.62682C13.6792 9.05683 13.9779 8.31336 13.9779 7.50012C13.9779 5.7052 12.5228 4.25012 10.7279 4.25012H5.83203ZM10.7279 9.25012C11.6944 9.25012 12.4779 8.46662 12.4779 7.50012C12.4779 6.53362 11.6944 5.75012 10.7279 5.75012H6.58203V9.25012H10.7279ZM6.58203 10.7501V14.2501H11.6654C12.6319 14.2501 13.4154 13.4666 13.4154 12.5001C13.4154 11.5336 12.6319 10.7501 11.6654 10.7501H10.7279H6.58203Z"
      fill={color ? color : "inherit"}
    />
  </Icon>
);

export const ItalicIcon = ({ color, ...rest }: ToolbarIconProps) => (
  <Icon viewBox="0 0 20 20" {...rest}>
    <g id="wrapper">
      <path
        id="Union"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2881 5.75018L8.16312 14.2502H5.83203C5.41782 14.2502 5.08203 14.586 5.08203 15.0002C5.08203 15.4144 5.41782 15.7502 5.83203 15.7502H8.73302C8.74388 15.7504 8.75471 15.7504 8.7655 15.7502H11.6654C12.0796 15.7502 12.4154 15.4144 12.4154 15.0002C12.4154 14.586 12.0796 14.2502 11.6654 14.2502H9.70928L11.8343 5.75018H14.1654C14.5796 5.75018 14.9154 5.41439 14.9154 5.00018C14.9154 4.58596 14.5796 4.25018 14.1654 4.25018H11.2644C11.2535 4.24994 11.2427 4.24994 11.2319 4.25018H8.33203C7.91782 4.25018 7.58203 4.58596 7.58203 5.00018C7.58203 5.41439 7.91782 5.75018 8.33203 5.75018H10.2881Z"
        fill={color ? color : "inherit"}
      />
    </g>
  </Icon>
);
export const UnderlineIcon = ({ color, ...rest }: ToolbarIconProps) => (
  <Icon viewBox="0 0 20 20" {...rest}>
    <g id="wrapper">
      <path
        id="Union"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.41536 5.00012C7.41536 4.58591 7.07958 4.25012 6.66536 4.25012C6.25115 4.25012 5.91536 4.58591 5.91536 5.00012V10.0001C5.91536 12.2553 7.74353 14.0835 9.9987 14.0835C12.2539 14.0835 14.082 12.2553 14.082 10.0001V5.00012C14.082 4.58591 13.7462 4.25012 13.332 4.25012C12.9178 4.25012 12.582 4.58591 12.582 5.00012V10.0001C12.582 11.4269 11.4254 12.5835 9.9987 12.5835C8.57196 12.5835 7.41536 11.4269 7.41536 10.0001V5.00012ZM5.83203 15.0835C5.41782 15.0835 5.08203 15.4192 5.08203 15.8335C5.08203 16.2477 5.41782 16.5835 5.83203 16.5835H14.1654C14.5796 16.5835 14.9154 16.2477 14.9154 15.8335C14.9154 15.4192 14.5796 15.0835 14.1654 15.0835H5.83203Z"
        fill={color ? color : "inherit"}
      />
    </g>
  </Icon>
);
export const StrikeThroughIcon = ({ color, ...rest }: ToolbarIconProps) => (
  <Icon viewBox="0 0 20 20" {...rest}>
    <g id="wrapper">
      <path
        id="Union"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.16797 4.25012C7.37304 4.25012 5.91797 5.7052 5.91797 7.50012H7.41797C7.41797 6.53362 8.20147 5.75012 9.16797 5.75012H13.3346C13.7488 5.75012 14.0846 5.41434 14.0846 5.00012C14.0846 4.58591 13.7488 4.25012 13.3346 4.25012H9.16797ZM3.41797 10.0001C3.41797 9.58591 3.75376 9.25012 4.16797 9.25012H15.8346C16.2488 9.25012 16.5846 9.58591 16.5846 10.0001C16.5846 10.4143 16.2488 10.7501 15.8346 10.7501H4.16797C3.75376 10.7501 3.41797 10.4143 3.41797 10.0001ZM14.918 12.5001C14.918 14.295 13.4629 15.7501 11.668 15.7501H6.66797C6.25376 15.7501 5.91797 15.4143 5.91797 15.0001C5.91797 14.5859 6.25376 14.2501 6.66797 14.2501H11.668C12.6345 14.2501 13.418 13.4666 13.418 12.5001H14.918Z"
        fill={color ? color : "inherit"}
      />
    </g>
  </Icon>
);
export const Heading2Icon = ({ color, ...rest }: ToolbarIconProps) => (
  <Icon viewBox="0 0 20 20" {...rest}>
    <path
      fill={color ? color : "inherit"}
      d="M4.16797 4.25C4.58218 4.25 4.91797 4.58579 4.91797 5V9.25H10.0846V5C10.0846 4.58579 10.4204 4.25 10.8346 4.25C11.2488 4.25 11.5846 4.58579 11.5846 5V10V15C11.5846 15.4142 11.2488 15.75 10.8346 15.75C10.4204 15.75 10.0846 15.4142 10.0846 15V10.75H4.91797V15C4.91797 15.4142 4.58218 15.75 4.16797 15.75C3.75376 15.75 3.41797 15.4142 3.41797 15V10V5C3.41797 4.58579 3.75376 4.25 4.16797 4.25ZM15.0013 11.5833C14.9553 11.5833 14.918 11.6206 14.918 11.6667C14.918 12.0809 14.5822 12.4167 14.168 12.4167C13.7538 12.4167 13.418 12.0809 13.418 11.6667C13.418 10.7922 14.1269 10.0833 15.0013 10.0833H15.5134C16.2769 10.0833 16.9547 10.5719 17.1962 11.2962L16.4847 11.5334L17.1962 11.2962C17.3932 11.8873 17.2657 12.5385 16.8602 13.0116L15.7986 14.25H16.668C17.0822 14.25 17.418 14.5858 17.418 15C17.418 15.4142 17.0822 15.75 16.668 15.75H14.168C13.8751 15.75 13.609 15.5795 13.4866 15.3134C13.3642 15.0473 13.4079 14.7343 13.5985 14.5119L15.7213 12.0354C15.7839 11.9623 15.8036 11.8618 15.7731 11.7706C15.7359 11.6588 15.6312 11.5833 15.5134 11.5833H15.0013Z"
    />
  </Icon>
);
export const NumberedListIcon = ({ color, ...rest }: ToolbarIconProps) => (
  <Icon viewBox="0 0 20 20" {...rest}>
    <path
      fill={color ? color : "inherit"}
      d="M4.66072 2.64061C4.94098 2.75669 5.12371 3.03017 5.12371 3.33352V6.75018H5.41538C5.82959 6.75018 6.16538 7.08597 6.16538 7.50018C6.16538 7.9144 5.82959 8.25018 5.41538 8.25018H4.37371H3.33204C2.91783 8.25018 2.58204 7.9144 2.58204 7.50018C2.58204 7.08597 2.91783 6.75018 3.33204 6.75018H3.62371V5.06636C3.35093 5.18136 3.02394 5.12774 2.80171 4.90551C2.50882 4.61262 2.50882 4.13775 2.80171 3.84485L3.84338 2.80319C4.05788 2.58869 4.38047 2.52452 4.66072 2.64061ZM8.41538 3.33352C8.41538 2.9193 8.75116 2.58352 9.16538 2.58352H16.6654C17.0796 2.58352 17.4154 2.9193 17.4154 3.33352C17.4154 3.74773 17.0796 4.08352 16.6654 4.08352H9.16538C8.75116 4.08352 8.41538 3.74773 8.41538 3.33352ZM8.54038 7.50018C8.54038 7.08597 8.87616 6.75018 9.29038 6.75018H16.6654C17.0796 6.75018 17.4154 7.08597 17.4154 7.50018C17.4154 7.9144 17.0796 8.25018 16.6654 8.25018H9.29038C8.87616 8.25018 8.54038 7.9144 8.54038 7.50018ZM4.16538 12.4169C4.11935 12.4169 4.08204 12.4542 4.08204 12.5002C4.08204 12.9144 3.74626 13.2502 3.33204 13.2502C2.91783 13.2502 2.58204 12.9144 2.58204 12.5002C2.58204 11.6257 3.29092 10.9169 4.16538 10.9169H4.67746C5.44095 10.9169 6.11879 11.4054 6.36022 12.1298C6.55725 12.7209 6.4297 13.372 6.02421 13.8451L4.96269 15.0835H5.83204C6.24626 15.0835 6.58204 15.4193 6.58204 15.8335C6.58204 16.2477 6.24626 16.5835 5.83204 16.5835H3.33204C3.03915 16.5835 2.77305 16.413 2.65066 16.1469C2.52827 15.8808 2.57198 15.5678 2.7626 15.3454L4.88532 12.8689L5.45477 13.357L4.88532 12.8689C4.94792 12.7959 4.96761 12.6953 4.9372 12.6041C4.89992 12.4923 4.79529 12.4169 4.67744 12.4169H4.16538ZM8.41538 11.6669C8.41538 11.2526 8.75116 10.9169 9.16538 10.9169H16.6654C17.0796 10.9169 17.4154 11.2526 17.4154 11.6669C17.4154 12.0811 17.0796 12.4169 16.6654 12.4169H9.16538C8.75116 12.4169 8.41538 12.0811 8.41538 11.6669ZM8.54038 15.8335C8.54038 15.4193 8.87616 15.0835 9.29038 15.0835H16.6654C17.0796 15.0835 17.4154 15.4193 17.4154 15.8335C17.4154 16.2477 17.0796 16.5835 16.6654 16.5835H9.29038C8.87616 16.5835 8.54038 16.2477 8.54038 15.8335Z"
    />
  </Icon>
);
export const BulletedListIcon = ({ color, ...rest }: ToolbarIconProps) => (
  <Icon viewBox="0 0 20 20" {...rest}>
    <rect width="20" height="20" fill="white" fillOpacity="0.01" />
    <path
      d="M3.33203 3.41675C2.91782 3.41675 2.58203 3.75253 2.58203 4.16675C2.58203 4.58096 2.91782 4.91675 3.33203 4.91675H3.7487C4.16291 4.91675 4.4987 4.58096 4.4987 4.16675C4.4987 3.75253 4.16291 3.41675 3.7487 3.41675H3.33203ZM6.66537 3.41675C6.25116 3.41675 5.91537 3.75253 5.91537 4.16675C5.91537 4.58096 6.25116 4.91675 6.66537 4.91675H16.6654C17.0796 4.91675 17.4154 4.58096 17.4154 4.16675C17.4154 3.75253 17.0796 3.41675 16.6654 3.41675H6.66537ZM5.91537 10.0001C5.91537 9.58587 6.25116 9.25008 6.66537 9.25008H16.6654C17.0796 9.25008 17.4154 9.58587 17.4154 10.0001C17.4154 10.4143 17.0796 10.7501 16.6654 10.7501H6.66537C6.25116 10.7501 5.91537 10.4143 5.91537 10.0001ZM3.33203 9.25008C2.91782 9.25008 2.58203 9.58587 2.58203 10.0001C2.58203 10.4143 2.91782 10.7501 3.33203 10.7501H3.7487C4.16291 10.7501 4.4987 10.4143 4.4987 10.0001C4.4987 9.58587 4.16291 9.25008 3.7487 9.25008H3.33203ZM5.91537 15.8334C5.91537 15.4192 6.25116 15.0834 6.66537 15.0834H16.6654C17.0796 15.0834 17.4154 15.4192 17.4154 15.8334C17.4154 16.2476 17.0796 16.5834 16.6654 16.5834H6.66537C6.25116 16.5834 5.91537 16.2476 5.91537 15.8334ZM3.33203 15.0834C2.91782 15.0834 2.58203 15.4192 2.58203 15.8334C2.58203 16.2476 2.91782 16.5834 3.33203 16.5834H3.7487C4.16291 16.5834 4.4987 16.2476 4.4987 15.8334C4.4987 15.4192 4.16291 15.0834 3.7487 15.0834H3.33203Z"
      fill={color ? color : "inherit"}
    />
  </Icon>
);
export const ImageIcon = ({ color, ...rest }: ToolbarIconProps) => (
  <Icon viewBox="0 0 20 20" {...rest}>
    <g id="wrapper">
      <path
        id="Union"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.66667 3.25012C4.77969 3.25012 3.25 4.77982 3.25 6.66679V13.3335C3.25 13.3487 3.2501 13.3639 3.2503 13.3791L5.8381 10.7913C6.29132 10.3381 6.90601 10.0835 7.54695 10.0835C8.18789 10.0835 8.80258 10.3381 9.25579 10.7913L9.80098 11.3365L12.0129 9.12462C12.4661 8.6714 13.0808 8.41679 13.7217 8.41679C14.3626 8.41679 14.9773 8.6714 15.4305 9.12462L16.75 10.4441V6.66679C16.75 4.77982 15.2203 3.25012 13.3333 3.25012H6.66667ZM16.75 12.5654L14.3699 10.1853C14.198 10.0134 13.9648 9.91679 13.7217 9.91679C13.4786 9.91679 13.2454 10.0134 13.0735 10.1853L12.5432 9.65495L13.0735 10.1853L10.8616 12.3971L14.8569 16.3924C15.9792 15.8324 16.75 14.6729 16.75 13.3335V12.5654ZM13.0933 16.7501L8.19513 11.8519C8.02322 11.68 7.79006 11.5835 7.54695 11.5835C7.30383 11.5835 7.07067 11.68 6.89876 11.8519L3.70776 15.0429C4.29868 16.0636 5.4025 16.7501 6.66667 16.7501H13.0933ZM1.75 6.66679C1.75 3.95139 3.95127 1.75012 6.66667 1.75012H13.3333C16.0487 1.75012 18.25 3.95139 18.25 6.66679V13.3335C18.25 16.0489 16.0487 18.2501 13.3333 18.2501H6.66667C3.95127 18.2501 1.75 16.0489 1.75 13.3335V6.66679Z"
        fill={color ? color : "inherit"}
      />
    </g>
  </Icon>
);
export const LinkIcon = ({ color, ...rest }: ToolbarIconProps) => (
  <Icon viewBox="0 0 20 20" {...rest}>
    <path
      fill={color ? color : "inherit"}
      d="M6.04167 7C4.50005 7 3.25 8.25005 3.25 9.79167C3.25 11.3333 4.50005 12.5833 6.04167 12.5833H8.00917C8.42338 12.5833 8.75917 12.9191 8.75917 13.3333C8.75917 13.7475 8.42338 14.0833 8.00917 14.0833H6.04167C3.67162 14.0833 1.75 12.1617 1.75 9.79167C1.75 7.42162 3.67162 5.5 6.04167 5.5H8.00917C8.42338 5.5 8.75917 5.83579 8.75917 6.25C8.75917 6.66421 8.42338 7 8.00917 7H6.04167ZM5.91667 10C5.91667 9.58579 6.25245 9.25 6.66667 9.25H13.3333C13.7475 9.25 14.0833 9.58579 14.0833 10C14.0833 10.4142 13.7475 10.75 13.3333 10.75H6.66667C6.25245 10.75 5.91667 10.4142 5.91667 10ZM11.9908 5.5C11.5766 5.5 11.2408 5.83579 11.2408 6.25C11.2408 6.66421 11.5766 7 11.9908 7H13.9583C15.5 7 16.75 8.25005 16.75 9.79167C16.75 11.3333 15.5 12.5833 13.9583 12.5833H11.9908C11.5766 12.5833 11.2408 12.9191 11.2408 13.3333C11.2408 13.7475 11.5766 14.0833 11.9908 14.0833H13.9583C16.3284 14.0833 18.25 12.1617 18.25 9.79167C18.25 7.42162 16.3284 5.5 13.9583 5.5H11.9908Z"
    />
  </Icon>
);
export const BlockQuoteIcon = ({ color, ...rest }: ToolbarIconProps) => (
  <Icon viewBox="0 0 20 20" {...rest}>
    <g id="wrapper">
      <path
        id="Union"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.16797 4.25012C7.37304 4.25012 5.91797 5.7052 5.91797 7.50012H7.41797C7.41797 6.53362 8.20147 5.75012 9.16797 5.75012H13.3346C13.7488 5.75012 14.0846 5.41434 14.0846 5.00012C14.0846 4.58591 13.7488 4.25012 13.3346 4.25012H9.16797ZM3.41797 10.0001C3.41797 9.58591 3.75376 9.25012 4.16797 9.25012H15.8346C16.2488 9.25012 16.5846 9.58591 16.5846 10.0001C16.5846 10.4143 16.2488 10.7501 15.8346 10.7501H4.16797C3.75376 10.7501 3.41797 10.4143 3.41797 10.0001ZM14.918 12.5001C14.918 14.295 13.4629 15.7501 11.668 15.7501H6.66797C6.25376 15.7501 5.91797 15.4143 5.91797 15.0001C5.91797 14.5859 6.25376 14.2501 6.66797 14.2501H11.668C12.6345 14.2501 13.418 13.4666 13.418 12.5001H14.918Z"
        fill={color ? color : "inherit"}
      />
    </g>
  </Icon>
);
