import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          // url: 'postgresql://postgres:ThanhNC40@FPT@localhost:5434/testdb?schema=public'
          url: configService.get('DATABASE_URL'),
        },
      },
    })

    console.log('Check Config: ', JSON.stringify(configService.get('DATABASE_URL')))
  }

  // Remove data of table
  cleanDatabase() {
    // 1-to-Many relationship
    // Remove data of Many data first

    // should put them in One Transaction 
    // (like Promise All - if fail rollback and non apply any script)

    console.log('Clear Database')
    
    return this.$transaction([
      this.note.deleteMany(),
      this.user.deleteMany(),
    ])

  }
}
