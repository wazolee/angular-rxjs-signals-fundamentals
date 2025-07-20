import { concatMap, delay, mergeMap, of, range, switchMap } from "rxjs";

export class HigherOrderOperators {
    randomDelay() {
        return Math.floor(Math.random() * 1000) + 500;
    }

    constructor() {

        range(1, 5)
            .pipe(
                concatMap(i => of(i)
                    .pipe(
                        delay(this.randomDelay())
                    )),
            )
            .subscribe(v => console.log(v));

        range(11, 5)
            .pipe(
                mergeMap(i => of(i)
                    .pipe(
                        delay(this.randomDelay())
                    )),
            )
            .subscribe(v => console.log(v));

        range(21, 5)
            .pipe(
                switchMap(i => of(i)
                    .pipe(
                        delay(this.randomDelay())
                    )),
            )
            .subscribe(v => console.log(v));
    }

}