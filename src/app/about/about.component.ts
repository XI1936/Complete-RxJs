import { interval, merge } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { concat } from "rxjs/internal/observable/concat";
import { of } from "rxjs/internal/observable/of";
import { map, mergeMap } from "rxjs/operators";
import { createObservable } from "../common/util";
@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const source1$ = of(1, 2, 3);
    // const source2$ = interval(1000);
    const source3$ = of(4, 5, 6);
    const result$ = concat(source1$, source3$);
    result$.subscribe((resp) => console.log(resp));

    const interval$1 = interval(1000);
    const derivedInterval = interval$1.pipe(map((x) => 10 * x));
    const result2$ = merge(interval$1, derivedInterval);
    result2$.subscribe((val) => console.log(val));

    const cancelationObservable = createObservable("/api/courses");
    console.log("----subscription at line 28 ----");
    const sub = cancelationObservable.subscribe(console.log);
    setTimeout(() => {
      sub.unsubscribe();
    }, 0);
  }
}
