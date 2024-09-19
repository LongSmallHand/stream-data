from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import subprocess
import threading
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="*")
devices = {}

def monitor_device(device_id, process):
    while process.poll() is None:
        time.sleep(1)
    socketio.emit('device_down', {'device_id': device_id})

@app.route('/')
def index():
    return 'Server is running'

@socketio.on('start_device')
def start_device(data):
    device_id = data['device_id']
    if device_id in devices:
        socketio.emit('error', {'message': f'Device {device_id} is already running.'})
        return

    process = subprocess.Popen(['python', f'{device_id}.py'])
    devices[device_id] = process
    threading.Thread(target=monitor_device, args=(device_id, process)).start()
    socketio.emit('device_started', {'message': f'Device {device_id} started.'})
    socketio.emit('device_start', {'device_id': device_id})

@socketio.on('stop_device')
def stop_device(data):
    device_id = data['device_id']
    if device_id not in devices:
        socketio.emit('error', {'message': f'Device {device_id} is not running.'})
        return

    devices[device_id].terminate()
    del devices[device_id]
    socketio.emit('device_stopped', {'message': f'Device {device_id} stopped.'})

@socketio.on('connect')
def test_connect():
    print('Client connected')
    emit('message', 'Connected')

@socketio.on('data')
def handle_data(data):
    print(f"Received data: {data}")
    # Lưu trữ dữ liệu vào cơ sở dữ liệu hoặc xử lý dữ liệu
    emit('data_response', {'status': 'received'})

    # print(f"Forward data")
    # Chuyển tiếp dữ liệu
    emit('data', data, broadcast = True)

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True)