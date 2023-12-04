import React from "react";
import { useRouter } from "next/navigation";
import ProfileForm from "@/components/molecules/ProfileForm";

const ProfilePage = () => {
  const router = useRouter();

  return <ProfileForm />;
};

export default ProfilePage;
