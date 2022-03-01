import React, {useRef, useState} from 'react'
import {Button, Flex, Stack} from "@chakra-ui/react";
import JoditEditor from "jodit-react";

function PostEditor() {

  const editor = useRef(null)
  const [content, setContent] = useState('')
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
    <Stack spacing="0">
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={newContent => setContent(newContent)}
      />
      <Flex alignItems="center" justifyContent="end" px=".5rem" py=".75rem" borderColor='gray.200' borderTopWidth="1px">
        <Button colorScheme='blue' size='sm' onClick={()=>console.log(content)} disabled={content === ''}>Absenden</Button>
      </Flex>
    </Stack>
  )
}

export default PostEditor
