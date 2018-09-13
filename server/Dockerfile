FROM gerhardlr/tango_python:latest

#install dependencies
USER root

# Binds to port 8080
EXPOSE  8080

# Update and install pip
RUN apt-get update
RUN apt-get install python
RUN apt-get install -y python-pip
RUN pip install --upgrade pip

ENV TANGO_HOST=databaseds:10000


#create workdir conating source code for servcer side apps
RUN mkdir /server
ADD . /server/
WORKDIR /server

#install app specific libraries

RUN pip install -r requirements.txt

ENV FLASK_DEBUG=true
ENV FLASK_APP=devicewrapper.py


CMD ["tail","-f","/dev/null"]