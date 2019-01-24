import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import { IServerInfo } from '@schirkan/reactron-interfaces';
import * as React from 'react';
import RoundButton from '../../components/RoundButton/RoundButton';
import logo from './logo.svg';
import { services } from '../../ReactronServicesFrontend';

import './Welcome.scss';

interface IWelcomeState {
  info?: IServerInfo;
}

export default class Welcome extends React.Component<any, IWelcomeState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    services.application.getServerInfo().then(info => {
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
