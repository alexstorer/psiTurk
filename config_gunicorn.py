
import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1

# Gunicorn doesn't like our import of config, so we wrap it in a funciton.
def from_config_file():
    global bind, accesslog, errorlog, loglevel
    from config import config
    
    # Address to bind
    bind = config.get("Server Parameters", "host") + ":" + config.get("Server Parameters", "port")
    #print bind
    
    # Logging
    # I can't tell if this would be too verbose:
    #accesslog = config.get("Server Parameters", "logfile")
    errorlog = config.get("Server Parameters", "logfile")
    loglevels = ["debug", "info", "warning", "error", "critical"]
    loglevel = loglevels[config.getint("Server Parameters", "loglevel")]
    
from_config_file()
bind = "http://ec2-54-225-6-125.compute-1.amazonaws.com:5001"
print "Running on:", bind
print "Logging to:", errorlog
