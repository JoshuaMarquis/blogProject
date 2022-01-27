import { Component, OnInit} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { PostInterface } from 'src/app/shared/models/post.interface';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit {
  posts$ !: Observable<PostInterface[]>;
  displayedColumns = ['title', 'publishDate'];

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.initPosts();
  }

  initPosts(){
    this.posts$ = this.firestore.collection<PostInterface>('posts').valueChanges().pipe(
      map((postArray: PostInterface[])=>{
        //List most recent posts first
        postArray = postArray.reverse();
        return postArray;
      })
    );
  }

}
