import { IReactronComponentDefinition } from "@schirkan/reactron-interfaces";
import { carouselLayoutDefinition } from "./CarouselLayout/CarouselLayoutDefinition";
import { gridLayoutDefinition } from "./GridLayout/GridLayoutDefinition";
import { gridLayoutTileHeaderDefinition } from "./GridLayout/GridLayoutTileHeaderDefinition";
import { iFrameDefinition } from "./IFrame/IFrameDefinition";
import { listLayoutDefinition } from "./ListLayout/ListLayoutDefinition";
import { listLayoutItemHeaderDefinition } from "./ListLayout/ListLayoutItemHeaderDefinition";
import { markDownDefinition } from "./MarkDown/MarkDownDefinition";
import { notificationsDefinition } from "./Notifications/NotificationsDefinition";
import { welcomeDefinition } from "./Welcome/WelcomeDefinition";

export const components: IReactronComponentDefinition[] = [
    listLayoutDefinition,
    listLayoutItemHeaderDefinition,
    carouselLayoutDefinition,
    gridLayoutDefinition,
    gridLayoutTileHeaderDefinition,
    welcomeDefinition,
    markDownDefinition,
    notificationsDefinition,
    iFrameDefinition
];