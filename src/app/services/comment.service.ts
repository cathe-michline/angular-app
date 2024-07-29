import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Comment } from "../models/comment.model";

const API_PREFIX = "/api";

@Injectable({
  providedIn: "root"
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${API_PREFIX}/comments`);
  }

  getComment(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${API_PREFIX}/comments/${id}`);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${API_PREFIX}/comments`, comment);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${API_PREFIX}/comments/${id}`);
  }

  searchComments(query: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${API_PREFIX}/comments?q=${query}`);
  }

  resetComments(): Observable<any> {
    return this.http.post(`${API_PREFIX}/reset-comments`, {});
  }
}
