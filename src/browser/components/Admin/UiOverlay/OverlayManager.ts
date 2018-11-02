import UiOverlay from './UiOverlay';

class OverlayManager {
  private items: UiOverlay[] = [];

  public add(instance: UiOverlay) {
    if (this.items.length > 0) {
      const lastItem = this.items[this.items.length - 1];
      lastItem.hide();
    }
    this.items.push(instance);
  }

  public remove(instance: UiOverlay) {
    const index = this.items.indexOf(instance);
    if (index >= 0) {
      this.items.splice(index);
      if (this.items.length > 0) {
        const lastItem = this.items[this.items.length - 1];
        lastItem.show();
      }
    }
  }
};

export const overlayManager = new OverlayManager();