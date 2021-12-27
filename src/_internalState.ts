import {mouseButtonNumbers} from './mouseButtonNumbers'

const mouseButtons = new Set<keyof typeof mouseButtonNumbers>()

function getButtonsMask(): number {
  let mask = 0;
  if (mouseButtons.has('left')) {
    mask |= 1;
  }
  if (mouseButtons.has('right')) {
    mask |= 2;
  }
  if (mouseButtons.has('middle')) {
    mask |= 4;
  }
  if (mouseButtons.has('back')) {
    mask |= 8;
  }
  if (mouseButtons.has('forward')) {
    mask |= 16;
  }
  return mask;
}

export const InternalState = {
    clear() {
        mouseButtons.clear()
    },
    mouseButtonDown(button: keyof typeof mouseButtonNumbers) {
        mouseButtons.add(button)
    },
    mouseButtonUp(button: keyof typeof mouseButtonNumbers) {
        mouseButtons.delete(button)
    },
    getButtonsMask,
}
