import React, {useEffect} from "react";
import {
  Box,
  Stack, useToast,
} from '@chakra-ui/react';

import HeaderNav from "../components/HeaderNav";
import {useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import jwtDecode from "jwt-decode";
import {AuthContextUser} from "../context/AuthContext";

export default function DashboardLayout() {
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();



  if (!auth.user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <Box h={"100%"}>
      Welcome {auth.user.userName}!{" "}
      <button
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
      >
        Sign out
      </button>
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


