import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";
import React from "react";

const UserAvatar = ({ user }) => {
  return (
    <Avatar>
      {user?.image ? (
        <div className="relative w-full h-full aspect-square">
          <Image
            fill
            src={user.image}
            alt="user profile"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
