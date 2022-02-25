import React, {useState} from 'react';
import useAsyncEffect from "use-async-effect";
import axios from "axios";
import {Box, Center, Container, Flex, Heading, Stack, Text, useColorModeValue} from "@chakra-ui/react";

type VoteValue = -1 | 0 | 1
interface Vote {
  id: number,
  userId: number,
  postId: number,
  createdAt: string,
  voteValue: VoteValue
}

interface Post {
  id: number,
  title: string,
  createdAt: string,
  content: string,
  published: true,
  authorId: number,
  subreddixId: number,
  Subreddix: {
    id: number,
    name: string,
    url: string,
    description: string,
    createdAt: string
  }
  Votes: Vote[]
}


function DashboardHome() {
  const [posts, setPosts] = useState<Post[]>([])
  useAsyncEffect(async () => {
    const posts = await axios.get('/posts/')
    setPosts(posts.data)
  }, [])
  return (
    <Container maxW="container.xl">
      <Flex
        direction={"column"}
        gap={"1rem"}
      >
        {posts.map(post => {
          return <DashboardPost key={post.id} {...post}/>
        })}
      </Flex>
    </Container>
  );
}

function DashboardPost({id, title, content, Subreddix, Votes}: Post) {
  return (
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'sm'}
        border='1px' borderColor='gray.200'
        px={6}
        py={4}
      >
        <Stack spacing=".5rem">
          <Text fontSize="sm">{`/r/${Subreddix.url}`}</Text>
          <Heading as='h3' size='lg'>{title}</Heading>
          <Text fontSize="md">{content}</Text>
          <Text>{Votes.length}</Text>
        </Stack>
      </Box>

  )
}



export default DashboardHome;
