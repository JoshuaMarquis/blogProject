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
  patchSub ?: Subscription;
  postId !: number;
  post$ !: Observable<PostInterface>;
  userLikes !: number[];
  postref !: any;

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
      this.postref = this.firestore.doc<PostInterface>(`posts/${this.postId}`);
      if(this.postref){
        this.post$ = this.postref.valueChanges().pipe(
          map((post: PostInterface)=>{
            if (this.userLikes.includes(post.id)){
              post.userLiked = true;
            }
            return post;
          })
        );
      }
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
  }

  log(smt: any){
    console.log(smt)
  }
}
