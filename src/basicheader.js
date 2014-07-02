  var Observable = Rx.Observable,
    observableProto = Observable.prototype,
    AnonymousObservable = Rx.AnonymousObservable,
    disposableCreate = Rx.Disposable.create,
    CompositeDisposable = Rx.CompositeDisposable,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
    AsynsSubject = Rx.AsynsSubject,
    Subject = Rx.Subject,
    Scheduler = Rx.Scheduler,
    defaultNow = (function () { return !!Date.now ? Date.now : function () { return +new Date; }; }()),
    dom = Rx.DOM = {},
    ajax = Rx.DOM.Request = {},
    hasOwnProperty = {}.hasOwnProperty;
