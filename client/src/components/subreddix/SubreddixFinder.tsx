import React, {
  ChangeEvent, Ref, useCallback, useContext, useEffect,
  useState
} from 'react';
import axios from "axios";
import {
  Box, FormHelperText, FormLabel,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import useAsyncEffect from "use-async-effect";
import {Subreddix} from "../../interfaces/Subreddix";
import {PostEditorContext} from "../../context/PostEditorContext";

interface SubreddixFinderProps {
   onChange: (subreddix: Partial<Subreddix>) => void
}

function SubreddixFinder({...props}: SubreddixFinderProps, ref: Ref<HTMLInputElement>) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSubreddixUrl, setSelectedSubreddixUrl] = useState('')
  const [filterValue, setFilterValue] = useState('')

  const {setSelectedSubreddix} = useContext(PostEditorContext);

  const openSubreddixList = () => {
    setIsOpen(true)
  }

  const closeSubreddixList = () => {
    setIsOpen(false)
    if (!selectedSubreddixUrl.includes("r/")) setSelectedSubreddixUrl(`r/${selectedSubreddixUrl}`)
  }

  const onSelectSubreddix = (subreddix: Subreddix) => {
    !subreddix.url.includes("r/")
      ? setSelectedSubreddixUrl(`r/${subreddix.url}`)
      : setSelectedSubreddixUrl(subreddix.url)
    setSelectedSubreddix(subreddix)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value)
    setSelectedSubreddixUrl(e.target.value)
  }

  return (
    <Box mb="1rem">
      <Box bg={useColorModeValue('white', 'gray.700')} position="relative">
        <FormLabel htmlFor='postSubreddix'>Subreddix:</FormLabel>
        <Input {...props} size="md" w="100%" ref={ref}
               onSelect={openSubreddixList}
               onClick={openSubreddixList}
               onBlur={closeSubreddixList}
               onChange={handleInputChange}
               value={selectedSubreddixUrl}
               placeholder="Select a community"/>
        {isOpen && <SubreddixList onSelect={onSelectSubreddix} filterValue={filterValue}/>}
      </Box>
      <FormHelperText>
        In which Subreddix do you want to publish a post?
      </FormHelperText>
    </Box>
  );
}

interface SubreddixListProps {
  onSelect: (subreddix: Subreddix) => void
  filterValue: string
}

function SubreddixList({ onSelect, filterValue }: SubreddixListProps) {
  const [subreddixList, setSubreddixList] = useState<Subreddix[]>([])

  useAsyncEffect(async () => {
    const result = await axios.get("/r");
    setSubreddixList(result.data)
  }, [])

  return (
    <Box
      position="absolute"
      top="100%"
      left="0"
      right="0"
      bg="red"
      overflowY="hidden"
      zIndex="100000"
    >
      {subreddixList
        .filter(subreddix => filterValue === '' || subreddix.name.includes(filterValue))
        .map(subreddix => {
        return <Box key={subreddix.id}>
          <div onMouseDown={() => onSelect(subreddix)}>
            r/{subreddix.name}
          </div>
        </Box>
      })}
    </Box>
  )
}


export default React.forwardRef(SubreddixFinder);
