FROM gerhardlr/tango_python:latest

#install dependencies
USER root

# Update and install pip
RUN apt-get update
RUN apt-get install python
RUN apt-get install -y python-pip
RUN pip install --upgrade pip



ENV TANGO_HOST=databaseds:10000

#Install requirements

#create workdir conating source code
WORKDIR /app

#install app specific libraries
ADD requirements.txt /app/
RUN pip install -r requirements.txt

ENV FLASK_DEBUG=true
ENV FLASK_APP=devicewrapper.py

# uncomment if you want to install specific libraries for your code and specify in requirements.txt
#ADD requirements.txt /app/requirements.txt
#RUN pip install -r requirements.txt

CMD ["tail","-f","/dev/null"]