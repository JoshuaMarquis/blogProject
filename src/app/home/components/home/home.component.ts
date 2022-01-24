import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, Subscription, switchMap,} from 'rxjs';
import { PostInterface } from 'src/app/shared/models/post.interface';
import { PersistanceService } from 'src/app/shared/services/persistance.service';

@Component({
  selector: 'blog-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  posts$ !: Observable<PostInterface[]>;
  patchSub ?: Subscription;
  userLikes !: number[];

  constructor(private persistance: PersistanceService, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.userLikes = this.persistance.get('userLikes');
    if(!this.userLikes){
      this.userLikes = [];
    }
    this.initPosts()
    console.log(Date());
  }

  initPosts(): void{
    this.posts$ = this.firestore.collection<PostInterface>('posts').valueChanges().pipe(
        map((postArray: PostInterface[])=>{
          //Get most recent posts and limit to 5
          postArray = postArray.reverse();
          postArray = postArray.slice(0,5);
          postArray = postArray.map((post:PostInterface)=>{
            if(this.userLikes.includes(post.id)){
              post = {...post, userLiked: true}
              return post
            }else{
              return post
            }
          })
          return postArray;
        })
      );
  }

  handleLikeDislike(id:number): void{
    let updatedPost : PostInterface;
/*       this.patchSub = this.api.getPostById(id).pipe(
      switchMap((post)=>{
      updatedPost = {...post, likeCount:post.likeCount+1}
      return this.api.updateLikeCount(updatedPost)
    })).subscribe(); */

    //Ensure duplicates aren't made
    if(this.userLikes.includes(id)){
      throw new Error("User Already Liked this post");
    }

    this.userLikes.push(id);
    this.persistance.set("userLikes", this.userLikes);
  }

  ngOnDestroy(): void {
      if(this.patchSub){
        this.patchSub.unsubscribe();
      }
  }
  //Remove this log function
  log(args: any){
    console.log(args)
  }

}
