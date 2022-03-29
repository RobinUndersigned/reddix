import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton, MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import {ArrowDownIcon, ArrowUpIcon} from "@chakra-ui/icons";
import React, {useCallback, useState} from "react";
import {Post} from "../../interfaces/Post";
import {useParams} from "react-router-dom";
import useAsyncEffect from "use-async-effect";

function SinglePost() {
  const {postId} = useParams();
  const [singlePost, setSinglePost] = useState<Post|null>(null)
  const getPost = async () => {
    const post = await axios.get(`/posts/${postId}`)
    setSinglePost(post.data)
    console.log(post.data)
  }

  useAsyncEffect(async () => {
    await getPost()
  }, [])

  const handleVoteClick = async (value: number) => {
    if (singlePost?.userVoteValue  === value) value = 0
    await axios.post("/post-votes", {
      voteValue: value,
      postId: singlePost?.id
    })

    const updatedPost = await axios.get(`/posts/${postId}`)
    setSinglePost(updatedPost.data)
  }


  const upvoteButtonProps = {
    color: `${singlePost?.userVoteValue === 1 && 'white'}`,
    bg: `${singlePost?.userVoteValue === 1 && 'blue.500'}`,
    _hover: {
      bg: `${singlePost?.userVoteValue === 1 && 'blue.600'}`,
    }
  }

  const downvoteButtonProps = {
    color: `${singlePost?.userVoteValue === -1 && 'white'}`,
    bg: `${singlePost?.userVoteValue === -1 && 'orange.500'}`,
    _hover: {
      bg: `${singlePost?.userVoteValue === -1 && 'orange.600'}`,
    }
  }

  const voteCounterProps = {
    color: `${singlePost?.userVoteValue === -1 ? 'orange.500' : singlePost?.userVoteValue === 1 ? 'blue.500' : 'black'}`,
  }

  const createMarkup = (content: string|undefined) => {
    if (content) return { __html: content };
    return { __html: "nothing to see here"}
  }

  const commentsButtonLabel = () => {
    if (singlePost?.hasComments && singlePost?.commentCount === 1) return `${singlePost?.commentCount} Comment`
    return `${singlePost?.commentCount} Comments`
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
          <Text {...voteCounterProps} isTruncated>{singlePost?.votesTotal}</Text>
          <Button size="sm" onClick={() => handleVoteClick(-1)} {...downvoteButtonProps}><ArrowDownIcon w={5} h={5} /></Button>
        </Stack>
        <Box px={3} py={2}>
          <Stack spacing=".5rem" mb="2rem">
            <Text fontSize="xs">{`/r/${singlePost?.Subreddix.url}`}</Text>
            <Heading as='h3' size='lg'>{singlePost?.title}</Heading>
            <Text fontSize="md" dangerouslySetInnerHTML={createMarkup(singlePost?.content)} />
          </Stack>
          <Box>
            <HStack gap="1rem">
              <Box>
                <Button variant="link" size="sm">
                  {commentsButtonLabel()}
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
      <Box bg={useColorModeValue('gray.50', 'gray.800')}>
        {singlePost && singlePost.Comments.map((comment, index) => { return <Box key={index}>{comment.content}</Box>})}
      </Box>
    </Box>
  )
}

export default SinglePost;