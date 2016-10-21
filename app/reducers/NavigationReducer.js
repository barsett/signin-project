'use-strict'

import { Actions } from 'react-native-router-flux';
import { Fabric, Answers } from 'react-native-fabric';

const initialState = {
  pageTitle: null,
  pageId: null,
  stackSize: null,
};


const navigationReducer = (state = initialState, action) => {
  // Answers.logCustom('ReducerAction', {
  //   action: action.type
  // });

  switch (action.type) {
    case Actions.BEFORE_ROUTE:
      //console.log("Navigate:", action.type, action.name);
      state.pageId = action.route.name;
      state.pageTitle = action.route.title;

      state = {
        pageId: action.route.name,
        pageTitle: action.route.title,
        stackSize: action.route.parent.stack.length,
      };
      //state = action.route;

      return state;
    case Actions.AFTER_ROUTE:
      //console.log("Navigate:", action.type, action.name);
      state = {
        pageId: action.route.name,
        pageTitle: action.route.title,
        stackSize: action.route.parent.stack.length,
      };
      //console.log("Updating CurrentRoute", state);

      return state;
    case Actions.AFTER_POP:
      //console.log("Navigate:", action.type, action.name);
      state = {
        pageId: action.route.name,
        pageTitle: action.route.title,
        stackSize: action.route.parent.stack.length,
      };
      //console.log("Updating CurrentRoute", state);

      return state;
    case Actions.BEFORE_POP:
    case Actions.AFTER_DISMISS:
    case Actions.BEFORE_DISMISS:
    default:
      //console.log("Navigate:", action.type, action.name);

      return state;
  }
}

export default navigationReducer;
