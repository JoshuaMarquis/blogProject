import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subscription, switchMap,} from 'rxjs';
import { PostInterface } from 'src/app/shared/models/post.interface';
import { ApiRequestService } from 'src/app/shared/services/api-request.service';
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

  constructor(private api : ApiRequestService, private persistance: PersistanceService) { }

  ngOnInit(): void {
    this.userLikes = this.persistance.get('userLikes');
    if(!this.userLikes){
      this.userLikes = [];
    }
    this.initPosts()
    console.log(Date());
  }

  initPosts(): void{
      this.posts$ = this.api.fetchFeedPosts().pipe(
        map((postArray: PostInterface[])=>{
          //Get most recent posts and limit to 5
          postArray = postArray.reverse();
          console.log(postArray)
          postArray = postArray.slice(0,5);
          console.log(postArray)
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
      )
  }

  handleLikeDislike(id:number, btn: string): void{
    if(btn === 'like'){
      let updatedPost : PostInterface;
        this.patchSub = this.api.getPostById(id).pipe(
        switchMap((post)=>{
        updatedPost = {...post, likeCount:post.likeCount+1}
        return this.api.updateLikeCount(updatedPost)
      })).subscribe();

      //Ensure duplicates aren't made
      if(this.userLikes.includes(id)){
        throw new Error("User Already Liked this post");
      }

      this.userLikes.push(id);
      this.persistance.set("userLikes", this.userLikes);
    }
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
