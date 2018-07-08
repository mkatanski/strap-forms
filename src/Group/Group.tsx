import * as React from "react"

export interface IGroupProps {

}

export class Group extends React.Component<IGroupProps> {
  static defaultProps: IGroupProps = {

  }

  public render(): JSX.Element {
    return (
      <input />
    );
  }
}
