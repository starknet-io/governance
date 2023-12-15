import React, { Suspense, useState, useEffect } from "react";
import { Box, SkeletonCircle } from "@chakra-ui/react";

const AvatarLazy = React.lazy(() => import("yuki-ultra-boring-avatars"));

type Props = {
  address?: string | null;
  size?: number;
};

export const Indenticon = ({ address, size = 60 }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const brandColors = [
    "#3F8CFF",
    "#EC796B",
    "#F6C9CE",
    "#F9E8E8",
    "#A1A1D6",
    "#2F44B2",
    "#90EAC4",
    "#FBF2B1",
    "#E175B1",
    "#C1F3FC",
    "#F9E8E8",
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <SkeletonCircle size={size?.toString() || "60"} />;
  }

  return (
    <Box overflow="hidden" width={`${size}px`} height={`${size}px`}>
      <Suspense fallback={<SkeletonCircle size={size?.toString() || "60"} />}>
        <AvatarLazy
          size={size}
          name={address}
          variant="beam"
          colors={brandColors}
        />
      </Suspense>
    </Box>
  );
};
