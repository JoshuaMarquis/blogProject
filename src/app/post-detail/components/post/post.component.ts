import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { PostInterface } from 'src/app/shared/models/post.interface';
import { ApiRequestService } from 'src/app/shared/services/api-request.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  routeParamSub!: Subscription;
  postId !: number;
  post$ !: Observable<PostInterface>;

  constructor(private route: ActivatedRoute, private api: ApiRequestService) { }

  ngOnInit(): void {
    this.initPostDetail();
  }

  initPostDetail(): void{
    this.route.params.subscribe(params=>{
      this.postId = params['id'];
      this.post$ = this.api.getPostById(this.postId);
    });
  }
  ngOnDestroy(): void {
      if(this.routeParamSub){
        this.routeParamSub.unsubscribe();
      }
  }
}
