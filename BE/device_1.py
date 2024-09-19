import random
import time
import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('Device 1 connected to server')

@sio.event
def disconnect():
    print('Device 1 disconnected from server')

@sio.event
def data_response(data):
    print(f"Device 1 received response: {data}")

sio.connect('http://localhost:5000')

while True:
    data = {
        'device_id': 'device_1',
        'value': random.randint(0, 99), # Giá trị giả lập 
        'timestamp': time.time(),
        # 'device_status': "running",
    }
    sio.emit('data', data)
    sio.emit('status', data)
    time.sleep(5)  # Gửi dữ liệu mỗi 5 giây
