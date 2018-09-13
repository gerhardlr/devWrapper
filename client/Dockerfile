FROM gerhardlr/tango_python:latest

#install dependencies
USER root

# Install Node.js
RUN apt-get update
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential
RUN npm install -g create-react-app
RUN npm install -g yarnpkg@0.15.1

# Binds to port 8080
EXPOSE  8080

#create workdir conating source code for servcer side apps
RUN mkdir /dev-client
ADD /dev-client /dev-client


WORKDIR /dev-client

#install app specific libraries
RUN cd /dev-client
RUN npm install


CMD ["tail","-f","/dev/null"]