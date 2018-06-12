import { createStore, applyMiddleware, compose, combineReducers, GenericStoreEnhancer, Store, StoreEnhancerStoreCreator, ReducersMapObject } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import * as StoreModule from './store';
import { ApplicationState, reducers } from './store';
import { History } from 'history';

export default function configureStore(history, initialState) {
    const createStoreWithMiddleware = compose(
        applyMiddleware(thunk, routerMiddleware(history)),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )(createStore);

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(reducers);
    const store = createStoreWithMiddleware(allReducers, initialState);

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./store', () => {
            const nextRootReducer = require('./store');
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
        });
    }

    return store;
}

function buildRootReducer(allReducers) {
    return combineReducers(Object.assign({}, allReducers, { routing: routerReducer }));
}
