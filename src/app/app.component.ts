import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  /** ใช้สำหรับ handle error ที่ subscrib ใน component */
  error: null | string = null;
  private errorSub!: Subscription;

  constructor(private _postsService: PostsService) { }

  ngOnInit() {
    this.errorSub = this._postsService.error.subscribe(errorMsg => {
      this.error = errorMsg;
    })
    this.onFetchPosts();
  }

  // onCreatePost(postData: Post) {
  //   this._postsService.createPost(postData.title, postData.content);
  // }

  /** แบบ create post แล้วก็  fetch post after created */
  onCreatePost(postData: Post) {
    this._postsService.createPost(postData.title, postData.content).subscribe(
      postsData => {
        this.loadedPosts = postsData;
      }, error => {
        this.error = error.message;
      }
    )
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this._postsService.getPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      this.error = error.message;
    })
  }

  onClearPosts() {
    // Send Http request
    this._postsService.deletePost().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

}
