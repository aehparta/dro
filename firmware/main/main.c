
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "esp_log.h"
#include "driver/pulse_cnt.h"

#define PCNT_HIGH_LIMIT 2e9
#define PCNT_LOW_LIMIT -2e9

#define GPIO_A 0
#define GPIO_B 2


void app_main(void)
{
	pcnt_unit_config_t unit_config = {
		.high_limit = PCNT_HIGH_LIMIT,
		.low_limit = PCNT_LOW_LIMIT,
	};
	pcnt_unit_handle_t pcnt_unit = NULL;
	pcnt_new_unit(&unit_config, &pcnt_unit);

	pcnt_glitch_filter_config_t filter_config = {
		.max_glitch_ns = 1000,
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

	pcnt_unit_enable(pcnt_unit);
	pcnt_unit_clear_count(pcnt_unit);
	pcnt_unit_start(pcnt_unit);

	int pulse_count = 0;
	while (1) {
		pcnt_unit_get_count(pcnt_unit, &pulse_count);
		printf("X:%d\r\n", pulse_count);
		vTaskDelay((TickType_t)(100 / portTICK_PERIOD_MS));
	}
}
