import * as React from "react";
import * as PropTypes from 'prop-types';
import { ReactNode } from "react";
import { IComponentProps } from './common';
import { TFormChildContextTypes } from './Form';
import { TSyncValidationMethod } from './Validators';
export interface IInputProps extends IComponentProps {
    value?: any;
    syncValidations?: Array<TSyncValidationMethod>;
}
export declare type TInputData = {
    value: any;
    isPristine: boolean;
    isTouched: boolean;
    isValid: boolean;
};
export declare type TInputRendererProps = {
    className: string;
    onChange: (e: any) => void;
    onBlur: (e: any) => void;
    value: any;
    name: string;
};
export declare class Input extends React.Component<IInputProps> {
    static defaultProps: IInputProps;
    static contextTypes: {
        strapActions: PropTypes.Requireable<any>;
    };
    private eventsManager;
    context: {
        strapActions: TFormChildContextTypes;
    };
    state: TInputData;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: any): void;
    private readonly _rendererProps;
    private handleInputBlur(e);
    private handleInputChange(e);
    private defaultRenderer(props);
    render(): ReactNode;
}
