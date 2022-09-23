/* Name: main.c
 * Project: HID-Test
 * Author: Christian Starkjohann
 * Creation Date: 2006-02-02
 * Tabsize: 4
 * Copyright: (c) 2006 by OBJECTIVE DEVELOPMENT Software GmbH
 * License: GNU GPL v2 (see License.txt) or proprietary (CommercialLicense.txt)
 * This Revision: $Id$
 */

#include <stdint.h>
#include <stdbool.h>
#include <avr/io.h>
#include <avr/interrupt.h>
#include <avr/pgmspace.h>
#include <avr/wdt.h>
#include <util/delay.h>
#include <usbdrv.h>

#include "usb-hid-keymap.h"

static uint8_t report_buffer[2]; /* buffer for HID reports */
static uint8_t idle_rate;        /* in 4 ms units */

const PROGMEM char usbHidReportDescriptor[35] = {
	/* USB report descriptor */
	0x05,
	0x01, // USAGE_PAGE (Generic Desktop)
	0x09,
	0x06, // USAGE (Keyboard)
	0xa1,
	0x01, // COLLECTION (Application)
	0x05,
	0x07, //   USAGE_PAGE (Keyboard)
	0x19,
	0xe0, //   USAGE_MINIMUM (Keyboard LeftControl)
	0x29,
	0xe7, //   USAGE_MAXIMUM (Keyboard Right GUI)
	0x15,
	0x00, //   LOGICAL_MINIMUM (0)
	0x25,
	0x01, //   LOGICAL_MAXIMUM (1)
	0x75,
	0x01, //   REPORT_SIZE (1)
	0x95,
	0x08, //   REPORT_COUNT (8)
	0x81,
	0x02, //   INPUT (Data,Var,Abs)
	0x95,
	0x01, //   REPORT_COUNT (1)
	0x75,
	0x08, //   REPORT_SIZE (8)
	0x25,
	0x65, //   LOGICAL_MAXIMUM (101)
	0x19,
	0x00, //   USAGE_MINIMUM (Reserved (no event indicated))
	0x29,
	0x65, //   USAGE_MAXIMUM (Keyboard Application)
	0x81,
	0x00, //   INPUT (Data,Ary,Abs)
	0xc0  // END_COLLECTION
};


static void init(void)
{
	/* row selector */
	PORTC = 0xff;
	DDRC = 0xff;

	/* column listening */
	DDRB = 0;      /* all pins input */
	PORTB = 0xff;  /* activate all pull-ups */
	DDRD = 0x0f;   /* upper pins input except usb (reset) and serial */
	PORTD = 0xf0;  /* activate pull-ups except on usb and serial lines */
	_delay_ms(10); /* usb reset */
	DDRD = 0x03;   /* remove usb reset */

	/* configure timer 0 for a rate of 12M/(1024 * 256) = 45.78 Hz (~22ms) */
	TCCR0B = 5; /* timer 0 prescaler: 1024 */
}

/* The following function returns an index for the first key pressed. It returns 0 if no key is pressed. */
static uint8_t key_check(void)
{
	for (uint8_t y = 0, row = 0b100000; y < 60; y += 10, row >>= 1) {
		PORTC = ~row;
		_delay_us(1);

		if (!(PINB & 0b000001)) {
			return 1 + 0 + y;
		}
		if (!(PINB & 0b000010)) {
			return 1 + 1 + y;
		}
		if (!(PINB & 0b000100)) {
			return 1 + 2 + y;
		}
		if (!(PINB & 0b001000)) {
			return 1 + 3 + y;
		}
		if (!(PINB & 0b010000)) {
			return 1 + 4 + y;
		}
		if (!(PINB & 0b100000)) {
			return 1 + 5 + y;
		}

		if (!(PIND & 0b00010000)) {
			return 1 + 6 + y;
		}
		if (!(PIND & 0b00100000)) {
			return 1 + 7 + y;
		}
		if (!(PIND & 0b01000000)) {
			return 1 + 8 + y;
		}
		if (!(PIND & 0b10000000)) {
			return 1 + 9 + y;
		}
	}

	return 0;
}

static void report_generate(uint8_t key)
{
	(*(int *)report_buffer) = pgm_read_word(key == 40 ? usb_hid_keymap[60] : usb_hid_keymap[key]);
}

uint8_t usbFunctionSetup(uint8_t data[8])
{
	usbRequest_t *rq = (void *)data;

	usbMsgPtr = report_buffer;
	if ((rq->bmRequestType & USBRQ_TYPE_MASK) == USBRQ_TYPE_CLASS) { /* class request type */
		/* wValue: ReportType (highbyte), ReportID (lowbyte) */
		if (rq->bRequest == USBRQ_HID_GET_REPORT) {
			/* we only have one report type, so don't look at wValue */
			report_generate(key_check());
			return sizeof(report_buffer);
		} else if (rq->bRequest == USBRQ_HID_GET_IDLE) {
			usbMsgPtr = &idle_rate;
			return 1;
		} else if (rq->bRequest == USBRQ_HID_SET_IDLE) {
			idle_rate = rq->wValue.bytes[1];
		}
	} else {
		/* no vendor specific requests implemented */
	}
	return 0;
}

int main(void)
{
	uint8_t key = 0, last_key = 0;
	uint8_t idle_counter = 0;
	bool key_changed = false;

	wdt_enable(WDTO_2S);
	init();
	usbInit();

	/* main event loop */
	sei();
	while (1) {
		wdt_reset();
		usbPoll();

		if (TIFR0 & 1) { /* 22 ms timer */
			TIFR0 = 1;
			if (idle_rate != 0) {
				if (idle_counter > 4) {
					idle_counter -= 5; /* 22 ms in units of 4 ms */
				} else {
					idle_counter = idle_rate;
					key_changed = true;
				}
			}
		}

		key = key_check();
		if (last_key != key) {
			last_key = key;
			key_changed = true;
		}

		if (key_changed && usbInterruptIsReady()) {
			key_changed = false;
			/* use last key and not current key status in order to avoid lost
			 * changes in key status
			 */
			report_generate(last_key);
			usbSetInterrupt(report_buffer, sizeof(report_buffer));
		}
	}
	return 0;
}
