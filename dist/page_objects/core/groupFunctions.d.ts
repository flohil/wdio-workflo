declare const groupFunctions: {
    GetValue(filter: any): {
        values: Object;
        solve: (node: any) => any;
    };
    GetText(filter: any): {
        values: Object;
        solve: (node: any) => any;
    };
    SetValue(values: any): {
        values: any;
        solve: (node: any, value: any) => any;
    };
};
export default groupFunctions;
