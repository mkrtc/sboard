import { DynamicModule, Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export interface DatabaseModuleConnectionOptions{
    /**ENV KEY */
    host?: string;
    /**ENV KEY */
    port?: string;
    /**ENV KEY */
    username?: string;
    /**ENV KEY */
    password?: string;
    /**ENV KEY */
    database?: string;
}

@Injectable()
export class DatabaseService {

    public static typeOrmConnection(entities: Function[], options?: DatabaseModuleConnectionOptions): DynamicModule {
        return TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    type: "postgres",
                    host: options?.host ? configService.getOrThrow<string>(options.host) : configService.getOrThrow<string>("PG_HOST"),
                    port: options?.port ? configService.getOrThrow<number>(options.port) : configService.getOrThrow<number>("PG_PORT"),
                    username: options?.database ? configService.getOrThrow<string>(options.database) : configService.getOrThrow<string>("PG_USER"),
                    password: options?.password ? configService.getOrThrow<string>(options.password) : configService.getOrThrow<string>("PG_PASSWD"),
                    database: options?.database ? configService.getOrThrow<string>(options.database) : configService.getOrThrow<string>("PG_DB"),
                    entities: entities,
                    synchronize: true,
                    namingStrategy: new SnakeNamingStrategy(),
                    autoLoadEntities: true,
                    connectTimeoutMS: 5000
                }
            }
        })
    }

}
