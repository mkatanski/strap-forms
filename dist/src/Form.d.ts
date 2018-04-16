import * as React from "react";
import * as PropTypes from 'prop-types';
import { IValidationManager } from './ValidationManager';
import { IEventsManager } from './EventsManager';
import { TInputData } from './Input';
import { ReactNode } from "react";
import { IComponentProps } from './common';
export interface IFormProps extends IComponentProps {
    children: any;
}
export declare type TFormRendererProps = {
    children: any;
    className: string;
    handleFormSubmit: () => {};
};
export declare type TFormOptions = {
    isPristine: boolean;
    isSubmitted: boolean;
    isTouched: boolean;
    isValid: boolean;
};
export declare type TFormChildContextTypes = {
    registerInput: (inputName: string, data: TInputData) => void;
    deregisterInput: (inputName: string) => void;
    getValidationManager: () => IValidationManager;
    getEventManager: () => IEventsManager;
};
export declare type TInputsData = {
    [key: string]: TInputData;
};
export declare class Form extends React.Component<IFormProps> {
    private _validationManager;
    private eventsManager;
    private inputsData;
    private _options;
    private _rendererProps;
    static defaultProps: IFormProps;
    static childContextTypes: {
        strapActions: PropTypes.Requireable<any>;
    };
    constructor(args: any);
    componentDidMount(): void;
    getChildContext(): {
        strapActions: TFormChildContextTypes;
    };
    private registerInput(inputName, data);
    private deregisterInput(inputName);
    private handleFormSubmit();
    private defaultRenderer(props);
    render(): ReactNode;
}
