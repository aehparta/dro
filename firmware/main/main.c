
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "esp_log.h"
#include "driver/pulse_cnt.h"

#include "x.h"

struct pcnt_unit {
	char *name;
	uint8_t gpio_a;
	uint8_t gpio_b;
	pcnt_unit_handle_t unit;
	QueueHandle_t queue;
	int reach_counter;
};

struct pcnt_unit units[] = {
	{ "x", 26, 27, NULL, NULL, 0 },
	{ "y", 26, 27, NULL, NULL, 0 }
};

#define UNITS_COUNT (sizeof(units) / sizeof(struct pcnt_unit))

#define PCNT_LOW_LIMIT -10000
#define PCNT_HIGH_LIMIT 10000


/* triggers when low or high limit is reached */
static bool on_reach(pcnt_unit_handle_t unit,
                     const pcnt_watch_event_data_t *edata,
                     void *user_ctx)
{
	BaseType_t high_task_wakeup;
	QueueHandle_t queue = (QueueHandle_t)user_ctx;
	xQueueSendFromISR(queue, &(edata->watch_point_value), &high_task_wakeup);
	return (high_task_wakeup == pdTRUE);
}

/* initialize quadrature encoder */
void qenc_init(struct pcnt_unit *pcnt)
{
	pcnt_unit_config_t unit_config = {
		.low_limit = PCNT_LOW_LIMIT,
		.high_limit = PCNT_HIGH_LIMIT,
	};
	pcnt_new_unit(&unit_config, &pcnt->unit);

	pcnt_glitch_filter_config_t filter_config = {
		.max_glitch_ns = 20000,
	};
	pcnt_unit_set_glitch_filter(pcnt->unit, &filter_config);

	pcnt_chan_config_t chan_a_config = {
		.edge_gpio_num = pcnt->gpio_a,
		.level_gpio_num = pcnt->gpio_b,
	};
	pcnt_channel_handle_t pcnt_chan_a = NULL;
	pcnt_new_channel(pcnt->unit, &chan_a_config, &pcnt_chan_a);
	pcnt_chan_config_t chan_b_config = {
		.edge_gpio_num = pcnt->gpio_b,
		.level_gpio_num = pcnt->gpio_a,
	};
	pcnt_channel_handle_t pcnt_chan_b = NULL;
	pcnt_new_channel(pcnt->unit, &chan_b_config, &pcnt_chan_b);

	pcnt_channel_set_edge_action(pcnt_chan_a,
	                             PCNT_CHANNEL_EDGE_ACTION_DECREASE,
	                             PCNT_CHANNEL_EDGE_ACTION_INCREASE);
	pcnt_channel_set_level_action(pcnt_chan_a,
	                              PCNT_CHANNEL_LEVEL_ACTION_KEEP,
	                              PCNT_CHANNEL_LEVEL_ACTION_INVERSE);
	pcnt_channel_set_edge_action(pcnt_chan_b,
	                             PCNT_CHANNEL_EDGE_ACTION_INCREASE,
	                             PCNT_CHANNEL_EDGE_ACTION_DECREASE);
	pcnt_channel_set_level_action(pcnt_chan_b,
	                              PCNT_CHANNEL_LEVEL_ACTION_KEEP,
	                              PCNT_CHANNEL_LEVEL_ACTION_INVERSE);

	pcnt->queue = xQueueCreate(10, sizeof(int));
	pcnt_unit_add_watch_point(pcnt->unit, PCNT_LOW_LIMIT);
	pcnt_unit_add_watch_point(pcnt->unit, PCNT_HIGH_LIMIT);
	pcnt_event_callbacks_t cbs = {
		.on_reach = on_reach
	};
	pcnt_unit_register_event_callbacks(pcnt->unit, &cbs, pcnt->queue);

	pcnt_unit_enable(pcnt->unit);
	pcnt_unit_clear_count(pcnt->unit);
	pcnt_unit_start(pcnt->unit);
}

void qenc_update(struct pcnt_unit *pcnt)
{
	int v = 0;
	if (xQueueReceive(pcnt->queue, &v, 0)) {
		pcnt->reach_counter += v;
	}
}

void app_main(void)
{
	for (int i = 0; i < UNITS_COUNT; i++) {
		qenc_init(&units[i]);
	}

	while (1) {
		for (int i = 0; i < UNITS_COUNT; i++) {
			qenc_update(&units[i]);
		}

		for (int i = 0; i < UNITS_COUNT; i++) {
			int v = 0;
			pcnt_unit_get_count(units[i].unit, &v);
			printf("%s=%d\r\n", units[i].name, v + units[i].reach_counter);
		}

		vTaskDelay(pdMS_TO_TICKS(10));
	}
}
