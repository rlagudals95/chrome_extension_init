import {State} from "router5";

// tslint:disable:interface-name
declare module "redux-router5" {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface RouterState {
    route: State | null;
    previousRoute: State | null;
    transitionRoute: State | null;
    transitionError: any | null;
  }
}
