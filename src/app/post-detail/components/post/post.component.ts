import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription, switchMap } from 'rxjs';
import { PostInterface } from 'src/app/shared/models/post.interface';
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

  constructor(private route: ActivatedRoute, private persistance: PersistanceService, private firestore: AngularFirestore) { }

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
        this.postSub = this.firestore.collection<PostInterface>('posts').valueChanges().subscribe((postArray: PostInterface[])=>{
          postArray.map((post: PostInterface) =>{
            if(post.id == this.postId){
              this.post = post;
              if (this.userLikes.includes(post.id)){
                this.post.userLiked = true;
              }
            }
          })
      })
    });
  }

  handleLikeDislike(id:number): void{
/*     let updatedPost : PostInterface;
      this.patchSub = this.api.getPostById(id).pipe(
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
