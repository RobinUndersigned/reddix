import React from "react";
import {
  Box,
  Stack
} from '@chakra-ui/react';
import HeaderNav from "../components/HeaderNav";
import useAuth from "../hooks/useAuth";


export default function DashboardLayout() {
  const auth = useAuth();
  if (!auth.user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <Box h={"100%"}>
      <Stack h={"100%"}>
        <Box>
          <HeaderNav />
        </Box>
        <Box h={"100%"}>
          Test
        </Box>
      </Stack>
    </Box>
  );
}


