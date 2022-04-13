import React from "react";
import {Subreddix} from "../../interfaces/Subreddix";
import {PostEditorContext, PostEditorContextInterface} from "../../context/PostEditorContext";

export function PostEditorProvider({ children }: { children: React.ReactNode }) {
  const [selectedSubreddix, setSelectedSubreddix] = React.useState<Subreddix|null>(null)

  const value: PostEditorContextInterface = { selectedSubreddix, setSelectedSubreddix }
  return <PostEditorContext.Provider value={value}>{children}</PostEditorContext.Provider>
}
