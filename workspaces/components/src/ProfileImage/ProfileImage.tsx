import React from "react";
import { ProfileIcon } from "..//Icons";

interface ProfileImageProps {
  imageUrl: string | null | undefined;
  size?: "small" | "medium" | "large";
}

const sizeStyles = {
  small: {
    width: "40px",
    height: "40px",
  },
  medium: {
    width: "78px",
    height: "78px",
  },
  large: {
    width: "150px",
    height: "150px",
  },
  default: {
    width: "100px",
    height: "100px",
  },
};

export const ProfileImage: React.FC<ProfileImageProps> = ({
  imageUrl,
  size,
}) => {
  const { width, height } = sizeStyles[size || "default"];

  return (
    <div
      style={{
        width: width,
        height: height,
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Profile"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <ProfileIcon />
      )}
    </div>
  );
};
