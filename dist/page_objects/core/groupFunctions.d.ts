declare const groupFunctions: {
    GetValue(filter: any): {
        values: {
            [key: string]: boolean;
        };
        solve: (node: any) => any;
    };
    GetText(filter: any): {
        values: {
            [key: string]: boolean;
        };
        solve: (node: any) => any;
    };
    SetValue(values: any): {
        values: any;
        solve: (node: any, value: any) => any;
    };
};
export default groupFunctions;
