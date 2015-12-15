/// <reference path="../base/request.ts" />

/// <reference path="content_page.ts" />
/// <reference path="registration_page.ts"/>

module UI {

  interface ContentInfo {
    content: string;
    page: ContentPage;
    url: string;
    was_loaded: boolean;
  };

  function createContentInfo(url: string, page: ContentPage) : ContentInfo {
    return {
      url: url,
      content: "",
      was_loaded: false,
      page: page
    };
  }

  export class TopPanel {

    private static kActiveHeaderCellStyle = "active_header_cell";
    private static kHeaderCellStyle = "header_cell";
    private static kContentStyle = "content";

    private content_element_ : HTMLElement;
    private active_cell_ : number;
    private content_pages_urls_ : [ContentInfo];
    private header_cells_ : NodeListOf<Element>;

    constructor() {
      this.active_cell_ = 0;
      this.content_element_ = <HTMLElement>document.getElementsByClassName(
          TopPanel.kContentStyle).item(0);
      this.InitializePages();
      this.header_cells_= document.getElementsByClassName(
          TopPanel.kHeaderCellStyle);
      // Make first item active. It's always so.
      this.MakeCellActiveImpl(0);
      this.AddClickListeners();
    }

    private InitializePages(): void {
      this.content_pages_urls_ = [
        createContentInfo("search.html", new DummyPage()),
        createContentInfo("add.html", new DummyPage()),
        createContentInfo("cat.html", new DummyPage()),
        createContentInfo("fav.html", new DummyPage()),
        createContentInfo("faq.html", new DummyPage()),
        createContentInfo("reg.html", new DummyPage())
      ];
    }

    private AddClickListeners(): void {
      for (var i = 0; i < this.header_cells_.length; ++i) {
        var header = this.header_cells_.item(i);
        header.addEventListener('click', this.MakeCellActive.bind(this, i));
      }
    }

    private MakeCellActive(cell_index: number): void {
      console.assert(cell_index < this.header_cells_.length,
          "Can't activate cell if it's index is larger then number of cells");
      if (this.active_cell_ == cell_index)
        return;
      this.MakeCellActiveImpl(cell_index);
    }

    private MakeCellActiveImpl(cell_index: number): void {
      var active_cell = this.header_cells_.item(this.active_cell_);
      active_cell.classList.toggle(TopPanel.kActiveHeaderCellStyle);
      if (this.active_cell_ != cell_index) {
        // This match is possible at page initialization.
        var new_active_cell = this.header_cells_.item(cell_index);
        new_active_cell.classList.toggle(TopPanel.kActiveHeaderCellStyle);
      }
      this.active_cell_ = cell_index;

      // Load page content, if needed
      this.LoadActivePage();
    }

    private LoadActivePage(): void {
      var page = this.content_pages_urls_[this.active_cell_];
      if (!page.was_loaded) {
        this.TryNavigateTo(page.url);
      }
    }

    private TryNavigateTo(url: string): void {
      var request = new Base.Request(url, this.OnRequestFinished.bind(this));
    }

    private OnRequestFinished(success: boolean, data?: string): void {
      if (!success || !data)
        return;
      this.content_element_.innerHTML = data;
    }
  }
}
