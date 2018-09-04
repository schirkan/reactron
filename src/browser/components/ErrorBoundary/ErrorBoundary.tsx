import * as React from 'react';

export default class ErrorBoundary extends React.Component<any, { error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  public componentDidCatch(error: any, info: any) {
    console.log(error);
    console.log(info);
    this.setState({ error });
  }

  public render() {
    if (this.state.error) {
      return (
        <React.Fragment>
          <h1>Something went wrong.</h1>
        </React.Fragment>
      );
    }
    return this.props.children;
  }
}