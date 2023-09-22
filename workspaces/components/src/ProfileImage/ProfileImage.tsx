import React from "react";
import { ProfileIcon } from "src/Icons";

interface ProfileImageProps {
  imageUrl: string | null | undefined;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ imageUrl }) => {
  return (
    <div
      style={{
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        overflow: "hidden",
        border: "1px solid #333",
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
