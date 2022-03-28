import React, {useState} from 'react';
import useAsyncEffect from "use-async-effect";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList,
  Stack,
  Text, useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {AddIcon, ArrowDownIcon, ArrowUpIcon} from "@chakra-ui/icons";
import {Link} from "react-router-dom";
import {mode} from "@chakra-ui/theme-tools";

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

  onChange: (value: Post) => void
}

function DashboardHome() {
  const [posts, setPosts] = useState<Post[]>([])

  const getPosts = async () => {
    const posts = await axios.get('/posts')
    setPosts(posts.data)
  }

  useAsyncEffect(async () => {
    await getPosts()
  }, [])

  const updatePosts = (updatedPost: Post) => {
    setPosts(posts.map(post => {
      if (post.id === updatedPost.id) return {...updatedPost}
      return post
    }))
  }

  return (
    <Container maxW="container.xl">
      <Box mb="1rem">
        <Link to="/dashboard/submit">
          <Button colorScheme="blue" aria-label='Submit Post' leftIcon={<AddIcon />}>Submit Post</Button>
        </Link>
      </Box>
      <Flex
        direction={"column"}
        gap={"1rem"}
      >
        {posts.map(post => {
          return <DashboardPost key={post.id} {...post} onChange={updatePosts}/>
        })}
      </Flex>
    </Container>
  );
}

function DashboardPost({id, title, content, Subreddix, userVoteValue, votesTotal, onChange}: Post) {
  const handleVoteClick = async (value: number) => {
    if (userVoteValue  === value) value = 0
    await axios.post("/votes", {
      voteValue: value,
      postId: id
    })

    const updatedPost = await axios.get(`/posts/${id}`)
    onChange(updatedPost.data)
  }

  const upvoteButtonProps = {
    color: `${userVoteValue === 1 && 'white'}`,
    bg: `${userVoteValue === 1 && 'blue.500'}`,
    _hover: {
      bg: `${userVoteValue === 1 && 'blue.600'}`,
    }
  }

  const downvoteButtonProps = {
    color: `${userVoteValue === -1 && 'white'}`,
    bg: `${userVoteValue === -1 && 'orange.500'}`,
    _hover: {
      bg: `${userVoteValue === -1 && 'orange.600'}`,
    }
  }

  const voteCounterProps = {
    color: `${userVoteValue === -1 ? 'orange.500' : userVoteValue === 1 ? 'blue.500' : 'black'}`,
  }

  const createMarkup = (content: string) => {
    return { __html: content };
  }

  return (
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'sm'}
        border='1px' borderColor='gray.200'
      >
        <Flex gap=".5rem">
          <Stack alignItems="center" bg={useColorModeValue('gray.50', 'gray.800')} roundedLeft={'lg'} px={2} py={2}>
            <Button size="sm" onClick={() => handleVoteClick(1)} {...upvoteButtonProps}><ArrowUpIcon w={5} h={5} /></Button>
            <Text {...voteCounterProps} isTruncated>{votesTotal}</Text>
            <Button size="sm" onClick={() => handleVoteClick(-1)} {...downvoteButtonProps}><ArrowDownIcon w={5} h={5} /></Button>
          </Stack>
          <Box px={3} py={2}>
            <Stack spacing=".5rem" mb="2rem">
              <Text fontSize="xs">{`/r/${Subreddix.url}`}</Text>
              <Heading as='h3' size='lg'>{title}</Heading>
              <Text fontSize="md" dangerouslySetInnerHTML={createMarkup(content)} />
            </Stack>
            <Box>
              <HStack gap="1rem">
                <Box>
                  <Button variant="link" size="sm">
                    Comments
                  </Button>
                </Box>
                <Box>
                  <Menu size="sm">
                    <MenuButton
                      as={Button}
                      variant={'link'}
                      cursor={'pointer'}
                      minW={0}
                      size="sm"
                    >
                      ...
                    </MenuButton>
                    <MenuList>
                      <MenuItem>Melden</MenuItem>
                      <MenuItem>Ausblenden</MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
              </HStack>
            </Box>
          </Box>
        </Flex>
      </Box>
  )
}

export default DashboardHome;
