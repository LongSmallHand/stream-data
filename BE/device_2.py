import random
import time
import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('Device 2 connected to server')

@sio.event
def disconnect():
    print('Device 2 disconnected from server')

@sio.event
def data_response(data):
    print(f"Device 2 received response: {data}")

sio.connect('http://localhost:5000')

while True:
    data = {
        'device_id': 'device_2',
        'value': random.randint(0, 99),  # Giá trị giả lập
        'timestamp': time.time(),
    }
    sio.emit('data', data)
    time.sleep(6)  # Gửi dữ liệu mỗi 10 giây
