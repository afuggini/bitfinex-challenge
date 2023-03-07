import { useEffect, useState } from 'react';

const useOrderBook = (settings) => {
  const [rawData, setData] = useState();
  useEffect(() => {
    const socket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
    socket.addEventListener('open', function (event) {
      console.log('Connection established');
      socket.send(JSON.stringify(settings));
    });

    socket.addEventListener('message', function (event) {
      const data = JSON.parse(event.data);
      setData(data);
    });
    return () => socket.close();
  }, [settings])
  return rawData;
}

export default useOrderBook;
