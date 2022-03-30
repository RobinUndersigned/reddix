import axios from "axios";
import {
  Avatar,
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
import React, {useRef, useState} from "react";
import {Post} from "../../interfaces/Post";
import {Comment} from "../../interfaces/Comment";
import {useParams} from "react-router-dom";
import useAsyncEffect from "use-async-effect";
import {editorConfig} from "../../utils/editorConfig";
import JoditEditor from "jodit-react";

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
                    <MenuItem>Report</MenuItem>
                    <MenuItem>Hide</MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </HStack>
          </Box>
        </Box>
      </Flex>
      <Box bg={useColorModeValue('gray.50', 'gray.800')} p="1rem">
        {singlePost?.Comments.map((comment, index) => { return <PostComment key={index} {...comment} /> })}
      </Box>
    </Box>
  )
}


function PostComment({content, Children, User }: Comment) {
  const [avatarImage, setAvatarImage] = useState<string>("https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9")
  const [showChildren, setShowChildren] = useState<boolean>(true)
  const [showEditor, setShowEditor] = useState<boolean>(false)
  const [commentContent, setCommentContent] = useState('')
  const editor = useRef<JoditEditor>(null)

  const Editor = <JoditEditor
    ref={editor}
    value={commentContent}
    config={editorConfig}
    onBlur={newContent => setCommentContent(newContent)}/>


  useAsyncEffect(async () => {
    if (User.Profile.avatarId) {
      const avatar = await axios.get(`/media/${User.Profile.avatarId}`);
      if (avatar.data.file) setAvatarImage(avatar.data.file)
    }
  }, [User])

  const createMarkup = (content: string) => {
    return { __html: content };
  }

  return (
    <Box mb="2rem">
      <Flex gap=".5rem" w="100%">
        <Flex direction="column" alignItems="center" gap=".5rem">
          <Avatar
            size={'sm'}
            src={avatarImage}
          />
          <i onClick={() => setShowChildren(!showChildren)} className="h-full w-[3px] bg-gray-300 hover:bg-sky-400 hover:cursor-pointer"/>
        </Flex>
        <Stack flexGrow={1}>
          <Text fontSize="md" dangerouslySetInnerHTML={createMarkup(content)} />
          <HStack gap="1rem">
            <Box>
              <Button variant="link" size="sm" onClick={() => setShowEditor(!showEditor)}>
                Antworten
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
                  <MenuItem>Report</MenuItem>
                  <MenuItem>Hide</MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </HStack>
          {showEditor &&
              <Flex gap=".5rem">
                <Box className="w-8 h-full flex flex-col items-center">
                    <i onClick={() => setShowEditor(!showEditor)} className="d-block h-full w-[3px] bg-gray-300 hover:bg-sky-400 hover:cursor-pointer"/>
                </Box>
                <Stack flexGrow={1}>
                  <Box border='1px' borderColor='gray.200' borderRadius="md">{Editor}</Box>
                  <Flex alignItems="center" justifyContent="end" gap=".25rem">
                    <Button variant="outline" colorScheme='orange' size='xs' onClick={() => setShowEditor(!showEditor)}>Abort</Button>
                    <Button colorScheme='blue' size='xs'>Submit</Button>
                  </Flex>
                </Stack>
              </Flex>
          }
          {showChildren && Children.map((child: Comment, index: number) =>  { return <PostComment key={index} {...child} /> })}
        </Stack>
      </Flex>
    </Box>
  )
}



export default SinglePost;