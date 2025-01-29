prisma: db cli
  npx prisma init (create a blank db schema)
  npx prisma migrate dev (update modify in prisma to database)
  npx prisma studio (UI view)

bash shell 
  docker exec -it dev-datebase bash (shell container)
  whoami
  psql -U postgres -W testdb (connect postges db)
  /dt
  exit


Env Management
  yarn add @nestjs/config

JWT
  Thay vi moi lan can lam gi do chung ta phai login
  login thanh cong se cap cho chung ta jwt(co thoi han) de dung no cho cac lan tiep theo
  yarn add @nestjs/jwt passport-jwt
  yarn add -D @types/passport-jwt
  yarn add @nestjs/passport passport


JWR Guard step
1. Need protect route by Guards
2. Guards required JWT_TOKEN
3. JWT_TOKEN will verify at validate of JWT strategy
4. Checking DB this id and email before return to REQ at controller


Custom Guards
Create new class extends AuthGuard('jwt') and using it for custome purpose

Custom @Decorator


Testing - PactumJS
setting script
Note: using absolute path and simulate module



env
- config module nestjs
- testing using dotenv (popular) (yarn add dotenv dotenv-cli)



new table
create controller, module, service for note

nest g co note --no-spec
nest g s note --no-spec

Config guards for this route
define route in controller
inject service to query data


