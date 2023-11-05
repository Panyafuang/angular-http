import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { catchError, map, mergeMap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  /** ใช้สำหรับ handle error ที่ subscrib ใน service */
  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  // createPost(title: string, content: string) {
  //   const postData: Post = { title: title, content: content }
  //   this.http.post<{ name: string }>('https://ng-course-recipe-book-b111b-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json', postData).subscribe(
  //     responseData => {
  //       console.log(responseData);
  //     }, error => {
  //       this.error.next(error.message);
  //     }
  //   )
  // }

  /** แบบ create post แล้วก็  fetch post after created */
  createPost(title: string, content: string) {
    const postData: Post = { title: title, content: content }
    return this.http.post<{ name: string }>('https://ng-course-recipe-book-b111b-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json', postData)
      .pipe(
        mergeMap(() => this.getPosts())
      )
  }

  getPosts() {
    /** responsesData
       * {
      "-NiPi2zLG4uhgC4r92ij": {
          "content": "test content",
          "title": "test"
      },
      "-NiSq4-9i9xI2yhu-Hlv": {
          "content": "content of posts 2",
          "title": "post 2"
      }
    }
    * key =  -NiPi2zLG4uhgC4r92ij
    * key =  -NiSq4-9i9xI2yhu-Hlv
    *
    * { ...responseData[key], id: key } คือ
    *   {
    *     "content": "test content",
    *     "title": "test",
    *     "id": "-NiPi2zLG4uhgC4r92ij"
    *   }
    *
    */
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');

    return this.http.get<{ [key: string]: Post }>('https://ng-course-recipe-book-b111b-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json', {
      headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
      /**
       * https://ng-course-recipe-book-b111b-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json?print=pretty
       */
      // params: new HttpParams().set('print', 'pretty')
      params: searchParams
    })
      .pipe(
        /**
         * why square brackets are used?
         * myObj1: { myKey1: string; myKey2: string ; myKey3: string};
          myObj2: { [key: string]: string };

          constructor() {
            this.myObj1 = {
              myKey1: 'foo',
              myKey2: 'bar',
              myKey3: 'baz',
          };
          this.myObj2 = {
              myKey1: 'foo',
              myKey2: 'bar',
              myKey3: 'baz',
              otherKey: 'something else'
          };
          }
         */
        map(responseData => {
          const postsArr: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArr.push({ ...responseData[key], id: key });
            }
          }
          return postsArr;
        }),
        catchError(errorRes => {
          /** send to anlytics server or you can this.error.next(errorRes) too. OR if you have some generic error handling task you also wanna execute.
           *
           *
           * I think its useful in the case where your service is not subscribing to the event. Without catchError you would have no way to handle the error in the service code. The only place that would know about the error is the component. From what Max has said it seems better to keep the component code lean and focused on interacting with the HTML.
          */
          return throwError(() => new Error(errorRes));
        })
      )
  }

  deletePost() {
    return this.http.delete('https://ng-course-recipe-book-b111b-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json');
  }

}
