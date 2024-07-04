import { Post } from "../models/imageboard/Post.js";


const r9kStripRegex=/([\s|\W])+/g

export function r9kAllow(boardThreads:Post[],newPost:Post):boolean{
    let result=true;
    let modifiedNewPostContent=newPost.body.trim().toLowerCase().replace(r9kStripRegex,"");
    for (let i = 0; i < boardThreads.length; i++) {
        const existingPost = boardThreads[i];
        const modifiedExistingPostContent=existingPost.body.trim().toLowerCase().replace(r9kStripRegex,"");
        if (modifiedExistingPostContent==modifiedNewPostContent){
            result=false;
            break;
        }
        if (!existingPost.responses) continue;
        console.log("responses")
        existingPost.responses.forEach((response)=>{
            if (response.encrypted || result==false) return;
            const modifiedExistingPostContent=response.body.trim().toLowerCase().replace(r9kStripRegex,"");
            if (modifiedExistingPostContent==modifiedNewPostContent){
                result=false;
                return;
            }
        })
        
    }


    return result
}