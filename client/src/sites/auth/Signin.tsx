import React, {ReactElement, useCallback, useRef} from "react";
import axios from "axios";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue, useToast,
} from '@chakra-ui/react';
import useAuth from "../../hooks/useAuth";
import jwtDecode from "jwt-decode";
import {AuthContextUser} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";

export default function Signin(): ReactElement {
  const toast = useToast()
  const auth = useAuth()
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const handleSubmit = useCallback(async () => {
      const requestBody = {
        userName: usernameRef.current?.value,
        password: passwordRef.current?.value
      }

      try {
        const result = await axios.post<{ token: string }>("/auth/signin/", requestBody)
        if (result.data.token) toast({
          title: 'Sign in successful.',
          description: "You've successfully logged in.",
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right'
        })

        const token: string = result.data.token;

        localStorage.setItem('reddixAuthToken', token)
        const decoded = jwtDecode<AuthContextUser>(token);
        auth.signin({
          id: decoded.id,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          userName: decoded.userName,
          Profile: decoded.Profile
        }, () => {
          navigate("/dashboard", { replace: true })
        })
        //
      } catch (err) {
        if (err instanceof Error) console.log(err.message)
        if (axios.isAxiosError(err)) toast({
          title: 'Authorization error.',
          description: `${err.response?.data.error}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right'
        })
      }
    }, [usernameRef, passwordRef]);

  return (
    <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
      <Stack align={'center'}>
        <Heading fontSize={'4xl'}>Sign in to your account</Heading>
        <Text fontSize={'lg'} color={'gray.600'}>
          to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
        </Text>
      </Stack>
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'lg'}
        p={8}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Username</FormLabel>
              <Input type="text" ref={usernameRef} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" ref={passwordRef} />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Link color={'blue.400'}>Forgot password?</Link>
              </Stack>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSubmit}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
}
