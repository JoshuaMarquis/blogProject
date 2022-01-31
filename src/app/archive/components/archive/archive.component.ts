import { Component, OnInit} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { PostInterface } from 'src/app/shared/models/post.interface';
import { PostsService } from 'src/app/shared/services/posts.service';

@Component({
  selector: 'blog-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit {
  posts$ !: Observable<PostInterface[]>;
  displayedColumns = ['title', 'publishDate'];

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.posts$ = this.postsService.getPosts();
  }


}
