import React, {ReactElement} from "react";
import {Flex, useColorModeValue} from "@chakra-ui/react";
import {Outlet} from "react-router-dom";

function AuthLayout(): ReactElement {
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Outlet />
    </Flex>
  );
}


export default AuthLayout;