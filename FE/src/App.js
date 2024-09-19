import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import NodeGraph from './NodeGraph';
import TimeSeriesChart from './TimeSeriesChart';
import './App.css';

const server = "http://localhost:5000";

const App = () => {
    const [data, setData] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const socket = io(server);

        socket.on('connect', () => {
          console.log('Connected to server');
      });

        socket.on('data', (newData) => {
            console.log('Received data:', newData);
            setData(prevData => [...prevData, newData]);
        });

        socket.on('message', (message) => {
            console.log('Received message:', message);
        });

        socket.on('device_down', notification => {
            console.log('Device down:', notification);
            notification['state'] = "down";
            setNotifications(prevNotifications => [...prevNotifications, notification]);
            alert(`Device ${notification.device_id} is down!`);
        });

        socket.on('device_start', notification => {
            console.log('Device start:', notification);
            notification['state'] = "running";
            setNotifications(prevNotifications => [...prevNotifications, notification]);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <div className='grid-container'>
                <div className='grid-item'>
                    <h2 style={{textAlign: 'center'}}>Dashboard</h2>
                    <div>
                        <NodeGraph />
                    </div>
                </div>
                <div className='grid-item'>
                    <h2 style={{textAlign: 'center'}}>Notifications</h2>
                    <ul>
                        {notifications.map((note, index) => (
                            <li key={index}>{note.device_id} is {note.state}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div>
                <TimeSeriesChart data={data}/>
            </div>
        </div>
    );
};

export default App;
