FROM gerhardlr/tango_python:latest

#install dependencies
USER root

# Install Node.js
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential
RUN npm install -g create-react-app
RUN npm install -g yarnpkg@0.15.1


RUN mkdir /client


# Binds to port 8080
EXPOSE  8080

# Update and install pip
RUN apt-get update
RUN apt-get install python
RUN apt-get install -y python-pip
RUN pip install --upgrade pip

ENV TANGO_HOST=databaseds:10000

#Install requirements

#create workdir conating source code for servcer side apps
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