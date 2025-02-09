import {atom} from "recoil";
import { EditorState } from "draft-js";
import {blogCardProps} from './home/BlogCard';
import { commentProps } from "./ShowBlog/CommentSection/page";
interface profileProps {
    id: string;
    email: string;
    username: string;
}
export const parsedHtml=atom<Document | null>({
    key:"parsedHtml",
    default: null
});
export const editor_State=atom<EditorState>({
    key:'editor_State',
    default: EditorState.createEmpty()
})
interface postStateType {
    id:string,
    key:string
}
export const postStateAtom=atom<postStateType | null>({
    key: 'postState',
    default: null
})
export interface draftType {
    id: string;
    author: string;
    title: string;
    description: string;
    tags: string[];
    likes: number;
}
export const draftAtom=atom<draftType[] | null>({
    key: 'draftAtom',
    default: null
})
export const isAuthenticatedAtom=atom<boolean>({
    key: 'isAuthenticatedAtom',
    default: false
});
export const currentPageAtom=atom<number | '...'>({
    key: 'currentPageAtom',
    default: 1
});
export const trendingPostsAtom=atom<blogCardProps[] | null>({
    key: 'trendingPostsAtom',
    default: null
});
export const searchBarAtom=atom<string | null>({
    key:'searchBarAtom',
    default: null
});
export const totalPagesAtom=atom<number>({
    key:'totalPagesAtom',
    default: 1
});
export const profileAtom=atom<profileProps | null>({
    key:'profileAtom',
    default: null
})
export const moreRepliesAtom=atom<commentProps[] | null>({
    key:'moreRepliesAtom',
    default: null
})
