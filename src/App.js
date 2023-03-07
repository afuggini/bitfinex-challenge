import './App.css';
import OrderBook from './OrderBook';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './dux/reducer';

function App() {
  const store = createStore(reducer);

  return (
    <Provider store={store}>
      <div className="App py-5">
        <OrderBook />
      </div>
    </Provider>
  );
}

export default App;
