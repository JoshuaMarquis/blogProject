import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription, switchMap } from 'rxjs';
import { PostInterface } from 'src/app/shared/models/post.interface';
import { ApiRequestService } from 'src/app/shared/services/api-request.service';
import { PersistanceService } from 'src/app/shared/services/persistance.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  routeParamSub!: Subscription;
  postSub ?: Subscription;
  patchSub ?: Subscription;
  postId !: number;
  post ?: PostInterface;
  userLikes !: number[];

  constructor(private route: ActivatedRoute, private api: ApiRequestService, private persistance: PersistanceService) { }

  ngOnInit(): void {
    this.userLikes = this.persistance.get('userLikes');
    if(!this.userLikes){
      this.userLikes = [];
    }
    this.initPostDetail();
  }

  initPostDetail(): void{
    this.route.params.subscribe(params=>{
      this.postId = params['id'];
      this.postSub = this.api.getPostById(this.postId).subscribe((post: PostInterface)=>{
        this.post =  post;
        if (this.userLikes.includes(post.id)){
          this.post.userLiked = true;
        }
      })
    });
  }

  handleLikeDislike(id:number): void{
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


  ngOnDestroy(): void {
      if(this.routeParamSub){
        this.routeParamSub.unsubscribe();
      }
      if(this.patchSub){
        this.patchSub.unsubscribe();
      }
      if(this.postSub){
        this.postSub.unsubscribe();
      }
  }
}
