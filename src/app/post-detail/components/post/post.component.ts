import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription,} from 'rxjs';
import { PostInterface } from 'src/app/shared/models/post.interface';
import { HandleLikeService } from 'src/app/shared/services/handle-like.service';
import { PersistanceService } from 'src/app/shared/services/persistance.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  routeParamSub!: Subscription;
  postId !: number;
  post$ !: Observable<PostInterface>;
  userLikes !: number[];
  postref !: any;

  constructor(private route: ActivatedRoute, private persistance: PersistanceService, private firestore: AngularFirestore, private handleLike: HandleLikeService) { }

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

  likeClicked(post: PostInterface): void{
    this.handleLike.updateLike(post, this.userLikes);
  }


  ngOnDestroy(): void {
      if(this.routeParamSub){
        this.routeParamSub.unsubscribe();
      }
  }

}
