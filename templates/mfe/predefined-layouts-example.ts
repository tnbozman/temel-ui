import { ComponentItemConfig, ItemType, LayoutConfig } from "golden-layout";


export interface Layout {
    name: string;
    config: LayoutConfig;
}

const exampleConfig: LayoutConfig = {
    root: {
        type: ItemType.row,
        content: [
            {
                type: "component",
                id: "exampleComponent",
                title: "Example",
                header: {
                    show: "top",
                },
                isClosable: true,
                componentType: 'GoldenLayoutExampleComponent',
                componentState: 'example',
            } as ComponentItemConfig
        ],
    },
};

const exampleLayout: Layout = {
    name: 'Example',
    config: exampleConfig,
};


export const predefinedLayouts: readonly Layout[] = [exampleLayout];
export const predefinedLayoutNames: readonly string[] = predefinedLayouts.map((layout) => layout.name);

