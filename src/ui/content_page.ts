module UI {

  export interface ContentPage {
    initialize : () => void;
    show : () => void;
    hide: () => void;
  };

  export class DummyPage {
    initialize() {}
    show() {}
    hide() {}
  }

}
