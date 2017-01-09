import { OsdlPage } from './app.po';

describe('osdl App', function() {
  let page: OsdlPage;

  beforeEach(() => {
    page = new OsdlPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
