import { Lesson } from "./../model/lesson";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat } from "rxjs";
import { createObservable } from "../common/util";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild("searchInput", { static: true }) input: ElementRef;
  courseId: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params["id"];
    this.course$ = createObservable(`/api/courses/${this.courseId}`);
    this.lessons$ = this.loadLessons();
  }

  ngAfterViewInit() {
    const searchLeason$ = fromEvent<any>(
      this.input.nativeElement,
      "keyup"
    ).pipe(
      map((e) => e.target.value),
      debounceTime(400),
      distinctUntilChanged(),
      //concatMap((search) => this.lessons(search))
      switchMap((search) => this.loadLessons(search))
    );
    const initail$ = this.loadLessons();
    this.lessons$ = concat(initail$, searchLeason$);
  }
  loadLessons(search = ""): Observable<Lesson[]> {
    return createObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map((resp) => resp["payload"]));
  }
}
