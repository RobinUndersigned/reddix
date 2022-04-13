import React from "react";
import {Subreddix} from "../interfaces/Subreddix";

export interface PostEditorContextInterface {
  selectedSubreddix: Subreddix|null;
  setSelectedSubreddix: React.Dispatch<React.SetStateAction<Subreddix|null>>;
}

export const PostEditorContext = React.createContext<PostEditorContextInterface>({} as PostEditorContextInterface);
