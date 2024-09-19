import random
import time
import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('Device 3 connected to server')

@sio.event
def disconnect():
    print('Device 3 disconnected from server')

@sio.event
def data_response(data):
    print(f"Device 3 received response: {data}")

sio.connect('http://localhost:5000')

while True:
    data = {
        'device_id': 'device_3',
        'value': random.randint(0, 99),  # Giá trị giả lập
        'timestamp': time.time(), 
    }
    sio.emit('data', data)
    time.sleep(7)  # Gửi dữ liệu mỗi 15 giây
