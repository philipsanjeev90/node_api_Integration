FROM node:4-onbuild
# replace this with your application's default port
RUN mkdir /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 8080
CMD [ "npm", "start" ]
