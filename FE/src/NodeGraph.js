import React, { useState, useEffect } from 'react';
import { Graph } from 'react-d3-graph';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

const NodeGraph = () => {
    const initialData = ({
        nodes: [{ id: 'initial_node' }],
        links: []
    });

    const [data, setData] = useState(initialData);

    const myConfig = {
        nodeHighlightBehavior: true,
        node: {
            color: 'lightgreen',
            size: 120,
            highlightStrokeColor: 'blue',
            fontSize: 12,
        },
        link: {
            highlightColor: 'lightblue'
        },
        d3: {
            alphaTarget: 0.05,
            gravity: -100,
            linkLength: 100,
            linkStrength: 1,
        },
        panAndZoom: true,
        translateX: 0,
        translateY: 0,
        zoom: 1,
        
        
    };

    useEffect(() => {
        const svgElement = document.querySelector('svg');
        if (svgElement) {
            svgElement.setAttribute('style', 'height: 400px; width: 100%;');
        }
    }, [data]);

    useEffect(() => {
        socket.on('device_started', (data) => {
            console.log(data.message);
        });

        socket.on('device_stopped', (data) => {
            console.log(data.message);
        });

        socket.on('error', (data) => {
            console.error(data.message);
        });

        return () => {
            socket.off('device_started');
            socket.off('device_stopped');
            socket.off('error');
        };
    }, []);

    const addNode = () => {
        if (data.nodes.length >= 4) return;
        const newNodeId = `device_${data.nodes.length}`;
        const newNode = { id: newNodeId };
        const newLink = { source: data.nodes[0].id, target: newNodeId };

        setData(prevData => ({
            nodes: [...prevData.nodes, newNode],
            links: [...prevData.links, newLink],
        }));

        socket.emit('start_device', { device_id: newNodeId });
    };

    const removeNode = () => {
        if (data.nodes.length <= 1) return; // Prevent removing the last node

        const nodes = [...data.nodes];
        const links = [...data.links];

        const removedNode = nodes.pop();
        const updatedLinks = links.filter(link => link.source !== removedNode.id && link.target !== removedNode.id);

        setData({
            nodes,
            links: updatedLinks,
        });

        socket.emit('stop_device', { device_id: removedNode.id.toLowerCase() });
    };

    const center = () => {
        const svgElement = document.querySelector('svg');
        const gElement = svgElement.querySelector('g');

        // Get the bounding box of the entire graph
        const bbox = gElement.getBBox();

        // Calculate the center position
        const centerX = (svgElement.clientWidth / 2) - (bbox.width / 2) - bbox.x;
        const centerY = (svgElement.clientHeight / 2) - (bbox.height / 2) - bbox.y;

        gElement.setAttribute('transform', `translate(${centerX}, ${centerY})`, 'scale(1)');
    };

    useEffect(() => {
        center();
    }, []);

    return (
        <div className='graph-container'>
            <Graph
                id="graph-id"
                data={data}
                config={myConfig}
            />
            <div style={{textAlign: 'center', display: 'flex', justifyContent:'space-evenly'}}>
                <button onClick={addNode}>Add Node</button>
                <button onClick={removeNode}>Remove Node</button>
                <button onClick={center}>Center Graph</button>
            </div>
        </div>
        
    );
};

export default NodeGraph;
