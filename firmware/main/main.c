
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "esp_log.h"
#include "driver/pulse_cnt.h"


#define PCNT_LOW_LIMIT -10000
#define PCNT_HIGH_LIMIT 10000

#define GPIO_A 26
#define GPIO_B 27


static bool on_reach(pcnt_unit_handle_t unit,
                     const pcnt_watch_event_data_t *edata,
                     void *user_ctx)
{
	BaseType_t high_task_wakeup;
	QueueHandle_t queue = (QueueHandle_t)user_ctx;
	xQueueSendFromISR(queue, &(edata->watch_point_value), &high_task_wakeup);
	return (high_task_wakeup == pdTRUE);
}

void app_main(void)
{
	pcnt_unit_config_t unit_config = {
		.low_limit = PCNT_LOW_LIMIT,
		.high_limit = PCNT_HIGH_LIMIT,
	};
	pcnt_unit_handle_t pcnt_unit = NULL;
	pcnt_new_unit(&unit_config, &pcnt_unit);

	pcnt_glitch_filter_config_t filter_config = {
		.max_glitch_ns = 20000,
	};
	pcnt_unit_set_glitch_filter(pcnt_unit, &filter_config);

	pcnt_chan_config_t chan_a_config = {
		.edge_gpio_num = GPIO_A,
		.level_gpio_num = GPIO_B,
	};
	pcnt_channel_handle_t pcnt_chan_a = NULL;
	pcnt_new_channel(pcnt_unit, &chan_a_config, &pcnt_chan_a);
	pcnt_chan_config_t chan_b_config = {
		.edge_gpio_num = GPIO_B,
		.level_gpio_num = GPIO_A,
	};
	pcnt_channel_handle_t pcnt_chan_b = NULL;
	pcnt_new_channel(pcnt_unit, &chan_b_config, &pcnt_chan_b);

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

	pcnt_unit_add_watch_point(pcnt_unit, PCNT_LOW_LIMIT);
	pcnt_unit_add_watch_point(pcnt_unit, PCNT_HIGH_LIMIT);
	pcnt_event_callbacks_t cbs = {
		.on_reach = on_reach
	};
	QueueHandle_t queue = xQueueCreate(10, sizeof(int));
	pcnt_unit_register_event_callbacks(pcnt_unit, &cbs, queue);

	pcnt_unit_enable(pcnt_unit);
	pcnt_unit_clear_count(pcnt_unit);
	pcnt_unit_start(pcnt_unit);

	while (1) {
		static int reach_counter = 0;
		int v = 0;

		if (xQueueReceive(queue, &v, pdMS_TO_TICKS(50))) {
			reach_counter += v;
		} else {
			pcnt_unit_get_count(pcnt_unit, &v);
			printf("X:%d\r\n", v + reach_counter);
		}
	}
}
