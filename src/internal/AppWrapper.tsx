import React from 'react'

export class AppWrapper extends React.Component {
  public render(): JSX.Element {
    return <div style={{ marginTop: 10 }}>{this.props.children}</div>
  }
}
