import React, {ReactElement, useCallback, useMemo, useState} from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
} from 'slate'
import { withHistory } from 'slate-history'
import { EditorButton, EditorIcon, Toolbar } from './EditorComponents'
import {CustomEditor, CustomElement, CustomText} from './custom-types'
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatUnderlined,
  MdOutlineCode
} from "react-icons/md";
import {Box, Button, Flex, Heading, Select, Stack} from "@chakra-ui/react";
import {BsBlockquoteLeft} from "react-icons/bs";
import {AiFillMedicineBox} from "react-icons/all";
import {assertCombobox} from "@headlessui/react/dist/test-utils/accessibility-assertions";


const HOTKEYS: { [v: string]: string } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

function PostEditor() {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  return (
    <Stack spacing="0">
      <Slate editor={editor} value={value} onChange={value => setValue(value)}>
        <Toolbar>
          <MarkButton format="bold" icon={<MdFormatBold/>}/>
          <MarkButton format="italic" icon={<MdFormatItalic/>}/>
          <MarkButton format="underline" icon={<MdFormatUnderlined/>}/>
          <MarkButton format="code" icon={<MdOutlineCode/>}/>
          <HeadingSelect/>
          <BlockButton format="block-quote" icon={<BsBlockquoteLeft/>}/>
          <BlockButton format="numbered-list" icon={<MdFormatListNumbered/>}/>
          <BlockButton format="bulleted-list" icon={<MdFormatListBulleted/>}/>
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          className="px-3 py-4"
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor, mark)
              }
            }
          }}
        />
      </Slate>
      <Flex alignItems="center" justifyContent="end" px=".5rem" py=".75rem" borderColor='gray.200' borderTopWidth="1px">
        <Button colorScheme='blue' size='sm'>Absenden</Button>
      </Flex>
    </Stack>
  )
}

const HeadingSelect = () => {
  const editor = useSlate()

  const defaultValue = isBlockActive(editor, 'heading-one')
    ? 'heading-one'
    : isBlockActive(editor, 'heading-two')
      ? 'heading-two'
      : undefined

  return (
    <Select
      size='sm'
      w="12rem"
      placeholder='Headline format'
      defaultValue={defaultValue}
      onChange={(event) => toggleBlock(editor, event.target.value)}>
      <option value='heading-one'>Headline 1</option>
      <option value='heading-two'>Headline 2</option>
    </Select>
  )
}


const toggleBlock = (editor: Editor, format: any) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  })
  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = {type: format, children: []}
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor: CustomEditor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: CustomEditor, format: string) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  )

  return !!match
}

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor) as { [v: string]: boolean }
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }: {attributes: CustomText,  children: ReactElement[], element: CustomElement}) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <Heading as='h1' size='lg' isTruncated {...attributes}>{children}</Heading>
    case 'heading-two':
      return <Heading as='h2' size='md'  {...attributes}>{children}</Heading>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }: {attributes: any, children: ReactElement, leaf: {[v: string]: boolean}}) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }: {format: string, icon: string|ReactElement}) => {
  const editor = useSlate()
  return (
    <EditorButton
      active={isBlockActive(editor, format)}
      onMouseDown={(event: Event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <EditorIcon>{icon}</EditorIcon>
    </EditorButton>
  )
}

const MarkButton = ({ format, icon }: {format: string, icon: string|ReactElement}) => {
  const editor = useSlate()
  return (
    <EditorButton
      active={isMarkActive(editor, format)}
      onMouseDown={(event: Event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <EditorIcon>{icon}</EditorIcon>
    </EditorButton>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: '' },
    ],
  },
]

export default PostEditor
