import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import { IReactronComponentProps } from '@schirkan/reactron-interfaces';
import * as React from 'react';
import { IServerInfo } from '../../../interfaces/IServerInfo';
import { apiClient } from '../../ApiClient';
import RoundButton from '../../components/RoundButton/RoundButton';
import logo from './logo.svg';

import './Welcome.css';

interface IWelcomeState {
  info?: IServerInfo;
}

export default class Welcome extends React.Component<IReactronComponentProps, IWelcomeState> {
  // import { IReactronComponentContext } from '@schirkan/reactron-interfaces';
  // public context: IReactronComponentContext;

  constructor(props: IReactronComponentProps) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    apiClient.getServerInfo().then(info => {
      this.setState({ info });
    });
  }

  public render() {
    let info;

    if (this.state.info) {
      info = (<div className="info">
        To edit this page click Admin-Button or visit<br /><br />
        <i>http://{this.state.info.ip}:3000/admin</i>
      </div>);
    }
    return (
      <section className="Welcome">
        <RoundButton to="/admin">
          <FontAwesome.FontAwesomeIcon icon={SvgIcons.faCog} />
          Admin
        </RoundButton>
        <img src={logo} className="logo" alt="logo" />
        <div className="title">Welcome to Reactron</div>
        {info}
      </section>
    );
  }
}
