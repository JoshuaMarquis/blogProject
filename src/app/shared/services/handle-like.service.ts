import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PostInterface } from '../models/post.interface';
import { PersistanceService } from './persistance.service';

@Injectable({
  providedIn: 'root'
})
export class HandleLikeService {
  postref !: any;

  constructor(private persistance: PersistanceService, private firestore: AngularFirestore) { }

  updateLike(post: PostInterface, userLikes : number[]): void{
    const updatedPost : PostInterface = {...post, likeCount:post.likeCount+1};
    this.postref = this.firestore.doc<PostInterface>(`posts/${post.id}`);
    this.postref.update(updatedPost);

    //Ensure duplicates aren't made
    if(userLikes.includes(post.id)){
      throw new Error("User Already Liked this post");
    }
    userLikes.push(post.id);
    this.persistance.set("userLikes", userLikes);
    
  }
}
