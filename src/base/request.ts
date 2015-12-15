module Base {
  export class Request {
    private on_finish_ : (success: boolean, data?: string) => void;
    private request_ : XMLHttpRequest;
    constructor(url: string,
                on_finish: (success: boolean, data?: string) => void) {
      this.on_finish_ = on_finish;

      this.request_ = new XMLHttpRequest();
      this.request_.open("GET", url, true);
      this.SubscribeToRequest(this.request_);
      this.request_.send();
    }

    SubscribeToRequest(request : XMLHttpRequest) {
      request.addEventListener('load', this.OnFinish.bind(this));
      request.addEventListener('error', this.OnFinish.bind(this));
      request.addEventListener('cancel', this.OnFinish.bind(this));
    }

    OnFinish(requestEvent : Event) {
      this.on_finish_(requestEvent.type == "load", this.request_.responseText);
    }
  }
}
