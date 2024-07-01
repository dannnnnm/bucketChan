import { assert } from "chai";
import { describe, it } from "node:test";
import { r9kAllow } from "../src/chan/r9k/r9kChecker.js";
import { Post } from "../src/chan/models/imageboard/Post.js";
import { faker } from "@faker-js/faker";

describe('Test r9k repeated',()=>{
    it("r9k should ignore letter case, spaces and non-alphabetic characters",async ()=>{
        let posts:Post[]=[]
        for (let index = 0; index < 8; index++) {
            posts.push({body:faker.hacker.phrase()} as any)
        }
        let messageToRepeat="Hola mundo!";
        posts.push({body:messageToRepeat} as any)
        let repeatedVer={body:"hoLa.m!undo!!"};
        let result=r9kAllow(posts,repeatedVer as any);
        assert.isFalse(result)
    })
})

describe('Test r9k repeated with weird chars',()=>{
    it("r9k should ignore letter case, spaces and non-alphabetic characters",async ()=>{
        let posts:Post[]=[]
        for (let index = 0; index < 8; index++) {
            posts.push({body:faker.hacker.phrase()} as any)
        }
        let messageToRepeat="Hola mund@^(o!";
        posts.push({body:messageToRepeat} as any)
        let repeatedVer={body:"hoLa.m!u n{'}  do!!"};
        let result=r9kAllow(posts,repeatedVer as any);
        assert.isFalse(result)
    })
})

describe('Test r9k repeated with whitespace',()=>{
    it("r9k should ignore letter case, spaces and non-alphabetic characters",async ()=>{
        let posts:Post[]=[]
        for (let index = 0; index < 8; index++) {
            posts.push({body:faker.hacker.phrase()} as any)
        }
        let messageToRepeat="Hola mundo!";
        posts.push({body:messageToRepeat} as any)
        let repeatedVer={body:"hoLa.m!u n  do!!"};
        let result=r9kAllow(posts,repeatedVer as any);
        assert.isFalse(result)
    })
})


describe('Test r9k non repeated',()=>{
    it("r9k should ignore letter case, spaces and non-alphabetic characters",async ()=>{
        let posts:Post[]=[]
        for (let index = 0; index < 8; index++) {
            posts.push({body:faker.hacker.phrase()} as any)
        }
        let messageToRepeat="Hola mundo!";
        posts.push({body:messageToRepeat} as any)
        let repeatedVer={body:"hoLa.amigkos!!"};
        let result=r9kAllow(posts,repeatedVer as any);
        assert.isTrue(result)
    })
})