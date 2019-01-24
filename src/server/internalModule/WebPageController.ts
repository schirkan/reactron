import { IWebPageController, IWebPageOptions } from '@schirkan/reactron-interfaces';
import { BackendService } from '../BackendService';

export class WebPageController implements IWebPageController {
  public async start(): Promise<void> { }

  public async deleteWebPage(id: string): Promise<void> {
    return BackendService.instance.webPageManager.remove(id);
  }

  public async getWebPages(): Promise<IWebPageOptions[]> {
    return BackendService.instance.webPageManager.getAll();
  }

  public async setWebPage(options: IWebPageOptions): Promise<IWebPageOptions> {
    return BackendService.instance.webPageManager.createOrUpdate(options);
  }
}