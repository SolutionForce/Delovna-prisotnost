import React from "react";
import { auth } from "../../services/api/firebaseConfig";
import { signOut } from "firebase/auth";
import { Button } from "tamagui";
import Colors from "../Colors/Colors";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Optionally, perform any other cleanup or navigation logic after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Button
      scaleIcon={1.2}
      marginHorizontal="$2"
      theme="active"
      onPress={handleLogout}
      backgroundColor={Colors.PURPLE}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
