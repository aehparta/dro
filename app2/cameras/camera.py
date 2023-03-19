
import time
import cv2
from process import Process
from log import LOG_DEBUG

DEFAULT_FRAME_RATE = 5  # frames per second
REOPEN_AFTER_FAILURE_DELAY = 5.0  # seconds


class Camera(Process):
    def __init__(self, id, cfg, queue):
        super().__init__(id, 'camera', cfg, queue)

    def run(self):
        cam = None
        timestamp = time.monotonic()

        while not self._shutdown.is_set():
            try:
                if not cam:
                    id = int(str(self.id).replace('/dev/video', ''))
                    cam = cv2.VideoCapture(id)
                if not cam.isOpened():
                    raise Exception('Unable to open')

                ok, frame = cam.read()

                if ok:
                    if self._cfg.get('mirror'):
                        frame = cv2.flip(frame, 1)
                    _, data = cv2.imencode(".jpg", frame)
                    jpeg = data.tobytes()
                    self.send(image=jpeg)
            except Exception as e:
                if cam:
                    cam.release()
                cam = None
                self.log(LOG_DEBUG, f'capturing failed, exception: {e}')
                time.sleep(REOPEN_AFTER_FAILURE_DELAY)

            delay = 1 / self._cfg.get('frame_rate', DEFAULT_FRAME_RATE)
            self.pause(timestamp + delay)
            timestamp = time.monotonic()

        if cam:
            cam.release()

        cv2.destroyAllWindows()
