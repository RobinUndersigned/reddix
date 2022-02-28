import React, {useCallback, useEffect, useState} from 'react';
import useAsyncEffect from "use-async-effect";
import axios from "axios";
import {Box, Button, Center, Container, Flex, Heading, HStack, Stack, Text, useColorModeValue} from "@chakra-ui/react";
import useAuth from "../../hooks/useAuth";
import {AddIcon, ArrowDownIcon, ArrowUpIcon} from "@chakra-ui/icons";

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

  userHasVoted: boolean,
  userVoteValue?: number,
  userVote?: Vote,
  votesTotal: number,
}


function DashboardHome() {
  const [posts, setPosts] = useState<Post[]>([])

  const getPosts = async () => {
    const posts = await axios.get('/posts/')
    setPosts(posts.data)
  }

  useAsyncEffect(async () => {
    await getPosts()
  }, [])

  const updatePosts = useCallback(() => getPosts(), [posts])

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

function DashboardPost({id, title, content, Subreddix, Votes, userHasVoted, userVote, userVoteValue, votesTotal}: Post) {
  const auth = useAuth()
  const [localVotesTotal, setLocalVotesTotal] = useState(0)
  const handleVoteClick = useCallback(async (value: number) => {
    if (userHasVoted) value = 0

    const result = await axios.post("/votes", {
      voteValue: value,
      postId: id
    })
    console.log(result.data)
    console.log(localVotesTotal)
    setLocalVotesTotal(localVotesTotal + result.data.voteValue)
  }, [id])

  useEffect(() => setLocalVotesTotal(votesTotal), [localVotesTotal])
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

          <HStack>
            <Button onClick={() => handleVoteClick(1)}><ArrowUpIcon w={6} h={6} /></Button>
            <Text>{localVotesTotal}</Text>
            <Button onClick={() => handleVoteClick(-1)}><ArrowDownIcon w={6} h={6} /></Button>
            <span>{userHasVoted ? "Voted" : "Not Voted"}</span>
          </HStack>
        </Stack>
      </Box>
  )
}



export default DashboardHome;
