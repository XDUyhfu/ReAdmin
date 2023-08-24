import type { Observable } from 'rxjs';
import {
    ReplaySubject,
    fromEvent,
    tap,
    merge,
    zipWith,
    map,
    takeUntil,
    EMPTY
} from 'rxjs';

export class WebWorkerPool<Task = any, Message = any> {
    private subject = new ReplaySubject<Task>(0, 0);
    private observables: Observable<Message>[] = [];
    private postMessage$: Observable<[Task, Worker]> = EMPTY;
    private subscribe$: Observable<Message> = EMPTY;
    private readonly free$;
    private readonly workerCtor;
    private readonly cancel$ = new ReplaySubject(0);

    constructor(
        ctor: new (...args: any[]) => Worker,
        concurrent: number = window.navigator.hardwareConcurrency
    ) {
        this.workerCtor = ctor;
        this.free$ = new ReplaySubject<Worker>(concurrent);
        this.init(concurrent);
    }

    private init(concurrent: number) {
        for (let i = 0; i < concurrent; i++) {
            const worker = new this.workerCtor();
            this.observables.push(
                // 这块可以在下载postmessage中转换为高阶Observable
                // 但是每次订阅大概会浪费不到10ms的时间
                // 所以提前订阅能节约一定时间
                fromEvent<MessageEvent>(worker, 'message').pipe(
                    takeUntil(this.cancel$),
                    map((e: MessageEvent) => e.data),
                    tap(() => {
                        this.free$.next(worker);
                    })
                )
            );
            this.free$.next(worker);
        }
        this.postMessage$ = this.subject.pipe(
            takeUntil(this.cancel$),
            zipWith(this.free$),
            tap(([task, wip]) => wip.postMessage(task))
        );
        this.subscribe$ = merge(...this.observables).pipe(
            takeUntil(this.cancel$)
        );
    }

    emit(payload: Task) {
        this.subject.next(payload);
    }

    subscribe(callback?: (message: Message) => void) {
        this.postMessage$.subscribe();
        this.subscribe$.subscribe(callback);
    }

    unsubscribe() {
        this.free$
            .pipe(
                tap((worker) => worker.terminate()),
                takeUntil(this.cancel$)
            )
            .subscribe();
        this.cancel$.next(null);
        this.cancel$.unsubscribe();
        this.free$.unsubscribe();
    }
}
