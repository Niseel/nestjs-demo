import { IsOptional, IsString } from "class-validator"

export class UpdateNoteDTO {
    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    url?: string
}

//   id          Int      @id @default(autoincrement())
//   title       String
//   description String
//   url         String
//   // another fields
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt

//   // relationships
//   userId      Int // like "foreing key"
//   user        User @relation(fields: [userId], references: [id])

//   // Name Table in Database
//   @@map("notes")