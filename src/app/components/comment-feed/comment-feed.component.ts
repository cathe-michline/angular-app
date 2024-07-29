import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { Comment } from 'src/app/models/comment.model';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-comment-feed',
  templateUrl: './comment-feed.component.html',
  styleUrls: ['./comment-feed.component.css']
})
export class CommentFeedComponent implements OnInit {
  comments: Comment[] = [];
  newCommentText = '';
  searchQuery = '';
  searchTerm$ = new Subject<string>(); // Subject to handle search term updates

  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
    this.loadComments();

    this.searchTerm$.pipe(
      debounceTime(300),
      switchMap(term => {
        if (term.trim() === '') {
          return this.commentService.getComments(); 
        } else {
          return this.commentService.searchComments(term);
        }
      }),
      catchError(err => {
        console.error('Search failed', err);
        return []; 
      })
    ).subscribe(comments => {
      this.comments = comments;
    });
  }

  loadComments(): void {
    this.commentService.getComments().subscribe(comments => {
      this.comments = comments;
    });
  }

  addComment(): void {
    if (this.newCommentText.trim()) {
      const newComment: Comment = { text: this.newCommentText.trim() };
      this.commentService.addComment(newComment).subscribe(() => {
        this.newCommentText = ''; 
        this.loadComments(); 
      });
    }
  }

  deleteComment(id: number): void {
    this.commentService.deleteComment(id).subscribe(() => {
      this.comments = this.comments.filter(comment => comment.id !== id);
    });
  }

  resetComments(): void {
    this.commentService.resetComments().subscribe(() => {
      this.loadComments();
    });
  }

  search(term: string): void {
    this.searchTerm$.next(term);
  }
}
