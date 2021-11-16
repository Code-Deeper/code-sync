FROM node:14.18

LABEL version="1.0"
LABEL description="This is the base docker image for the codeSync Backend Nodejs & Express Server."
LABEL maintainer = ["codedeeper.work@gmail.com", "work.vivekjaviya@gmail.com"]

WORKDIR /usr/src/app/backend

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

EXPOSE 8080

CMD ["npm", "run", "server"]