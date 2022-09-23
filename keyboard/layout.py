
import sys
import yaml


def key_to_code(value):
    key, *mods = value.split(',')
    keycode = 0
    modcode = 0

    if key in keycodes['keys']:
        keycode = keycodes['keys'][key]
    elif key.lower() in keycodes['keys']:
        modcode = keycodes['modifiers']['LSHIFT']
        keycode = keycodes['keys'][key.lower()]

    for mod in mods:
        if mod in keycodes['modifiers']:
            modcode |= keycodes['modifiers'][mod]

    return '{ ' + hex(modcode) + ', ' + hex(keycode) + ' }'


if __name__ == "__main__":
    with open("usb-hid-keys.yaml") as f:
        keycodes = yaml.safe_load(f)
        f.close()
    with open("layout.txt", "r") as f:
        lines = f.readlines()
        f.close()
    # with open("usb-hid-keymap.h") as f:
    #     pass
    f = sys.stdout

    rotate_180 = 'ROTATE_180\n' in lines

    rows = []
    for line in lines:
        row = [key_to_code(v.strip()) for v in line.split('\t')]
        if len(row) != 10:
            continue
        if rotate_180:
            row.reverse()
        rows.append('\t{ ' + ', '.join(row) + ' }')
    
    if rotate_180:
        rows.reverse()

    f.write('\n#ifndef _USB_HID_KEYMAP_\n#define _USB_HID_KEYMAP_\n\n')
    f.write('uint8_t usb_hid_keymap[6][10][2] = {\n')
    f.write(',\n'.join(rows))
    f.write('\n};\n\n#endif\n\n')
