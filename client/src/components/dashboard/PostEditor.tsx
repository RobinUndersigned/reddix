import React, {ChangeEvent, useRef, useState} from 'react'
import {
  Box,
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

type EditorVariant = "text" | "link"

interface PostEditorProps {
  variant: EditorVariant
  onSubmit: (postSubreddix: string, postTitle: string, postContent: string, published: boolean) => void
}

function PostEditor({ variant, onSubmit }: PostEditorProps) {
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

  const Editor = (variant: EditorVariant) => {
    if (variant === "text") return (
      <Box border='1px' borderColor='gray.200'borderRadius="md">
        <JoditEditor
        ref={editor}
        value={postContent}
        config={config}
        onBlur={newContent => setPostContent(newContent)}/>
      </Box>
    )

    return (
      <Input id="postContent"
             type="text"
             size="md"
             value={postContent}
             onChange={(ev) => setPostContent(ev.target.value)}/>
    )
  }

  return (
    <Stack>
      <FormControl p="1rem">
        <SubreddixFinder ref={postSubreddix}/>

        <Box mb="1rem">
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
        </Box>

        <Box mb="1rem">
          <FormLabel htmlFor='postContent'>Content</FormLabel>
          {Editor(variant)}
          <FormHelperText>
            Please read the Rules of this Subreddix before you submit a post!
          </FormHelperText>
        </Box>

      </FormControl>
      <Flex alignItems="center" justifyContent="end" px="1rem" py=".75rem" mx={"-2rem"} gap="1rem" borderColor='gray.200' borderTopWidth="1px">
        <Button variant="outline" colorScheme='orange' size='sm' onClick={()=>onSubmit(getSubreddixValue(), postTitle, postContent, false)}>Save as draft</Button>
        <Button colorScheme='blue' size='sm' onClick={()=>onSubmit(getSubreddixValue(), postTitle, postContent, true)}>Submit</Button>
      </Flex>
    </Stack>
  )
}

export default PostEditor
