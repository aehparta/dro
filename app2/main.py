import yaml

CONFIG_FILE = 'config.yaml'


if __name__ == '__main__':
    with open(CONFIG_FILE, 'r') as f:
        cfg = yaml.safe_load(f)
    print(cfg['sources'])
    print(cfg['machines'])
