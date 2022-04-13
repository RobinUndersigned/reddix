import React, {useContext} from 'react';
import axios from "axios";
import {
  Box,
  Container, Flex, Tab, TabList, TabPanel, TabPanels,
  Tabs,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import PostEditor from "../../components/dashboard/PostEditor";
import {PostEditorContext} from "../../context/PostEditorContext";
import SubreddixCard from "../../components/subreddix/SubreddixCard";


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


function DashboardSubmitPost() {
  const toast = useToast()
  const {selectedSubreddix} = useContext(PostEditorContext);
  console.log(selectedSubreddix)
  const handleEditorSubmit = async (postSubreddix: string, postTitle: string, postContent: string, published: boolean) =>  {
    try {
      const newPost = {
        subreddixUrl: postSubreddix,
        title: postTitle,
        content: postContent,
        published
      }

      await axios.post("/posts", newPost)
      toast({
        title: 'Post success.',
        description: published ? 'Post successfully published' : 'Draft created Successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      })
    } catch(err) {
      if (err instanceof Error) console.log(err.message)
      if (axios.isAxiosError(err)) toast({
        title: 'Post error.',
        description: `${err.response?.data.error}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      })
    }
  }

  return (
    <Container maxW="container.xl">
      <Flex gap={4} alignItems={"flex-start"}>
        <Box
          flexBasis={selectedSubreddix ? "75%" : "100%"}
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'sm'}
          border='1px' borderColor='gray.200'
          mb="1rem"
        >
          <Tabs>
            <TabList>
              <Tab>Text</Tab>
              <Tab>Link</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p="0">
                <PostEditor variant="text" onSubmit={handleEditorSubmit}/>
              </TabPanel>
              <TabPanel p="0">
                <PostEditor variant="link" onSubmit={handleEditorSubmit}/>
              </TabPanel>
            </TabPanels>
          </Tabs>

        </Box>
        {selectedSubreddix && <SubreddixCard {...selectedSubreddix}/>}
      </Flex>
    </Container>
  );
}



export default DashboardSubmitPost;
