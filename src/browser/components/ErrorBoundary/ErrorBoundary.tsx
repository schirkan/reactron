import * as React from 'react';

interface IErrorBoundaryState {
  error: any;
}

export default class ErrorBoundary extends React.Component<any, IErrorBoundaryState> {
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
      return <span style={{ color: 'red' }}>Something went wrong.</span>;
    }
    return this.props.children;
  }
}