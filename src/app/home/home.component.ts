import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, timer } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { createObservable } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses: Observable<Course[]>;
  advancedCourses: Observable<Course[]>;
  constructor() {}

  ngOnInit() {
    const http$: Observable<Course[]> = createObservable("/api/courses");
    const courses$ = http$.pipe(
      map((resp) => resp["payload"]),
      shareReplay()
    );

    this.beginnerCourses = courses$.pipe(
      map((resp) => resp.filter((coures) => coures.category == "BEGINNER"))
    );
    this.advancedCourses = courses$.pipe(
      map((resp) => resp.filter((coures) => (coures.category = "ADVANCED")))
    );
  }
}
