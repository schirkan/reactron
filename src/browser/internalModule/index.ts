import { IComponentDefinition } from "../../interfaces/IComponentDefinition";
import { carouselLayoutDefinition } from "./CarouselLayout/CarouselLayoutDefinition";
import { gridLayoutDefinition } from "./GridLayout/GridLayoutDefinition";
import { iFrameDefinition } from "./IFrame/IFrameDefinition";
import { listLayoutDefinition } from "./ListLayout/ListLayoutDefinition";
import { markDownDefinition } from "./MarkDown/MarkDownDefinition";
import { notificationsDefinition } from "./Notifications/NotificationsDefinition";
import { welcomeDefinition } from "./Welcome/WelcomeDefinition";

export const components: IComponentDefinition[] = [
    listLayoutDefinition,
    carouselLayoutDefinition,
    gridLayoutDefinition,
    welcomeDefinition,
    markDownDefinition,
    notificationsDefinition,
    iFrameDefinition
];