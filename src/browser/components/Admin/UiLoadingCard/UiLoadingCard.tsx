import * as React from 'react';
import Loading from '../../Loading/Loading';
import UiCard from '../UiCard/UiCard';
import UiCardContent from '../UiCardContent/UiCardContent';
import UiCardTitle from '../UiCardTitle/UiCardTitle';
import { IUiLoadingCardProps } from './IUiLoadingCard';

import './UiLoadingCard.css';

export default class UiLoadingCard extends React.Component<IUiLoadingCardProps> {
  constructor(props: IUiLoadingCardProps) {
    super(props);
  }

  public render() {
    return (
      <UiCard className="UiLoadingCard">
        <UiCardTitle>
          Loading...
      </UiCardTitle>
        <UiCardContent>
          <Loading />
        </UiCardContent>
      </UiCard>
    );
  }
}
