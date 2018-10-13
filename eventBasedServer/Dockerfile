FROM gerhardlr/tango_python:latest

#install dependencies
USER root

# Binds to port 8080
EXPOSE  8080

# Update and install pip
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.5 \
    python3-pip \
    && \
apt-get clean && \
rm -rf /var/lib/apt/lists/*
RUN pip3 install --upgrade pip
RUN pip3 install -U pip setuptools
ENV TANGO_HOST=databaseds:10000


#create workdir conating source code for servcer side apps
RUN mkdir /server
ADD . /server/
WORKDIR /server

#install app specific libraries

RUN pip install -r requirements.txt


CMD ["tail","-f","/dev/null"]
