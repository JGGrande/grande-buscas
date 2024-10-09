FROM node:20.13.0

RUN apt-get update -y
RUN apt-get install -y build-essential libpq-dev
RUN apt-get install -y openssl
RUN npm install -g yarn --force

RUN CHROMEDRIVER_VERSION=`curl -sS https://googlechromelabs.github.io/chrome-for-testing/LATEST_RELEASE_STABLE` && \
    echo $CHROMEDRIVER_VERSION &&\
    mkdir -p /opt/chromedriver-$CHROMEDRIVER_VERSION && \
    curl -sS -o /tmp/chromedriver_linux64.zip 	https://storage.googleapis.com/chrome-for-testing-public/$CHROMEDRIVER_VERSION/linux64/chromedriver-linux64.zip && \
    unzip -qq /tmp/chromedriver_linux64.zip -d /opt/chromedriver-$CHROMEDRIVER_VERSION && \
    rm /tmp/chromedriver_linux64.zip && \
    chmod +x /opt/chromedriver-$CHROMEDRIVER_VERSION/chromedriver-linux64/chromedriver && \
    ln -fs /opt/chromedriver-$CHROMEDRIVER_VERSION/chromedriver-linux64/chromedriver /usr/local/bin/chromedriver

RUN curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list && \
    apt-get -yqq update && \
    apt-get -yqq install google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*
    
WORKDIR /home/root/app

COPY . .

RUN yarn install --force

CMD yarn server