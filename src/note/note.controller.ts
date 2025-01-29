import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MyJwtGuard } from '../auth/guard';
import { NoteService } from './note.service';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';
import { GetUser } from '../auth/decorator';

@UseGuards(MyJwtGuard)
@Controller('notes')
export class NoteController {
    constructor(private noteService: NoteService) { }

    @Get()
    getNotes(
        @GetUser('id') userId: number // <-- get user call this api and assign to userId
    ) {
       return this.noteService.getNotes(userId)
    }

    // GET: .../notes/:id
    @Get(':id')
    getNoteById(
        @Param('id', ParseIntPipe) noteId: number
    ) {
       return this.noteService.getNoteById(noteId)
    }

    @Post()
    insertNote(
        @GetUser('id') userId: number,
        @Body() insertNoteDTO: InsertNoteDTO
    ) {
       return this.noteService.insertNote(userId, insertNoteDTO)
    }

    @Patch(':id')
    updateNoteById(
        @Param('id', ParseIntPipe) noteId: number, // built in validate of Nestjs
        @Body() updateNoteDTO: UpdateNoteDTO
    ) {
       return this.noteService.updateNoteById(noteId, updateNoteDTO)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete()
    deleteNoteById(
        @Query('id', ParseIntPipe) noteId: number,
    ) {
       return this.noteService.deleteNoteById(noteId)
    }
}
