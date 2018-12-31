import React from 'react';
import axios from 'axios'
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import App from './App';
import * as serviceWorker from './serviceWorker'
import reducers from './reducers'
import mySaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

const configureStore = (initialState) => {
  const store = createStore(
    reducers,
    initialState,
    compose(
      applyMiddleware(sagaMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    ),
  )

  return store
}

const setAxiosHeaders = () => {
  axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD
}

const store = configureStore()
sagaMiddleware.run(mySaga)
setAxiosHeaders()

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
