import $ from 'jquery';
import { LCBO_API_BASE_URL, LCBO_API_KEY } from '../config/api';
import { buildQueryString } from '../api/helpers';

export const ACTION_TYPES = {
  getStores: 'GET_STORES',
  setStore: 'SET_STORE',
  handleBoundsChanged: 'BOUNDS_CHANGED',
  handleMapMounted: 'MAP_MOUNTED',
};

export function setStore() {
  return {
    type: ACTION_TYPES.setStore,
    payload: {
      test: 'test',
    },
  };
}

export function handleMapMounted(map) {
  return {
    type: ACTION_TYPES.handleMapMounted,
    payload: {
      map: map,
    },
  };
}

export function handleBoundsChanged() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch({
      type: ACTION_TYPES.handleBoundsChanged,
      payload: {
        lat: state.stores.map.getCenter().lat(),
        lon: state.stores.map.getCenter().lng(),
      },
    });
    getStores(state.stores.map.getCenter().lat(), state.stores.map.getCenter().lng() );
  };
}

export function getStores(lat, lon) {
  console.log('GET SORES');
  const queryString = buildQueryString({
    access_key: LCBO_API_KEY,
    lat: lat,
    lon: lon,
    where: 'has_wheelchair_accessability',
  });
  return function(dispatch) {
    debugger;
    stores: $.get(`${LCBO_API_BASE_URL}/stores?${queryString}`).then(
      response => {
        console.log(response.result);
        dispatch({
          type: ACTION_TYPES.getStores,
          payload: {
            stores: response.result,
          },
        });
      }, (error) => {console.log(error);}
    );
  };
}
