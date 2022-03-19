import React, {ChangeEvent, useRef, useState} from 'react'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack
} from "@chakra-ui/react";
import JoditEditor from "jodit-react";
import SubreddixFinder from "../subreddix/SubreddixFinder";

interface PostEditorProps {
  onSubmit: (postSubreddix: string, postTitle: string, postContent: string, published: boolean) => void
}

function PostEditor({ onSubmit }: PostEditorProps) {
  const [postContent, setPostContent] = useState('')
  const editor = useRef<JoditEditor>(null)
  const postSubreddix = useRef<HTMLInputElement>(null)

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

  const getSubreddixValue = () => {
    // Access reference value:
    return postSubreddix.current ? postSubreddix.current.value : '';
  }

  return (
    <Stack>
      <FormControl px="1rem" py=".75rem">
        <SubreddixFinder ref={postSubreddix}/>
        <FormLabel htmlFor='postTitle'>Post Title</FormLabel>
        <Input
          id="postTitle"
          type="text"
          size="md"
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
      <Flex alignItems="center" justifyContent="end" px="1rem" py=".75rem" gap="1rem" borderColor='gray.200' borderTopWidth="1px">
        <Button colorScheme='orange' size='sm' onClick={()=>onSubmit(getSubreddixValue(), postTitle, postContent, false)}>Absenden</Button>
        <Button colorScheme='blue' size='sm' onClick={()=>onSubmit(getSubreddixValue(), postTitle, postContent, true)}>Absenden</Button>
      </Flex>
    </Stack>
  )
}

export default PostEditor
