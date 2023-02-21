import yaml

CONFIG_FILE = 'config.yaml'

cfg = {}
with open(CONFIG_FILE, 'r') as f:
    cfg = yaml.safe_load(f)
