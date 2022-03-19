import React, {TextareaHTMLAttributes, useCallback, useRef, useState} from 'react';
import useAsyncEffect from "use-async-effect";
import axios from "axios";
import {Box, Button, Container, Flex, Heading, Stack, Text, useColorModeValue} from "@chakra-ui/react";
import {ArrowDownIcon, ArrowUpIcon} from "@chakra-ui/icons";
import PostEditor from "../../components/dashboard/PostEditor";
import JoditEditor from "jodit-react";

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
      if (post.id === updatedPost.id) return {
        ...updatedPost
      }
      return post
    }))
  }

  const handleEditorSubmit = async (postTitle: string, postContent: string, ) =>  {
    const result = await axios.post("/posts", {
      title: postTitle,
      content: postContent
    })
  }


  return (
    <Container maxW="container.xl">
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'sm'}
        border='1px' borderColor='gray.200'
        mb="1rem"
      >
        <PostEditor onSubmit={handleEditorSubmit}/>
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

  return (
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'sm'}
        border='1px' borderColor='gray.200'
        px={3}
        py={4}
      >
        <Flex gap="1rem">
          <Stack alignItems="center">
            <Button onClick={() => handleVoteClick(1)} {...upvoteButtonProps}><ArrowUpIcon w={6} h={6} /></Button>
            <Text {...voteCounterProps} isTruncated>{votesTotal}</Text>
            <Button onClick={() => handleVoteClick(-1)} {...downvoteButtonProps}><ArrowDownIcon w={6} h={6} /></Button>
          </Stack>
          <Box>
            <Stack spacing=".5rem">
              <Text fontSize="sm">{`/r/${Subreddix.url}`}</Text>
              <Heading as='h3' size='lg'>{title}</Heading>
              <Text fontSize="md">{content}</Text>
            </Stack>
          </Box>
        </Flex>
      </Box>
  )
}



export default DashboardHome;
