FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

#컨테이너가 켜지자마자 실행할 명령어 
#npm start : package.json의 scripts에 있는 start 명령어를 실행
CMD ["npm", "run", "start"]