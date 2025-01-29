import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';

@Injectable()
export class NoteService {
    constructor(private prismaService: PrismaService) { }

    async getNotes(userId: number) {
        const notes = await this.prismaService.note.findMany({
            where: {
                userId
            }
        })

        return notes
    }

    async getNoteById(noteId: number) {
        const note = await this.prismaService.note.findFirst({
            where: {
                id: noteId
            }
        })
        if (!note) {
            throw new NotFoundException('Note not found');
        }
        return note
    }

    async insertNote(userId: number, insertNoteDTO: InsertNoteDTO) {
        const note = await this.prismaService.note.create({
            data: {
                title: insertNoteDTO.title,
                description: insertNoteDTO?.description,
                url: insertNoteDTO.url,
                userId
            }
        })

        return note
    }

    async updateNoteById(noteId: number, updateNoteDTO: UpdateNoteDTO) {
        const note = await this.prismaService.note.findUnique({
            where: {
                id: noteId
            }
        })
        if (!note) {
            throw new ForbiddenException('Note not found for update');
        }

        return this.prismaService.note.update({
            data: {
                ...updateNoteDTO
            },
            where: {
                id: noteId,
            }
        })
    }

    async deleteNoteById(noteId: number) {
        const note = await this.prismaService.note.findUnique({
            where: {
                id: noteId
            }
        })
        if (!note) {
            throw new ForbiddenException('Note not found for delete');
        }

        return this.prismaService.note.delete({
            where: {
                id: noteId,
            }
        })
    }
}
