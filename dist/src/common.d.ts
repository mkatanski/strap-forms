import { ReactNode } from 'react';
export interface IComponentProps {
    className?: string;
    name: string;
    componentRenderer?: () => ReactNode;
}
