import { Observable } from "rxjs";

export function createObservable(url) {
  return Observable.create((observer) => {
    const control = new AbortController();
    const signal = control.signal;
    fetch(url, { signal })
      .then((resp) => {
        return resp.json();
      })
      .then((body) => {
        observer.next(body);
        observer.complete();
      })
      .catch((err) => {
        observer.console.error(err);
      });
    return () => control.abort();
  });
}
