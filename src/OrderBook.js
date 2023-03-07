import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useOrderBook from './useOrderBook';
import { useSelector, useDispatch } from 'react-redux';

const precisionValues = ['P0', 'P1', 'P2', 'P3', 'P4'];

function OrderBook() {
  const orderBook = useSelector((state) => state);
  const dispatch = useDispatch();
  const [precision, setPrecision] = useState(0);

  const settings = useMemo(() => ({
    event: 'subscribe',
    channel: 'book',
    symbol: 'tBTCUSD',
    prec: precisionValues[precision],
    freq: 'F0'
  }), [precision]);

  const decreasePrecision = () => {
    const newValue = precision + 1;
    if (precisionValues[newValue]) {
      setPrecision(newValue);
    }
  }

  const increasePrecision = () => {
    const newValue = precision - 1;
    if (precisionValues[newValue]) {
      setPrecision(newValue);
    }
  }

  const data = useOrderBook(settings);

  const processSingleUpdate = useCallback((arrayOfUpdates) => {
    const [price, count, amount] = arrayOfUpdates;

    const shouldAddOrUpdate = count > 0;
    const shouldAddOrUpdateBids = shouldAddOrUpdate && amount > 0;
    const shouldDelete = count === 0;
    const shouldDeleteBids = shouldDelete && amount === 1;

    if (shouldAddOrUpdate) {
      dispatch({
        type: shouldAddOrUpdateBids ? 'UPDATE_BID' : 'UPDATE_ASK',
        payload: { price, count, amount }
      })
    } else if (shouldDelete) {
      dispatch({
        type: shouldDeleteBids ? 'DELETE_BID' : 'DELETE_ASK',
        payload: { price, count, amount }
      })
    }
  }, [dispatch]);

  useEffect(() => {
    try {
      const isInitialData = Array.isArray(data) && Array.isArray(data[1]) && data[1].length === 50;
      const isUpdateData = Array.isArray(data) && Array.isArray(data[1]) && data[1].length === 3;

      if (isInitialData) {
        const updates = data[1];
        updates.forEach(processSingleUpdate);
      } else if (isUpdateData) {
        const update = data[1];
        processSingleUpdate(update);
      }
    } catch (e) {
      console.error(e);
    }
  }, [data, processSingleUpdate]);

  return (
    <div className="container">
      <h1 className="mb-5">Bitfinex Order Book</h1>
      <div className="mb-5">
        <h4>Precision</h4>
        <div className="btn-group btn-group-sm" role="group">
          <button type="button" className="btn btn-primary" onClick={(e) => increasePrecision() } disabled={precision === 0}>+</button>
          <button type="button" className="btn btn-primary" onClick={(e) => decreasePrecision() } disabled={precision === precisionValues.length - 1}>-</button>
        </div>
      </div>
      <div className="tableContainer">
        <div>
          <h3>Bid</h3>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Count</th>
                <th>Amount</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(orderBook.bid).reverse().map(({ price, amount, count }, index) => (
                <tr key={`bids-${index}`}>
                  <td>{count}</td>
                  <td>{amount}</td>
                  <td>{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Ask</h3>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Price</th>
                <th>Amount</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(orderBook.ask).map(({ price, amount, count }, index) => (
                <tr key={`asks-${index}`}>
                  <td>{price}</td>
                  <td>{amount * -1}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderBook;
