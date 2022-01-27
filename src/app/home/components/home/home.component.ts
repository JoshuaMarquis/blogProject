import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable,} from 'rxjs';
import { PostInterface } from 'src/app/shared/models/post.interface';
import { HandleLikeService } from 'src/app/shared/services/handle-like.service';
import { PersistanceService } from 'src/app/shared/services/persistance.service';

@Component({
  selector: 'blog-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  posts$ !: Observable<PostInterface[]>;
  userLikes !: number[];
  postref !: any;

  constructor(private persistance: PersistanceService, private firestore: AngularFirestore, private handleLike: HandleLikeService) { }

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
            }
            return post
          })
          return postArray;
        })
      );
  }


  likeClicked(post: PostInterface): void{
    this.handleLike.updateLike(post, this.userLikes);
  }



}
