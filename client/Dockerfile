FROM node:14.18

LABEL version="1.0"
LABEL description="This is the base docker image for the codeSync frontend react app."
LABEL maintainer = [ "work.vivekjaviya@gmail.com"]

WORKDIR /usr/src/app/client

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]