import { Post } from "../models/imageboard/Post.js";


const r9kStripRegex=/([\s|\W])+/g

export function r9kAllow(boardPosts:Post[],newPost:Post):boolean{
    let result=true;
    let modifiedNewPostContent=newPost.body.trim().toLowerCase().replace(r9kStripRegex,"");
    for (let i = 0; i < boardPosts.length; i++) {
        const existingPost = boardPosts[i];
        const modifiedExistingPostContent=existingPost.body.trim().toLowerCase().replace(r9kStripRegex,"");
        if (modifiedExistingPostContent==modifiedNewPostContent){
            result=false;
            break;
        }
        
    }


    return result
}