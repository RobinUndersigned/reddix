import React from 'react';
import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import {Subreddix} from "../../interfaces/Subreddix";

export default function SubreddixCard({...props}: Subreddix) {
  return (
    <Box
      maxW={'320px'}
      position="sticky"
      w={'full'}
      bg={useColorModeValue('white', 'gray.900')}
      rounded={'lg'}
      p={6}
      border='1px' borderColor='gray.200'
      textAlign={'center'}>
      <Avatar
        size={'xl'}
        src={
          'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
        }
        mb={4}
        pos={'relative'}
        _after={{
          content: '""',
          w: 4,
          h: 4,
          bg: 'green.300',
          border: '2px solid white',
          rounded: 'full',
          pos: 'absolute',
          bottom: 0,
          right: 3,
        }}
      />
      <Heading fontSize={'2xl'} fontFamily={'body'}>
        {props.name}
      </Heading>
      <Text fontWeight={600} color={'gray.500'} mb={4}>
        {props.url}
      </Text>
      <Text
        textAlign={'center'}
        color={useColorModeValue('gray.700', 'gray.400')}
        px={3}>
        {props.description}
      </Text>

      <Stack direction={'row'} justify={'center'} spacing={6} mt={4}>
        <Stack spacing={0} align={'center'}>
          <Text fontWeight={600}>{props._count.Subscribers}</Text>
          <Text fontSize={'sm'} color={'gray.500'}>
            Subscribers
          </Text>
        </Stack>
        <Stack spacing={0} align={'center'}>
          <Text fontWeight={600}>{props._count.Posts}</Text>
          <Text fontSize={'sm'} color={'gray.500'}>
            Posts
          </Text>
        </Stack>
      </Stack>

      <Stack mt={8} direction={'row'} spacing={4}>
        <Button
          flex={1}
          fontSize={'sm'}
          rounded={'full'}
          _focus={{
            bg: 'gray.200',
          }}>
          Visit
        </Button>
        <Button
          flex={1}
          fontSize={'sm'}
          rounded={'full'}
          bg={'blue.400'}
          color={'white'}
          boxShadow={
            '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
          }
          _hover={{
            bg: 'blue.500',
          }}
          _focus={{
            bg: 'blue.500',
          }}>
          Subscribe
        </Button>
      </Stack>
    </Box>
  );
}