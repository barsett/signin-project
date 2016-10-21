import Immutable from 'immutable';
import {
  Map,
  List,
  fromJS
} from 'immutable';
import * as types from '../actions/ActionTypes';
import debug from '../debug';
import { ERROR_SERVER, ERROR_NETWORK} from '../api/Common';

/* state = {
   dataSources: {
    <kodeSurvey> : [],
    <kodeSurvey> : [],
    <kodeSurvey> : [],
  },
  isLoading: {
   <kodeSurvey> : false,
   <kodeSurvey> : false,
   <kodeSurvey> : false,
  },


}

*/
const initialState = Immutable.fromJS({
  dataSources: {},
  isLoading : {},
});

const documentReducer = (state = initialState, action) => {
  switch(action.type){
    case types.DOC_FETCH_STARTED:
      state = state.setIn(['isLoading', action.kodeSurvey], true);

    break;

    case types.DOC_FETCH_RESULT:{
      const newDs = Immutable.fromJS(action.docs.content);
      state = state.setIn(['dataSources',action.kodeSurvey], newDs)
                  .setIn(['isLoading',action.kodeSurvey], false);
      break;
    }

    case types.DOC_FETCH_FAILED:
      state = state.setIn(['isLoading',action.kodeSurvey], false);


    break;

    case types.DOC_MARK_TOGGLE: {
      console.log("Toggle Doc Mark Status");
      const kodeSurvey = getKodeSurvey(action.doc);

      let currentDS = state.getIn(['dataSources', kodeSurvey]);
      let updatedDoc = action.doc;
      updatedDoc.mark = (typeof updatedDoc.mark != undefined) ? !updatedDoc.mark : true;

      const index = findIndex(updatedDoc, currentDS);
      const newDS = currentDS.set(index, Immutable.fromJS(updatedDoc));

      state = state.setIn(['dataSources', kodeSurvey], newDS);

      break;
    }

    case types.DOC_ADD_STARTED: {
      console.log("Update Document List State");
      const kodeSurvey = getKodeSurvey(action.doc);

      let currentDS = state.getIn(['dataSources', kodeSurvey]);

      // init DS if empty
      if (!currentDS) {
        currentDS = Immutable.fromJS([]);
      }

      currentDS = currentDS.push(Immutable.fromJS(action.doc));
      state = state.setIn(['dataSources', kodeSurvey], currentDS);

      break;
    }

    case types.DOC_ADD_RESULT: {
      console.log("Document Add Result");
      const kodeSurvey = getKodeSurvey(action.doc);
      console.log("Document Add Result " + kodeSurvey);

      let currentDS = state.getIn(['dataSources', kodeSurvey]);

      const newDS = _updateNewDoc(action.doc, currentDS);
      state = state.setIn(['dataSources', kodeSurvey], newDS);

      break;
    }

    case types.DOC_ADD_PROGRESS: {
      console.log("Update Document Upload Progress");
      const kodeSurvey = getKodeSurvey(action.doc);

      let currentDS = state.getIn(['dataSources', kodeSurvey]);

      const newDS = _updateNewDoc(action.doc, currentDS);
      state = state.setIn(['dataSources',kodeSurvey], newDS);

      break;
    }

    case types.DOC_ADD_FAILED: {
      console.log("Update Document List State");
      const kodeSurvey = getKodeSurvey(action.doc);

      let currentDS = state.getIn(['dataSources', kodeSurvey]);

      // init DS if empty
      const newDS = _updateNewDoc(action.doc, currentDS);
      state = state.setIn(['dataSources', kodeSurvey], newDS);

      break;
    }


    case types.DOC_DELETE_STARTED: {
      console.log("Update Document List State");
      const kodeSurvey = getKodeSurvey(action.doc);

      let currentDS = state.getIn(['dataSources', kodeSurvey]);

      // init DS if empty

      break;
    }

    case types.DOC_DELETE_RESULT: {
      const kodeSurvey = getKodeSurvey(action.doc);
      console.log("Delete Document SurveyID: " + kodeSurvey);

      let currentDS = state.getIn(['dataSources', kodeSurvey]);

      const index = findIndex(action.doc, currentDS);
      state = state.setIn(['dataSources',kodeSurvey], currentDS.delete(index));

      break;
    }

    case types.DOC_DELETE_FAILED: {
      console.log("Delete Document Failed");
      const kodeSurvey = getKodeSurvey(action.doc);

      let currentDS = state.getIn(['dataSources', kodeSurvey]);

      // init DS if empty

      break;
    }



    default:

    break;

  }

  return state;
}



const _updateNewDoc = (updatedDoc, currentDS) => {

  const index = findIndex(updatedDoc, currentDS);
  console.log("Index of updated doc: " + index);

  //update doc
  return currentDS.set(index, Immutable.fromJS(updatedDoc));

}


const findIndex = (doc, currentDS) => {
  const index = currentDS.findLastIndex((item) => {
    if ((doc.localBerkas && item.getIn(['localBerkas','idBerkas']) === doc.localBerkas.idBerkas) ||
      (doc.berkas && item.getIn(['berkas','idBerkas']) === doc.berkas.idBerkas)

    ){
      console.log("Matched doc found");
      return true;
    } else {
      return false;
    }
  });
  return index;
}

const getKodeSurvey = (doc) => {
  return (doc.localBerkas) ?  doc.localBerkas.kodeSurvey : doc.berkas.kodeSurvey ;

}


export default documentReducer;
