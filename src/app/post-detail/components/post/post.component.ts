import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription, switchMap,} from 'rxjs';
import { PostInterface } from 'src/app/shared/models/post.interface';
import { PersistanceService } from 'src/app/shared/services/persistance.service';
import { PostsService } from 'src/app/shared/services/posts.service';

@Component({
  selector: 'blog-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  routeParamSub!: Subscription;
  postId !: number;
  post$ !: Observable<PostInterface>;
  userLikes !: number[];
  postref !: any;

  constructor(private route: ActivatedRoute, private persistance: PersistanceService, private postsService: PostsService,) { }

  ngOnInit(): void {
    this.initPostDetail();
  }

/*   initPostDetail(): void{
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
  } */

  initPostDetail(): void{
    this.routeParamSub = this.route.params.subscribe(params=>{
      this.postId = params['id'];
      this.post$ = this.postsService.getPost(this.postId);
    });
  }



  likeClicked(id:number): void{
    this.postsService.updateLike(id);
  }


  ngOnDestroy(): void {
      if(this.routeParamSub){
        this.routeParamSub.unsubscribe();
      }
  }

}
