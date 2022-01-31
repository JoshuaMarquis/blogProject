import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable,} from 'rxjs';
import { PostInterface } from 'src/app/shared/models/post.interface';
import { PersistanceService } from 'src/app/shared/services/persistance.service';
import { PostsService } from 'src/app/shared/services/posts.service';

@Component({
  selector: 'blog-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  posts$ !: Observable<PostInterface[]>;
  userLikes !: number[];
  postref !: any;

  constructor(private persistance: PersistanceService, private postsService: PostsService) { }

  ngOnInit(): void {
    this.userLikes = this.persistance.get('userLikes');
    if(!this.userLikes){
      this.userLikes = [];
    }
    this.posts$ = this.postsService.getPosts();
    console.log(Date());
  }



  likeClicked(id:number): void{
    this.postsService.updateLike(id);
  }



}
