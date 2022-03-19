import React, {ChangeEvent, useRef, useState} from 'react'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Stack
} from "@chakra-ui/react";
import JoditEditor from "jodit-react";
import SubreddixFinder from "../subreddix/SubreddixFinder";

interface PostEditorProps {
  onSubmit: (postTitle: string, postContent: string) => void
}

function PostEditor({onSubmit}: PostEditorProps) {
  const [postContent, setPostContent] = useState('')
  const editor = useRef<JoditEditor>(null)

  const [postTitle, setPostTitle] = useState('')
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setPostTitle(e.target.value)
  const isError = postTitle === ''

  const config = {
    "toolbarAdaptive": false,
    "showCharsCounter": false,
    "showWordsCounter": false,
    "showXPathInStatusbar": false,
    "buttons": "bold,italic,underline,ul,ol,link,undo,redo",
    "theme": "reddix",
    "disablePlugins": "search",
    "width": "100%"
  }

  return (
    <Stack>

      <SubreddixFinder></SubreddixFinder>
      <FormControl px=".5rem" py=".75rem">
        <FormLabel htmlFor='postTitle'>Post Title</FormLabel>
        <Input
          id="postTitle"
          type="text"
          size="lg"
          value={postTitle}
          onChange={handleInputChange}
        />
        {!isError ? (
          <FormHelperText>
            The more descriptive your title is the more users will see it :)
          </FormHelperText>
        ) : (
          <FormErrorMessage>Title is required.</FormErrorMessage>
        )}
      </FormControl>

      <JoditEditor
        ref={editor}
        value={postContent}
        config={config}
        onBlur={newContent => setPostContent(newContent)}
      />
      <Flex alignItems="center" justifyContent="end" px=".5rem" py=".75rem" borderColor='gray.200' borderTopWidth="1px">
        <Button colorScheme='blue' size='sm' onClick={()=>onSubmit(postTitle, postContent)}>Absenden</Button>
      </Flex>
    </Stack>
  )
}

export default PostEditor
