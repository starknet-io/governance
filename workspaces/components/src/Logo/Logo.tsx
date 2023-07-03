import { Flex } from "@chakra-ui/react";
import { Heading } from "src/Heading";

export const Logo = () => {
  return (
    <Flex
      as="a"
      href="/"
      gap="8px"
      height="88px"
      mt="-34px"
      display="flex"
      alignItems="center"
      paddingLeft="8px"
    >
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.87292e-06 19C1.87292e-06 29.4935 8.50636 38 18.9997 38C29.4931 38 38 29.4935 38 19C38 8.50648 29.4931 0 18.9997 0C8.50636 0 1.87292e-06 8.50648 1.87292e-06 19Z"
          fill="#0C0C4F"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M33.6343 13.6804C33.034 13.0092 32.0971 12.6312 31.1863 12.4762C30.2682 12.3274 29.3056 12.3412 28.3992 12.5022C26.5654 12.8124 24.8994 13.5718 23.4464 14.5085C22.6918 14.9683 22.0483 15.5002 21.3816 16.042C21.0604 16.316 20.7675 16.6078 20.4625 16.8954L19.6291 17.7246C18.7235 18.6712 17.831 19.5334 16.9674 20.248C16.1003 20.9593 15.2896 21.4996 14.4907 21.8769C13.6923 22.2561 12.838 22.4791 11.7244 22.5148C10.6207 22.5538 9.31485 22.3546 7.91803 22.0257C6.51371 21.6984 5.03903 21.2318 3.39111 20.8303C3.96611 22.4255 4.83199 23.8352 5.94368 25.1238C7.0684 26.3901 8.47285 27.5442 10.277 28.3032C12.0552 29.0791 14.2897 29.3575 16.3791 28.9374C18.474 28.5342 20.3124 27.5648 21.7984 26.4437C23.2882 25.311 24.4935 24.0209 25.5096 22.6796C25.7902 22.309 25.9385 22.1016 26.1415 21.812L26.7025 20.9809C27.0924 20.4668 27.4473 19.8815 27.8333 19.3722C28.5899 18.3055 29.3358 17.24 30.2027 16.2584C30.639 15.7605 31.0989 15.2843 31.6421 14.8266C31.913 14.6032 32.2057 14.3846 32.5298 14.1877C32.8589 13.9753 33.2064 13.809 33.6343 13.6804Z"
          fill="url(#paint0_linear_746_37556)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.4751 27.201C26.4751 28.3962 27.4445 29.3656 28.6397 29.3656C29.8348 29.3656 30.803 28.3962 30.803 27.201C30.803 26.0058 29.8348 25.0364 28.6397 25.0364C27.4445 25.0364 26.4751 26.0058 26.4751 27.201Z"
          fill="#EC796B"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M33.6343 13.6804C32.9893 12.0532 31.7905 10.6833 30.1814 9.67255C28.582 8.67286 26.3605 8.16267 24.1593 8.59757C23.0718 8.80789 22.0183 9.21281 21.0937 9.75205C20.1733 10.2891 19.3486 10.9357 18.6346 11.6293C18.2782 11.9772 17.9546 12.3402 17.6332 12.7053L16.8002 13.7674L15.5135 15.4771C13.8731 17.6769 12.1067 20.255 9.20798 21.0189C6.36221 21.7688 5.12796 21.1046 3.39111 20.8302C3.70869 21.6502 4.10208 22.4464 4.63538 23.1469C5.15874 23.8616 5.77692 24.5329 6.54549 25.1083C6.93389 25.3846 7.34395 25.6573 7.79938 25.8887C8.25274 26.1121 8.74165 26.3089 9.26351 26.4569C10.3015 26.7415 11.4702 26.8411 12.6017 26.6881C13.7337 26.537 14.8158 26.1783 15.7616 25.7018C16.7144 25.2298 17.5443 24.655 18.2855 24.0484C19.7587 22.8249 20.9046 21.4731 21.8726 20.1067C22.3595 19.4235 22.8014 18.7274 23.2102 18.0311L23.6912 17.2022C23.8383 16.9599 23.9871 16.7161 24.1381 16.489C24.7477 15.5768 25.3439 14.8453 26.0681 14.2963C26.7823 13.733 27.7766 13.3169 29.1055 13.2202C30.4288 13.1224 31.9565 13.3031 33.6343 13.6804Z"
          fill="#FAFAFA"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.6192 14.5239L11.0882 13.0748C11.1836 12.7801 11.4162 12.5508 11.712 12.4603L13.1681 12.0126C13.3696 11.951 13.3713 11.6666 13.1713 11.6018L11.7218 11.1328C11.4276 11.0375 11.1983 10.8049 11.1073 10.5091L10.6601 9.05294C10.5985 8.85193 10.3142 8.84975 10.2493 9.05022L9.78032 10.4992C9.685 10.7934 9.45239 11.0228 9.1566 11.1137L7.7005 11.561C7.49895 11.6231 7.49677 11.9069 7.69724 11.9717L9.14679 12.4407C9.44095 12.5361 9.67029 12.7692 9.76126 13.065L10.2085 14.5206C10.27 14.7221 10.5544 14.7243 10.6192 14.5239Z"
          fill="#FAFAFA"
        />
        <defs>
          <linearGradient
            id="paint0_linear_746_37556"
            x1="3.40181"
            y1="14.9087"
            x2="57.4978"
            y2="23.9363"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#EC796B" />
            <stop offset="1" stopColor="#D672EF" />
          </linearGradient>
        </defs>
      </svg>

      <Heading fontSize="16px" fontWeight="500" variant="h1" color="#0C0C4F">
        Governance Hub
      </Heading>
    </Flex>
  );
};
