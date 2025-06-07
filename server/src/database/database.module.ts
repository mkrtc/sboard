import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseModuleConnectionOptions, DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {
  public static register(entities: Function[], options?: DatabaseModuleConnectionOptions): DynamicModule {
      return {
        module: DatabaseModule,
        imports: [DatabaseService.typeOrmConnection(entities, options)]
      }
    }
}
