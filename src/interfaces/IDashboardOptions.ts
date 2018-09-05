export interface IDashboardTileComponent {
    moduleName: string;
    componentName: string;
    options: any;
}

export interface IDashboardTileLayout {
    row: number;
    col: number;
    rowspan: number;
    colspan: number;
}

export interface IDashboardTile {
    id: string;
    components: IDashboardTileComponent[];
    layout: IDashboardTileLayout;
}

export interface IDashboardLayout {
    gridRows: number;
    gridCols: number;
}

export interface IDashboardOptions {
    tiles: IDashboardTile[];
    layout: IDashboardLayout;
}