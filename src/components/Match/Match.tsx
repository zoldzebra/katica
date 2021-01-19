import React, { FC } from "react";
import { RouteComponentProps } from "react-router-dom";

interface RouteMatchParams {
  matchID: string;
}

export const MatchComponent: FC<RouteComponentProps<RouteMatchParams>> = (props) => {
  const { matchID } = props.match.params;

  return (
    <div>
      <h1>This is the match page for {matchID}</h1>
    </div>
  );
}