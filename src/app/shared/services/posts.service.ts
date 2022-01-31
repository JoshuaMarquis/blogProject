import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { increment } from '@angular/fire/firestore';
import { map, Observable, of, switchMap } from 'rxjs';
import { PostInterface } from '../models/post.interface';
import { PersistanceService } from './persistance.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts$ !: Observable<PostInterface[]>;
  private userLikes !: number[];

  constructor(private firestore: AngularFirestore, private persistance: PersistanceService) { 
    this.userLikes = this.persistance.get('userLikes');
    if(!this.userLikes){
      this.userLikes = [];
    }
    this.initPosts();
  }


  private initPosts() : void{
    this.posts$ = this.firestore.collection<PostInterface>('posts').valueChanges().pipe(
      map((postArray: PostInterface[])=>{
        postArray = postArray.map((post:PostInterface)=>{
          if(this.userLikes.includes(post.id)){
            post = {...post, userLiked: true}
          }
          return post
        })
        return postArray;
      })
    );
  };

  public getPosts():Observable<PostInterface[]>{
    return this.posts$.pipe(
      map((postArray: PostInterface[])=>{
        //Get most recent posts first
        return postArray.reverse();
      })
    );
  };

  public updateLike(id: number): void{
    const postDoc = this.firestore.doc<PostInterface>(`posts/${id}`);
    postDoc.ref.update({likeCount:increment(1)})

    //Ensure duplicates aren't made
    if(this.userLikes.includes(id)){
      throw new Error("User Already Liked this post");
    }
    this.userLikes.push(id);
    this.persistance.set("userLikes", this.userLikes);
    
  }

  public getPost(id: number):Observable<PostInterface>{
    return this.posts$.pipe(
      switchMap((postArray)=>{
        const postFind = postArray.find((post:PostInterface)=>post.id==id);
        if(!postFind){
          throw new Error(`Error Finding Post with id: ${id}`);
        }
        return of(postFind);
      })
    );
  }
}
