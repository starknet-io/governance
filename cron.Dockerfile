FROM node:18.18.0-bullseye-slim
RUN apt-get update && apt-get upgrade -y \
      &&  apt -y --no-install-recommends install -y cron curl \
      # Remove package lists for smaller image sizes
      && rm -rf /var/lib/apt/lists/* \
      && which cron \
      && rm -rf /etc/cron.*/*

COPY workspaces/cron/crontab /cron
COPY workspaces/cron/entrypoint.sh /entrypoint.sh

WORKDIR /app
COPY . .
RUN yarn install

RUN crontab cron
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# https://manpages.ubuntu.com/manpages/trusty/man8/cron.8.html
# -f | Stay in foreground mode, don't daemonize.
# -L loglevel | Tell  cron  what to log about jobs (errors are logged regardless of this value) as the sum of the following values:
CMD ["cron","-f", "-L", "2"]
