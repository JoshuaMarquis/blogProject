import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { PostInterface } from '../models/post.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestService {

  constructor(private http: HttpClient) { }

  fetchFeedPosts(): Observable<PostInterface[]>{
    return this.http.get<PostInterface[]>('http://localhost:3500/posts');
  }

  updateLikeCount(post: PostInterface): Observable<Object>{
    return this.http.patch(`http://localhost:3500/posts/${post.id}`, post);
  }

  getPostById(id: number): Observable<PostInterface>{
    return this.http.get<PostInterface>(`http://localhost:3500/posts/${id}`);
  }
}
