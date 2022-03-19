import React, {
  ChangeEvent,
  useState
} from 'react';
import axios from "axios";
import {
  Box,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";

interface Subreddix {
  id: number,
  name: string,
  url: string,
  description: string,
  createdAt: string
}


function SubreddixFinder() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSubreddix, setSelectedSubreddix] = useState('')
  const [subreddixList, setSubreddixList] = useState<Subreddix[]>([])
  const [filterValue, setFilterValue] = useState('')

  const getSubreddixList = async () => {
    const result = await axios.get("/r");
    setSubreddixList(result.data)
  }

  const openSubreddixList = () => {
    setIsOpen(true)
    if(subreddixList.length === 0) getSubreddixList()
  }

  const closeSubreddixList = () => {
    setIsOpen(false)
    if (!selectedSubreddix.includes("r/") && selectedSubreddix !== '') setSelectedSubreddix(`r/${selectedSubreddix}`)
  }

  const selectSubreddix = (subreddixUrl: string) => {
    setSelectedSubreddix(`r/${subreddixUrl}`)
  }

  const onSelectSubreddix = (subreddix: Subreddix) => {
    selectSubreddix(subreddix.url)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value)
    setSelectedSubreddix(e.target.value)
  }

  return (
      <Box
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'sm'}
        mb="1rem"
        position="relative"
      >
        <Input w="100%" onClick={openSubreddixList} onBlur={closeSubreddixList} onChange={handleInputChange} value={selectedSubreddix} placeholder="Select a community"/>
        {isOpen && <SubreddixList subreddixs={subreddixList} onSelect={onSelectSubreddix} filterValue={filterValue}/>}
      </Box>
  );
}

interface SubreddixListProps {
  subreddixs: Subreddix[],
  onSelect: (subreddix: Subreddix) => void
  filterValue: string
}

function SubreddixList({ subreddixs, onSelect, filterValue }: SubreddixListProps) {

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
      {subreddixs
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


export default SubreddixFinder;
