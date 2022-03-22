import React from "react";
import {
  Box,
  Stack, useColorModeValue
} from '@chakra-ui/react';
import HeaderNav from "../components/HeaderNav";
import {Outlet} from "react-router-dom";
import useAuth from "../hooks/useAuth";


export default function DashboardLayout() {
  const auth = useAuth();
  if (!auth.user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <Box h={"100%"} bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack h={"100%"}>
        <Box>
          <HeaderNav />
        </Box>
        <Box h="100%">
          <Outlet />
        </Box>
      </Stack>
    </Box>
  );
}


