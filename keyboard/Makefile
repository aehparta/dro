
MCU = atmega328
CFLAGS = -Wall -Os -Iusbdrv -I. -DF_CPU=12000000L

COMPILE = avr-gcc -mmcu=$(MCU) $(CFLAGS)

OBJECTS = usbdrv/usbdrv.o usbdrv/usbdrvasm.o usbdrv/oddebug.o main.o


all: build

.c.o:
	$(COMPILE) -c $< -o $@

.S.o:
	$(COMPILE) -x assembler-with-cpp -c $< -o $@

flash: all
	avrdude -p $(MCU) -c avrisp2 -U flash:w:main.hex

fuses:
	avrdude -p $(MCU) -c avrisp2 -U lfuse:w:0xff:m -U hfuse:w:0xd1:m -U efuse:w:0xfd:m

clean:
	rm -f main.hex main.lst main.obj main.cof main.list main.map main.eep.hex main.bin *.o usbdrv/*.o main.s usbdrv/oddebug.s usbdrv/usbdrv.s

build: usb-hid-keymap $(OBJECTS)
	rm -f main.hex main.eep.hex
	$(COMPILE) -o main.bin $(OBJECTS)
	avr-objcopy -j .text -j .data -O ihex main.bin main.hex

usb-hid-keymap:
	python3 layout.py
