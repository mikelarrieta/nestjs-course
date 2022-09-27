import {
   ForbiddenException,
   Injectable,
   NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";

@Injectable()
export class BookmarkService {
   constructor(private prisma: PrismaService) {}

   getBookmarks(userId: number) {
      return this.prisma.bookmark.findMany({
         where: {
            userId,
         },
      });
   }

   async getBookmarkById(userId: number, bookmarkId: number) {
      const bookmark = await this.prisma.bookmark.findFirst({
         where: {
            userId,
            id: bookmarkId,
         },
      });

      if (bookmark === null) throw new NotFoundException();

      return bookmark;
   }

   createBookmark(userId: number, dto: CreateBookmarkDto) {
      return this.prisma.bookmark.create({
         data: {
            userId,
            ...dto,
         },
      });
   }

   async editBookmarkById(
      userId: number,
      bookmarkId: number,
      dto: EditBookmarkDto,
   ) {
      const bookmark = await this.prisma.bookmark.findUnique({
         where: {
            id: bookmarkId,
         },
      });

      if (bookmark === null) {
         throw new NotFoundException();
      }

      if (bookmark.userId !== userId) {
         throw new ForbiddenException("Access to resources denied");
      }

      return this.prisma.bookmark.update({
         where: {
            id: bookmarkId,
         },
         data: {
            ...dto,
         },
      });
   }

   async deleteBookmarkById(userId: number, bookmarkId: number) {
      const bookmark = await this.prisma.bookmark.findUnique({
         where: {
            id: bookmarkId,
         },
      });

      if (bookmark === null) {
         throw new NotFoundException();
      }

      if (bookmark.userId !== userId) {
         throw new ForbiddenException("Access to resources denied");
      }

      await this.prisma.bookmark.delete({
         where: {
            id: bookmarkId,
         },
      });
   }
}
