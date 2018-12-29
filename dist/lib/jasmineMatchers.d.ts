declare const customMatchers: {
    toHaveLength: () => {
        compare: (obj: any, length: any) => {
            pass: boolean;
            message: string;
        };
    };
    toMatchUrl: () => {
        compare: (obj: any, url: any) => {
            pass: boolean;
            message: any;
        };
    };
    toInclude: () => {
        compare: (obj: any, substr: any) => {
            pass: boolean;
            message: any;
        };
    };
    toEqualObject: () => {
        compare: (expectedObj: any, actualObj: any) => {
            pass: boolean;
            message: any;
        };
    };
};
export { customMatchers };
